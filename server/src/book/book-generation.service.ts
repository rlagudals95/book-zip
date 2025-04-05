import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './schemas/book.dto';
import { Interest } from 'src/subscriber/types';

@Injectable()
export class BookGenerationService {
  private readonly logger = new Logger(BookGenerationService.name);
  private isProcessing = false;

  constructor(
    @InjectModel('Book') private readonly bookModel: Model<BookDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 매일 새벽 1시에 실행되는 책 요약 생성 작업
   */

  //   @Cron(CronExpression.EVERY_DAY_AT_1AM)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async generateDailyBookSummary() {
    if (this.isProcessing) {
      this.logger.warn('이미 책 요약 생성 작업이 실행 중입니다');
      return;
    }

    this.isProcessing = true;
    this.logger.log('일일 책 요약 생성 작업 시작...');

    try {
      // 아직 요약되지 않은 책 찾기
      const bookToSummarize = await this.findBookToSummarize();

      if (!bookToSummarize) {
        this.logger.log('요약할 책이 없습니다. 새 책을 가져옵니다...');

        // 새 책 가져오기
        const newBook = await this.fetchAndCreateNewBook();

        if (!newBook) {
          this.logger.error('새 책을 가져오지 못했습니다. 작업을 종료합니다.');
          return;
        }

        const bookId = newBook._id as string;
        this.logger.log(`새로 가져온 책: ${newBook.title} (${bookId})`);

        // 새 책 요약 생성
        const summaryContent = await this.generateSummaryWithOpenAI(newBook);

        // 책 업데이트
        await this.bookModel.findByIdAndUpdate(bookId, {
          isSummarized: true,
          summary: summaryContent.content,
          keyPoints: summaryContent.keyPoints,
          readingTime: this.calculateReadingTime(summaryContent.content),
          summarizedAt: new Date(),
        });

        this.logger.log(`새 책 요약 생성 완료: ${newBook.title}`);
      } else {
        const bookId = bookToSummarize._id as string;
        this.logger.log(`요약할 책: ${bookToSummarize.title} (${bookId})`);

        // OpenAI API를 사용하여 책 요약 생성
        const summaryContent =
          await this.generateSummaryWithOpenAI(bookToSummarize);

        // 책 업데이트
        await this.bookModel.findByIdAndUpdate(bookToSummarize._id, {
          isSummarized: true,
          summary: summaryContent.content,
          keyPoints: summaryContent.keyPoints,
          readingTime: this.calculateReadingTime(summaryContent.content),
          summarizedAt: new Date(),
        });

        this.logger.log(`책 요약 생성 완료: ${bookToSummarize.title}`);
      }
    } catch (error) {
      this.logger.error(`책 요약 생성 오류: ${error.message}`, error.stack);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 요약할 책 찾기 (아직 요약되지 않은 책 중 가장 오래된 것)
   */
  private async findBookToSummarize(): Promise<BookDocument | null> {
    return this.bookModel
      .findOne({ isSummarized: false })
      .sort({ createdAt: 1 })
      .exec();
  }

  /**
   * 외부 API를 통해 새 책을 가져와 DB에 저장
   */
  public async fetchAndCreateNewBook(): Promise<BookDocument | null> {
    try {
      // 1. 베스트셀러 관련 키워드와 카테고리 선택
      const categories: Interest[] = [
        'self-improvement',
        'business',
        'startup',
        'it',
      ];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      // 한국어 베스트셀러 키워드 목록
      const bestsellerKeywords = [
        'best seller',
        'best seller 2024',
        'best seller 2023',
        'best seller 2022',
        'best seller 2021',
        'best seller 2020',
        'best seller 2019',
        'best seller 2018',
      ];
      const randomKeyword =
        bestsellerKeywords[
          Math.floor(Math.random() * bestsellerKeywords.length)
        ];

      // 검색어 구성 (카테고리 + 베스트셀러 키워드 + 언어 필터)
      const query = `subject:${encodeURIComponent(randomCategory)} ${encodeURIComponent(randomKeyword)}`;

      // 2. Google Books API 호출
      const apiKey = this.configService.get<string>('GOOGLE_BOOKS_API_KEY');
      const response = await firstValueFrom(
        this.httpService.get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=ko&maxResults=30&orderBy=relevance&printType=books&key=${apiKey}`,
        ),
      );

      this.logger.log(
        `구글 API 응답 받음: ${response.data.totalItems}개 항목 발견`,
      );

      const books = response.data.items || [];
      if (books.length === 0) {
        this.logger.warn(
          `'${randomCategory}' 카테고리에서 책을 찾을 수 없습니다.`,
        );
        return await this.fallbackToKoreanBookSearch();
      }

      // 3. 책 정보 검증 및 처리
      for (const book of books) {
        const volumeInfo = book.volumeInfo;

        // 한국어 책인지 확인
        if (volumeInfo.language !== 'ko') {
          continue;
        }

        // ISBN 확인
        const isbn = volumeInfo.industryIdentifiers?.find(
          (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10',
        )?.identifier;

        // 필수 정보 확인
        if (!isbn || !volumeInfo.title || !volumeInfo.authors) {
          continue;
        }

        // 이미 DB에 있는 책인지 확인
        const existingBook = await this.bookModel.findOne({ isbn }).exec();
        if (existingBook) {
          continue;
        }

        // 4. 책 정보 정리 및 저장
        const newBookData: CreateBookDto = {
          title: volumeInfo.title,
          author: Array.isArray(volumeInfo.authors)
            ? volumeInfo.authors.join(', ')
            : volumeInfo.authors,
          isbn: isbn,
          description: volumeInfo.description || '',
          publisher: volumeInfo.publisher || '',
          publishedYear: volumeInfo.publishedDate
            ? parseInt(volumeInfo.publishedDate.substring(0, 4))
            : null,
          categories: volumeInfo.categories || [randomCategory],
          coverImage: volumeInfo.imageLinks?.thumbnail || '',
        };

        // 한글 제목 및 저자 확인 (최소한 하나의 한글 문자 포함)
        const hasKoreanChar = (text: string) =>
          /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
        if (
          !hasKoreanChar(newBookData.title) &&
          !hasKoreanChar(newBookData.author)
        ) {
          continue; // 한글이 전혀 없는 책은 건너뛰기
        }

        const newBook = new this.bookModel(newBookData);
        await newBook.save();

        this.logger.log(
          `새 책이 DB에 추가되었습니다: ${newBook.title} (ISBN: ${isbn})`,
        );
        return newBook;
      }

      this.logger.warn(
        '적합한 한국어 책을 찾지 못했습니다. 대체 검색을 시도합니다.',
      );
      return await this.fallbackToKoreanBookSearch();
    } catch (error) {
      this.logger.error(`새 책 가져오기 실패: ${error.message}`, error.stack);
      return await this.fetchFromPreparedBestSellerList();
    }
  }

  /**
   * 직접적인 한국어 도서 검색 시도 (대체 검색)
   */
  private async fallbackToKoreanBookSearch(): Promise<BookDocument | null> {
    try {
      // 한국 베스트셀러 관련 검색어
      const koreanSearchTerms = [
        '한국 베스트셀러',
        '국내도서 베스트',
        '인기도서',
        '교보문고 베스트',
        '알라딘 베스트',
        'YES24 베스트',
      ];

      const randomTerm =
        koreanSearchTerms[Math.floor(Math.random() * koreanSearchTerms.length)];
      const apiKey = this.configService.get<string>('GOOGLE_BOOKS_API_KEY');

      const response = await firstValueFrom(
        this.httpService.get(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(randomTerm)}&langRestrict=ko&maxResults=40&printType=books&key=${apiKey}`,
        ),
      );

      const books = response.data.items || [];
      if (books.length === 0) {
        return await this.fetchFromPreparedBestSellerList();
      }

      // 후보 책 목록에서 한국어 책만 필터링
      const koreanBooks = books.filter(
        (book) =>
          book.volumeInfo.language === 'ko' &&
          book.volumeInfo.industryIdentifiers?.some(
            (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10',
          ),
      );

      if (koreanBooks.length === 0) {
        return await this.fetchFromPreparedBestSellerList();
      }

      // 무작위로 책 선택
      const randomBook =
        koreanBooks[Math.floor(Math.random() * koreanBooks.length)];
      const volumeInfo = randomBook.volumeInfo;

      // ISBN 가져오기
      const isbn = volumeInfo.industryIdentifiers?.find(
        (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10',
      )?.identifier;

      // 이미 DB에 있는지 확인
      const existingBook = await this.bookModel.findOne({ isbn }).exec();
      if (existingBook) {
        // 다른 책을 재귀적으로 검색
        return await this.fallbackToKoreanBookSearch();
      }

      // 새 책 생성
      const newBookData: CreateBookDto = {
        title: volumeInfo.title,
        author: Array.isArray(volumeInfo.authors)
          ? volumeInfo.authors.join(', ')
          : volumeInfo.authors || '알 수 없음',
        isbn: isbn,
        description: volumeInfo.description || '',
        publisher: volumeInfo.publisher || '',
        publishedYear: volumeInfo.publishedDate
          ? parseInt(volumeInfo.publishedDate.substring(0, 4))
          : null,
        categories: volumeInfo.categories || ['일반'],
        coverImage: volumeInfo.imageLinks?.thumbnail || '',
      };

      const newBook = new this.bookModel(newBookData);
      await newBook.save();

      this.logger.log(
        `대체 검색으로 새 책이 추가되었습니다: ${newBook.title} (ISBN: ${isbn})`,
      );
      return newBook;
    } catch (error) {
      this.logger.error(`대체 검색 실패: ${error.message}`);
      return await this.fetchFromPreparedBestSellerList();
    }
  }

  /**
   * 여러 출처에서 새 책을 가져오는 시도 (Google Books API 실패 시 대체 로직)
   */
  private async fetchNewBookFromMultipleSources(): Promise<BookDocument | null> {
    try {
      // Google Books API 시도
      const googleBook = await this.fetchAndCreateNewBook();
      if (googleBook) return googleBook;

      // Google Books API 실패 시 미리 준비된 베스트셀러 목록에서 가져오기
      return await this.fetchFromPreparedBestSellerList();
    } catch (error) {
      this.logger.error(`다중 소스 책 가져오기 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * 미리 준비된 베스트셀러 목록에서 책 가져오기 (백업 로직)
   */
  private async fetchFromPreparedBestSellerList(): Promise<BookDocument | null> {
    // 베스트셀러 목록 (실제 구현에서는 DB나 외부 API에서 가져올 수 있음)
    const bestSellers = [
      {
        title: '아몬드',
        author: '손원평',
        isbn: '9788936434267',
        description: '공감 능력을 상실한 소년의 특별한 성장을 그린 소설',
        publisher: '창비',
        publishedYear: 2017,
        categories: ['소설', '한국문학'],
        coverImage:
          'https://image.aladin.co.kr/product/11490/41/cover/8936434268_1.jpg',
      },
      {
        title: '사피엔스',
        author: '유발 하라리',
        isbn: '9788934972464',
        description: '인류의 역사와 미래에 대한 통찰',
        publisher: '김영사',
        publishedYear: 2015,
        categories: ['역사', '과학'],
        coverImage:
          'https://image.aladin.co.kr/product/5762/98/cover/8934972467_1.jpg',
      },
      {
        title: '어떻게 살 것인가',
        author: '유시민',
        isbn: '9788934972372',
        description: '삶의 방향과 가치를 찾아가는 여정',
        publisher: '생각의길',
        publishedYear: 2013,
        categories: ['자기계발', '에세이'],
        coverImage:
          'https://image.aladin.co.kr/product/5858/8/cover/8937834758_1.jpg',
      },
    ];

    for (const book of bestSellers) {
      // 이미 DB에 있는지 확인
      const existingBook = await this.bookModel
        .findOne({ isbn: book.isbn })
        .exec();
      if (existingBook) continue;

      // 새 책 생성
      const newBook = new this.bookModel(book);
      await newBook.save();

      this.logger.log(`백업 목록에서 새 책이 추가되었습니다: ${book.title}`);
      return newBook;
    }

    return null;
  }

  /**
   * OpenAI API를 사용하여 책 요약 생성
   */
  private async generateSummaryWithOpenAI(
    book: BookDocument,
  ): Promise<{ content: string; keyPoints: string[] }> {
    try {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');

      if (!apiKey) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다');
      }

      const prompt = `
        다음 책에 대한 상세한 요약본을 작성해주세요:
        
        제목: ${book.title}
        저자: ${book.author}
        설명: ${book.description || '정보 없음'}
        
        요약본은 다음내용으로 만들어주세요
        1. 핵심 요약 (2-3 문단)
        2. 주요 개념 (3-5개)
        3. 실용적인 통찰 (2-3개)

        책의 중요하거나 핵심이 되는 내용만 쏙쏙 요약해서 책의 인사이트를 짧게 요약해
        책을 다읽지 않아도 책을 다 읽은 것 같은 인사이트를 얻을 수 있도록 해주세요.
        
        줄바꿈 자연스럽게 작성해주세요.
        약 1,500단어로 작성해주세요.
      `;

      this.logger.log(`prompt: ${prompt}로 요약 생성 시작`);

      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4-turbo',
            messages: [
              {
                role: 'system',
                content:
                  '당신은 책 요약 전문가입니다. 책의 핵심 내용을 명확하고 간결하게 요약합니다.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const content = response.data.choices[0].message.content;

      // 핵심 포인트 추출을 위한 별도 요청
      const keyPointsResponse = await firstValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4-turbo',
            messages: [
              {
                role: 'system',
                content:
                  '당신은 책 요약 전문가입니다. 책의 핵심 포인트를 간결하게 추출합니다.',
              },
              {
                role: 'user',
                content: `"${book.title}" 책의 핵심 포인트 5개를 한 문장으로 간결하게 추출해주세요. JSON 형식으로 배열만 응답해주세요.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      let keyPoints: string[] = [];
      try {
        // JSON 형식에서 키 포인트 추출 시도
        const keyPointsContent =
          keyPointsResponse.data.choices[0].message.content;
        const jsonMatch = keyPointsContent.match(/\[[\s\S]*\]/);
        keyPoints = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      } catch (error) {
        this.logger.warn(`키 포인트 추출 실패: ${error.message}`);
        keyPoints = [];
      }

      return { content, keyPoints };
    } catch (error) {
      this.logger.error(`OpenAI 요약 생성 오류: ${error.message}`);
      throw new Error(`책 요약 생성 실패: ${error.message}`);
    }
  }

  /**
   * 읽는 시간 계산 (평균 읽기 속도 분당 200단어 기준)
   */
  private calculateReadingTime(content: string): string {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes}분`;
  }

  /**
   * 수동으로 책 요약 생성 (관리자용 API에서 사용)
   */
  async generateBookSummaryManually(bookId: string): Promise<BookDocument> {
    if (this.isProcessing) {
      throw new Error('이미 책 요약 생성 작업이 실행 중입니다');
    }

    this.isProcessing = true;
    try {
      const book = await this.bookModel.findById(bookId).exec();
      if (!book) {
        throw new Error(`책을 찾을 수 없습니다: ${bookId}`);
      }

      // 이미 요약된 책인지 확인
      if (book.isSummarized && book.summary) {
        return book;
      }

      // 요약 생성
      const summaryContent = await this.generateSummaryWithOpenAI(book);

      // 책 업데이트
      await this.bookModel.findByIdAndUpdate(bookId, {
        isSummarized: true,
        summary: summaryContent.content,
        keyPoints: summaryContent.keyPoints,
        readingTime: this.calculateReadingTime(summaryContent.content),
        summarizedAt: new Date(),
      });

      return this.bookModel.findById(bookId).exec();
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * API 키 없이 새로운 책 생성 테스트 (개발 환경용)
   */
  async generateRandomBookForTesting(): Promise<BookDocument> {
    const testBooks = [
      {
        title: '생각에 관한 생각',
        author: '대니얼 카너먼',
        isbn: '9788934972464' + Date.now().toString().slice(-4), // 중복 방지를 위한 랜덤 ISBN
        description:
          '노벨 경제학상을 수상한 심리학자가 밝히는 인간의 생각과 판단에 관한 혁명적인 통찰',
        publisher: '김영사',
        publishedYear: 2012,
        categories: ['심리학', '경제학'],
        coverImage: 'https://example.com/thinking-fast-and-slow.jpg',
      },
      {
        title: '미라클 모닝',
        author: '할 엘로드',
        isbn: '9788968331398' + Date.now().toString().slice(-4),
        description: '당신의 하루를 바꾸는 기적의 아침 습관',
        publisher: '한빛비즈',
        publishedYear: 2016,
        categories: ['자기계발', '습관'],
        coverImage: 'https://example.com/miracle-morning.jpg',
      },
    ];

    const randomBook = testBooks[Math.floor(Math.random() * testBooks.length)];
    const newBook = new this.bookModel(randomBook);
    await newBook.save();

    return newBook;
  }
}

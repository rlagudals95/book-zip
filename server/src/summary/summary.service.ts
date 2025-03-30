import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Summary, SummaryDocument } from './schemas/summary.schema';
import { BooksService } from '../books/books.service';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class SummaryService {
  private readonly logger = new Logger(SummaryService.name);
  private openai: ChatOpenAI;

  constructor(
    @InjectModel(Summary.name) private summaryModel: Model<SummaryDocument>,
    private booksService: BooksService,
    private configService: ConfigService,
  ) {
    // OpenAI 설정
    this.openai = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-4o', // 최신 모델 사용
      temperature: 0.5,
    });
  }

  async findAll(): Promise<SummaryDocument[]> {
    return this.summaryModel.find().exec();
  }

  async findById(id: string): Promise<SummaryDocument | null> {
    return this.summaryModel.findById(id).exec();
  }

  async findByBookId(bookId: string): Promise<SummaryDocument[]> {
    return this.summaryModel.find({ bookId }).exec();
  }

  async findByTags(tags: string[]): Promise<SummaryDocument[]> {
    return this.summaryModel.find({ tags: { $in: tags } }).exec();
  }

  async generateSummary(bookId: string): Promise<SummaryDocument | null> {
    try {
      const book = await this.booksService.findById(bookId);
      if (!book) {
        this.logger.error(`책 ID ${bookId}에 해당하는 책을 찾을 수 없습니다.`);
        return null;
      }

      // 이미 존재하는 요약 확인
      const existingSummary = await this.summaryModel
        .findOne({ bookId })
        .exec();
      if (existingSummary) {
        return existingSummary;
      }

      // 프롬프트 템플릿 생성
      const promptTemplate = new PromptTemplate({
        template: `
다음 책에 대한 간결하고 통찰력 있는 요약을 작성해주세요:

제목: {title}
저자: {author}
출판사: {publisher}
설명: {description}
카테고리: {categories}
태그: {tags}

요약은 다음을 포함해야 합니다:
1. 책의 핵심 아이디어와 주요 주장 (3-5개)
2. 중요한 인사이트 또는 깨달음
3. 실용적인 적용 방법이나 학습 포인트
4. 이 책이 독자들에게 어떤 도움이 될 수 있는지

최대 700단어 내로 작성해주세요. 문장은 명확하고 간결하게 작성하고, 책의 본질을 잘 전달해주세요.
`,
        inputVariables: [
          'title',
          'author',
          'publisher',
          'description',
          'categories',
          'tags',
        ],
      });

      // 프롬프트 생성
      const prompt = await promptTemplate.format({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        description: book.description || '정보 없음',
        categories: book.categories.join(', ') || '정보 없음',
        tags: book.tags.join(', ') || '정보 없음',
      });

      // AI로 요약 생성
      const content = await this.openai.invoke([prompt]);

      // 요약 저장
      const summary = await this.summaryModel.create({
        bookId: book._id,
        bookTitle: book.title,
        bookAuthor: book.author,
        content,
        tags: [...book.categories, ...book.tags],
      });

      return summary;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`요약 생성 중 오류 발생: ${err.message}`, err.stack);
      return null;
    }
  }

  async generateSummaryByInterests(
    interests: string[],
  ): Promise<SummaryDocument | null> {
    try {
      // 관심사에 맞는 책 중 랜덤으로 선택
      const book = await this.booksService.getRandomBookByInterests(interests);
      if (!book) {
        this.logger.warn('관심사에 맞는 책을 찾을 수 없습니다.');
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return this.generateSummary(book._id.toString());
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `관심사 기반 요약 생성 중 오류 발생: ${err.message}`,
        err.stack,
      );
      return null;
    }
  }
}

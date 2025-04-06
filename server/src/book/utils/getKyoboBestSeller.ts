import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

interface KyoboBookData {
  title: string;
  author: string;
  publisher: string;
  publishedYear?: number;
  isbn?: string;
  description?: string;
  coverImage?: string;
  categories?: string[];
  link?: string;
}

export async function getKyoboBestSellers(): Promise<KyoboBookData[]> {
  try {
    const url =
      'https://store.kyobobook.co.kr/api/gw/best/best-seller/online?page=1&per=20&period=001&dsplDvsnCode=000&dsplTrgtDvsnCode=001';

    const curlCommand = `curl -s -X GET "${url}" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"`;

    const { stdout } = await execPromise(curlCommand);

    const response = JSON.parse(stdout);

    console.log(response);

    const bestSellers = response.data.bestSeller.slice(0, 20); // 상위 20개만 추출

    const books: KyoboBookData[] = bestSellers.map((book: any) => {
      return {
        title: book.cmdtName,
        author: book.chrcName || '',
        publisher: book.pbcmName || '',
        publishedYear: book.pblictnYear
          ? parseInt(book.pblictnYear)
          : undefined,
        isbn: book.cmdtCode,
        description: book.prdtDescriptionHead || '',
        coverImage: book.cmdtImgPath || '',
        categories: book.categories || '',
        link: `https://product.kyobobook.co.kr/detail/${book.saleCmdtid}`,
      };
    });

    return books;
  } catch (error) {
    console.error('베스트셀러 크롤링 실패:', error);
    return [];
  }
}

// 더 상세한 정보가 필요한 경우 개별 도서 정보 가져오기
export async function getKyoboBookDetail(
  isbn: string,
): Promise<KyoboBookData | null> {
  try {
    const url = `https://product.kyobobook.co.kr/api/gw/pdt/product/${isbn}`;

    const curlCommand = `curl -s -X GET "${url}" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"`;

    const { stdout } = await execPromise(curlCommand);

    const response = JSON.parse(stdout);
    const bookData = response.data;

    if (!bookData) {
      return null;
    }

    return {
      title: bookData.cmdtName,
      author: bookData.chrcName || '',
      publisher: bookData.pbcmName || '',
      publishedYear: bookData.pblictnYear
        ? parseInt(bookData.pblictnYear)
        : undefined,
      isbn: bookData.cmdtCode,
      description:
        bookData.prdtDescription || bookData.prdtDescriptionHead || '',
      coverImage: bookData.cmdtImgPath || '',
    };
  } catch (error) {
    console.error(`도서 정보 크롤링 실패 (ISBN: ${isbn}):`, error);
    return null;
  }
}

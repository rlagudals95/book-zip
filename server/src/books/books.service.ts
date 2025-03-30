import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async findAll(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  async findById(id: string): Promise<BookDocument | null> {
    return this.bookModel.findById(id).exec();
  }

  async findByCategories(categories: string[]): Promise<BookDocument[]> {
    return this.bookModel.find({ categories: { $in: categories } }).exec();
  }

  async findByTags(tags: string[]): Promise<BookDocument[]> {
    return this.bookModel.find({ tags: { $in: tags } }).exec();
  }

  async findByInterests(interests: string[]): Promise<BookDocument[]> {
    // 사용자의 관심사에 기반한 책 검색
    // 관심사가 카테고리나 태그에 포함된 책을 찾음
    return this.bookModel
      .find({
        $or: [{ categories: { $in: interests } }, { tags: { $in: interests } }],
      })
      .exec();
  }

  async getRandomBookByInterests(
    interests: string[],
  ): Promise<BookDocument | null> {
    const books = await this.findByInterests(interests);
    if (books.length === 0) {
      return null;
    }

    // 랜덤으로 책 한 권을 선택
    const randomIndex = Math.floor(Math.random() * books.length);
    return books[randomIndex];
  }

  async create(bookData: Partial<Book>): Promise<BookDocument> {
    const newBook = new this.bookModel(bookData);
    return newBook.save();
  }

  async update(
    id: string,
    bookData: Partial<Book>,
  ): Promise<BookDocument | null> {
    return this.bookModel.findByIdAndUpdate(id, bookData, { new: true }).exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}

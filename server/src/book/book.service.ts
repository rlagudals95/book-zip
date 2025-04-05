import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './schemas/book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel('Book') private readonly bookModel: Model<BookDocument>,
  ) {}

  async findAll() {
    return this.bookModel.find().exec();
  }

  async findById(id: string) {
    return this.bookModel.findById(id).exec();
  }

  async findUnsummarizedBooks() {
    return this.bookModel
      .find({ isSummarized: false })
      .sort({ createdAt: 1 })
      .exec();
  }

  async findSummarizedBooks() {
    return this.bookModel
      .find({ isSummarized: true })
      .sort({ summarizedAt: -1 })
      .exec();
  }

  async createBook(bookData: CreateBookDto) {
    // ISBN이 있으면 중복 체크
    if (bookData.isbn) {
      const existingBook = await this.bookModel
        .findOne({ isbn: bookData.isbn })
        .exec();
      if (existingBook) {
        return existingBook;
      }
    }

    const newBook = new this.bookModel({
      ...bookData,
      isSummarized: false,
    });

    return newBook.save();
  }
}

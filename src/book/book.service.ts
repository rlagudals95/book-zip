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

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.bookModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.bookModel.countDocuments().exec(),
    ]);

    return {
      items,
      totalItems,
      page,
      totalPages: Math.ceil(totalItems / limit),
      itemsPerPage: limit,
    };
  }

  async findById(id: string) {
    return this.bookModel.findById(id).exec();
  }

  async findUnsummarizedBooks(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.bookModel
        .find({ isSummarized: false })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 1 })
        .exec(),
      this.bookModel.countDocuments({ isSummarized: false }).exec(),
    ]);

    return {
      items,
      totalItems,
      page,
      totalPages: Math.ceil(totalItems / limit),
      itemsPerPage: limit,
    };
  }

  async findSummarizedBooks(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.bookModel
        .find({ isSummarized: true })
        .skip(skip)
        .limit(limit)
        .sort({ summarizedAt: -1 })
        .exec(),
      this.bookModel.countDocuments({ isSummarized: true }).exec(),
    ]);

    return {
      items,
      totalItems,
      page,
      totalPages: Math.ceil(totalItems / limit),
      itemsPerPage: limit,
    };
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

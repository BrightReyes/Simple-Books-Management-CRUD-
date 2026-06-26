import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto, teacherId: number) {
    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        description: createBookDto.description,
        coverImage: createBookDto.coverImage || null,
        createdByTeacherId: teacherId,
      },
    });
  }

  async findAllByTeacher(teacherId: number) {
    return this.prisma.book.findMany({
      where: { createdByTeacherId: teacherId },
      orderBy: { id: 'desc' },
      include: {
        assignments: {
          include: {
            student: { select: { id: true, username: true } },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.book.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        teacher: {
          select: { id: true, username: true },
        },
      },
    });
  }

  async update(
    id: number,
    updateBookDto: { title?: string; description?: string },
  ) {
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: number) {
    // Delete all assignments associated with the book first
    await this.prisma.bookAssignment.deleteMany({
      where: { bookId: id },
    });
    // Then delete the book
    return this.prisma.book.delete({
      where: { id },
    });
  }
}

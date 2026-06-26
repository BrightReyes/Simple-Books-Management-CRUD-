import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async assignBook(studentId: number, bookId: number) {
    // Check for duplicate assignment
    const existing = await this.prisma.bookAssignment.findUnique({
      where: {
        studentId_bookId: { studentId, bookId },
      },
    });

    if (existing) {
      throw new ConflictException(
        'This book is already assigned to this student',
      );
    }

    return this.prisma.bookAssignment.create({
      data: { studentId, bookId },
      include: {
        student: { select: { id: true, username: true } },
        book: { select: { id: true, title: true } },
      },
    });
  }

  async getAssignedBooks(studentId: number) {
    const assignments = await this.prisma.bookAssignment.findMany({
      where: { studentId },
      include: {
        book: {
          include: {
            teacher: { select: { id: true, username: true } },
          },
        },
      },
    });

    return assignments.map((assignment) => assignment.book);
  }

  async getAssignmentsByTeacher(teacherId: number) {
    return this.prisma.bookAssignment.findMany({
      where: {
        book: { createdByTeacherId: teacherId },
      },
      include: {
        student: { select: { id: true, username: true } },
        book: { select: { id: true, title: true } },
      },
    });
  }

  async removeAssignment(studentId: number, bookId: number) {
    try {
      return await this.prisma.bookAssignment.delete({
        where: {
          studentId_bookId: { studentId, bookId },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        // Record doesn't exist, which means it's already unassigned
        return { success: true, message: 'Already unassigned' };
      }
      throw error;
    }
  }
}

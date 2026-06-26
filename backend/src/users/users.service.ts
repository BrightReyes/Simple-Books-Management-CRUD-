import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllStudents() {
    return this.prisma.user.findMany({
      where: { role: Role.STUDENT },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  async deleteStudent(id: number) {
    // Delete all assignments for the student first to satisfy foreign key constraints,
    // then delete the student record.
    return this.prisma.$transaction([
      this.prisma.bookAssignment.deleteMany({ where: { studentId: id } }),
      this.prisma.user.delete({ where: { id } })
    ]);
  }
}

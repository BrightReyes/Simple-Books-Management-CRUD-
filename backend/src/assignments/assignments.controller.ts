import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AssignmentsService } from './assignments.service';
import { AssignBookDto } from './dto/assign-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async assignBook(@Body() assignBookDto: AssignBookDto, @Request() req: any) {
    return this.assignmentsService.assignBook(
      assignBookDto.studentId,
      assignBookDto.bookId,
      req.user.id,
    );
  }

  @Get('my-books')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  async getMyBooks(@Request() req: any) {
    return this.assignmentsService.getAssignedBooks(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async getAssignments(@Request() req: any) {
    return this.assignmentsService.getAssignmentsByTeacher(req.user.id);
  }

  @Delete(':studentId/:bookId')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async removeAssignment(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Request() req: any,
  ) {
    return this.assignmentsService.removeAssignment(studentId, bookId, req.user.id);
  }
}

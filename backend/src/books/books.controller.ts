import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Role } from '@prisma/client';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `book-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          callback(new Error('Only image files are allowed!'), false);
        } else {
          callback(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }),
  )
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (file) {
      createBookDto.coverImage = `/uploads/${file.filename}`;
    }
    return this.booksService.create(createBookDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async findAll() {
    return this.booksService.findAllWithAssignments();
  }

  @Get('all')
  async findAllBooks() {
    return this.booksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}

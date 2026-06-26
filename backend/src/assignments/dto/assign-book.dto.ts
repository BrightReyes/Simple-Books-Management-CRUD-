import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignBookDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  studentId!: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  bookId!: number;
}

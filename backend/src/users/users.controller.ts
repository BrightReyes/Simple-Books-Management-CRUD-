import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('students')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async getStudents() {
    return this.usersService.findAllStudents();
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }
}

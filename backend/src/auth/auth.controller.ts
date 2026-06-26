import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for username: ${loginDto.username}`);
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto) {
    this.logger.log(`Signup attempt for username: ${signupDto.username}`);
    return this.authService.signup(signupDto.username, signupDto.password);
  }

  @Post('create-teacher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @HttpCode(HttpStatus.CREATED)
  createTeacher(@Body() signupDto: SignupDto) {
    this.logger.log(`Teacher creation attempt for username: ${signupDto.username}`);
    return this.authService.createTeacher(signupDto.username, signupDto.password);
  }
}

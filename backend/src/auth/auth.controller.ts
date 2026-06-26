import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

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
}

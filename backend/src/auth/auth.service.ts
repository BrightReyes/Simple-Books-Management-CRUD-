import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    this.logger.log(`Validating user: ${username}`);
    // Find user by username
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      this.logger.warn(`Login failed: User ${username} not found`);
      throw new UnauthorizedException('Invalid username or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for ${username}`);
      throw new UnauthorizedException('Invalid username or password');
    }

    this.logger.log(`User ${username} validated successfully. Generating JWT token.`);
    // Generate JWT token
    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async signup(username: string, password: string) {
    this.logger.log(`Signing up new student: ${username}`);
    
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      this.logger.warn(`Signup failed: Username ${username} already exists`);
      throw new UnauthorizedException('Username is already taken');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user explicitly as a STUDENT
    const newUser = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'STUDENT',
      },
    });

    this.logger.log(`Student ${username} created successfully.`);
    return {
      success: true,
      message: 'Signup successful. You can now log in.',
    };
  }
}

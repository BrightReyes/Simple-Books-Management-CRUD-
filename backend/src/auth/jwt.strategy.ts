import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env['JWT_SECRET'] || 'simple-books-jwt-secret-key-2024',
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.log(`Validating JWT payload for user ID: ${payload.sub}`);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      this.logger.warn(
        `JWT validation failed: User ID ${payload.sub} not found in database`,
      );
      throw new UnauthorizedException();
    }

    this.logger.log(`JWT validation successful for user: ${user.username}`);
    return { id: user.id, username: user.username, role: user.role };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const valid = await bcrypt.compare(dto.password, user.password);
      if (!valid) throw new UnauthorizedException('Invalid credentials');

      const payload = {
        sub: user._id?.toString() || user._id,
        email: user.email,
      };
      const token = this.jwt.sign(payload);

      return { access_token: token };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}

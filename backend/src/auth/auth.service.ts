import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly hashService: HashService,
  ) {}

  login(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }

  async validateUser(username: string, userPassword: string) {
    const user = await this.userService.findOneWithPasswordAndEmail(username);

    if (
      !user ||
      !this.hashService.verifyPassword(userPassword, user.password)
    ) {
      return null;
    }

    const { password: _, ...restParams } = user;
    return restParams;
  }
}

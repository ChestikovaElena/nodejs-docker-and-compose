import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/signup')
  registration(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }
}

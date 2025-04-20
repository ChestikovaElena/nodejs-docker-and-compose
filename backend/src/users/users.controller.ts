import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '../common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @Get('/me')
  getMe(@Req() req: RequestWithUser) {
    const { password, email, ...rest } = req.user;
    return rest;
  }

  @Get('/me/wishes')
  getMyWishes(@Req() req: RequestWithUser) {
    return this.usersService.getCurrentUserWishes(req.user);
  }

  @Get('/:username/wishes')
  getUserWishesByUsername(@Param() param: FindUserDto) {
    return this.usersService.getWishesByUsername(param.username);
  }

  @Patch('/me')
  updateMe(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    return this.usersService.updateOne(req.user, dto);
  }

  @Get('/:username')
  getUsername(@Param() param: FindUserDto) {
    return this.usersService.findByUsername(param.username);
  }

  @Post('/find')
  findUser(@Body() query: FindUsersDto) {
    return this.usersService.findMany(query);
  }
}

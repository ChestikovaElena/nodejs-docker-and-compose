import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto) {
    const { password, ...userParams } = dto;

    const hashedPassword = this.hashService.getHashedPassword(password);

    try {
      const { id, username, about, avatar, createdAt, updatedAt } =
        await this.userRepository.save({
          ...userParams,
          password: hashedPassword,
        });

      return { id, username, about, avatar, createdAt, updatedAt };
    } catch (err) {
      if ((err as { code: string }).code === '23505') {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
    }
  }

  async findOne(query: FindUserDto) {
    return await this.userRepository.findOneBy(query);
  }

  async findMany(dto: FindUsersDto) {
    return await this.userRepository.find({
      select: {
        id: true,
        password: false,
        email: false,
        username: true,
        about: true,
        avatar: true,
      },
      where: [
        { username: Like(`%${dto.query}%`) },
        { email: Like(`%${dto.query}%`) },
      ],
    });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return instanceToPlain(user);
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
        email: true,
        username: true,
        about: true,
        avatar: true,
      },
      where: {
        username,
      },
    });
  }

  async updateOne(authorizedUser: User, dto: UpdateUserDto) {
    Object.entries(dto).forEach(([key, value]) => {
      if (key === 'password' && typeof value === 'string') {
        const hashedPassword = this.hashService.getHashedPassword(value);
        dto[key] = hashedPassword;
      }
    });
    try {
      await this.userRepository.update(authorizedUser.id, dto);

      return await this.findById(authorizedUser.id);
    } catch (err) {
      if ((err as { code: string }).code === '23505') {
        throw new ConflictException(
          'Пользователь с таким email или username существует',
        );
      }
    }
  }

  async removeOne(authorizedUser: User) {
    try {
      return await this.userRepository.delete(authorizedUser.id);
    } catch {
      throw new ConflictException('При удалении пользователя произошла ошибка');
    }
  }

  async getCurrentUserWishes(user: User) {
    const searchedUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        wishes: true,
      },
    });

    if (!searchedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return searchedUser.wishes;
  }

  async getWishesByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь с таким ником не найден');
    }

    return user.wishes;
  }

  async findOneWithPasswordAndEmail(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: [
        'id',
        'password',
        'email',
        'createdAt',
        'updatedAt',
        'about',
        'avatar',
      ],
    });
    if (!user) throw new NotFoundException('такой пользователь не существует');
    return user;
  }
}

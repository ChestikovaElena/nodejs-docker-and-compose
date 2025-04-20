import {
  ConflictException,
  Controller,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wishes.entity';

const ITEMS_PER_PAGE = 10;

@Injectable()
@Controller('wishes')
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(authorizedUser: User, dto: CreateWishDto) {
    return await this.wishRepository.save({ ...dto, owner: authorizedUser });
  }

  getSelectOPtions() {
    return {
      id: true,
      name: true,
      link: true,
      image: true,
      price: true,
      raised: true,
      description: true,
      copied: true,
      createdAt: true,
      owner: {
        id: true,
        password: false,
        email: false,
        username: true,
        about: true,
        avatar: true,
      },
    };
  }

  async getWishById(id: number) {
    const wish = await this.wishRepository.findOne({
      relations: {
        offers: {
          user: true,
        },
        owner: true,
      },
      where: { id },
      select: this.getSelectOPtions(),
    });
    if (!wish) {
      throw new NotFoundException('Пожелание не найдено');
    }
    return wish;
  }

  async findAll(page?: number, limit?: number) {
    return await this.wishRepository.find({
      relations: {
        owner: true,
      },
      skip: page || 0,
      take: limit || ITEMS_PER_PAGE,
      select: this.getSelectOPtions(),
    });
  }

  async findMany(itemsId: number[]) {
    return await this.wishRepository.find({
      where: { id: In(itemsId) },
    });
  }

  async getTopWishes(count: number) {
    return await this.wishRepository.find({
      relations: {
        owner: true,
      },
      order: {
        copied: 'DESC',
      },
      take: count,
      select: this.getSelectOPtions(),
    });
  }

  async getLastWishes(count: number) {
    return await this.wishRepository.find({
      relations: {
        owner: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: count,
      select: this.getSelectOPtions(),
    });
  }

  async findOwnWishes(query: FindManyOptions) {
    return await this.wishRepository.find(query);
  }

  async checkEditingIsAvailable(authorizedUser: User, id: number) {
    const wish = await this.getWishById(id);

    if (!wish) {
      throw new NotFoundException(
        'Нельзя обновить или удалить, пожелание не найдено',
      );
    }

    if (authorizedUser.id !== wish.owner.id) {
      throw new ForbiddenException('Нельзя изменить чужое пожелание');
    }

    return wish;
  }

  async updateOne(authorizedUser: User, id: number, dto: UpdateWishDto) {
    const wish = await this.checkEditingIsAvailable(authorizedUser, id);

    if (wish.offers.length || !wish.raised) {
      throw new ForbiddenException(
        'Нельзя изменить, пользователи уже внесли денежные средства',
      );
    }

    try {
      await this.wishRepository.update(id, dto);
      return this.getWishById(id);
    } catch {
      throw new ConflictException('При обновлении пожелания произошла ошибка');
    }
  }

  async removeOne(authorizedUser: User, id: number) {
    const wish = await this.checkEditingIsAvailable(authorizedUser, id);

    if (wish.raised > 0) {
      throw new ForbiddenException(
        'Нельзя удалить, пользователи уже внесли денежные средства',
      );
    }

    try {
      return await this.wishRepository.delete(id);
    } catch {
      throw new ConflictException(
        'Нельзя удалить подарок, он используется в коллекции подарков',
      );
    }
  }

  async updateRaised(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException('Нельзя обновить, пожелание не найдено');
    }

    const raised = wish.offers.reduce(
      (sum, offer) => sum + Number(offer.amount),
      0,
    );

    await this.wishRepository.save({
      ...wish,
      raised,
    });
  }

  async copy(user: User, wishId: number) {
    const wish = await this.getWishById(wishId);

    if (wish.owner.id === user.id) {
      throw new NotFoundException('Такое пожелание у пользователя уже есть');
    }

    const {
      id,
      createdAt: _cA,
      updatedAt: _uA,
      raised: _r,
      copied: _c,
      ...wishWithoutRelations
    } = wish;

    try {
      await this.wishRepository.update(id, { copied: wish.copied + 1 });
      await this.wishRepository.save({ ...wishWithoutRelations, owner: user });
    } catch {
      throw new ConflictException('При копировании пожелания возникла ошибка');
    }
  }
}

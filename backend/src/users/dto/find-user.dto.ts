import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class FindUserDto extends PickType(User, ['username', 'email']) {}

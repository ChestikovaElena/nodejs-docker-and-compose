import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class HashService {
  getHashedPassword(password: string): string {
    return hashSync(password, genSaltSync(10));
  }

  verifyPassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}

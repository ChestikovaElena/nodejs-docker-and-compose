import { IsArray, IsNumber, IsString } from 'class-validator';

export class NoValidUserResponse {
  @IsNumber()
  statusCode: number;

  @IsArray()
  message: string[];

  @IsString()
  error: string;
}

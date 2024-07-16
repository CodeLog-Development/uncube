import { IsNumber, IsString } from 'class-validator';

export class CreateSolveDto {
  @IsNumber()
  millis: number;

  @IsNumber()
  timestamp: number;

  @IsString()
  scramble?: string;

  @IsString()
  penalty?: '+2' | 'dnf';
}

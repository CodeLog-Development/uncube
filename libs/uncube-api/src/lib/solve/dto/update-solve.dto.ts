import { CreateSolveDto } from './create-solve.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSolveDto extends PartialType(CreateSolveDto) { }

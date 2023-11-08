import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SolveService } from './solve.service';
import { CreateSolveDto } from './dto/create-solve.dto';
import { Solve } from './dto/solve.dto';
import { Request } from '../api.interface';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('solve')
export class SolveController {
  constructor(private solveService: SolveService) { }

  @Post()
  async createSolve(
    @Body() createSolve: CreateSolveDto,
    @Req() request: Request
  ): Promise<Solve> {
    if (!request.user) {
      throw new InternalServerErrorException(
        'Server is in an impossible state. Refusing to attempt operation!'
      );
    }

    return new Solve(
      await this.solveService.createSolve(createSolve, request.user)
    );
  }
}

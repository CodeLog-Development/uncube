import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SolveService } from './solve.service';
import { CreateSolveDto } from './dto/create-solve.dto';
import { DbSolve, SolveList } from './dto/solve.dto';
import { Request } from '../api.interface';
import { UpdateSolveDto } from './dto';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('solve')
export class SolveController {
  constructor(private solveService: SolveService) { }

  @Post()
  async createSolve(
    @Body() createSolve: CreateSolveDto,
    @Req() request: Request
  ): Promise<DbSolve> {
    if (!request.user) {
      throw new InternalServerErrorException(
        'Server is in an impossible state. Refusing to attempt operation!'
      );
    }

    return new DbSolve(
      await this.solveService.createSolve(createSolve, request.user)
    );
  }

  @Get()
  async getSolves(@Req() request: Request): Promise<SolveList> {
    if (!request.user) {
      throw new InternalServerErrorException(
        'Server is in an impossible state. Refusing to attempt operation!'
      );
    }

    return {
      solves: (await this.solveService.getSolves(request.user)).map(
        (solve) => ({
          id: solve.id,
          millis: solve.millis,
          penalty: solve.penalty,
          scramble: solve.scramble,
          timestamp: solve.timestamp.toMillis(),
        })
      ),
    };
  }

  @Delete(':id')
  async deleteSolve(@Param('id') id: string, @Req() request: Request) {
    if (!request.user) {
      throw new InternalServerErrorException(
        'Server is in an impossible state. Refusing to attempt operation!'
      );
    }

    await this.solveService.deleteSolve(id, request.user);
  }

  @Patch(':id')
  async updateSolve(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() updateSolve: UpdateSolveDto
  ) {
    if (!request.user) {
      throw new InternalServerErrorException(
        'Server is in an impossible state. Refusing to attempt operation!'
      );
    }

    await this.solveService.update(id, updateSolve, request.user);
  }
}

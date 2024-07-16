import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './dto/user.dto';
import { Request } from '../api.interface';
import { AuthGuard } from '../auth/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private userService: UserService) { }

  @Get('whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@Req() request: Request): Promise<User | undefined> {
    if (!request.user) {
      this.logger.fatal(
        "For some reason, the AuthGuard didn't kill the connection, even though request.user is falsy. Panic!"
      );
      throw new InternalServerErrorException(
        'Server is in an impossible state. Bailing on this operation.'
      );
    }

    return new User(request.user);
  }

  @Post()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (
      (await this.userService.findUser(
        'username',
        '==',
        createUserDto.username
      )) !== undefined
    ) {
      throw new BadRequestException('A user with this username already exists');
    }

    if (
      (await this.userService.findUser('email', '==', createUserDto.email)) !==
      undefined
    ) {
      throw new BadRequestException('A user with that email already exists');
    }

    const createdUser = await this.userService.createUser(createUserDto);
    if (createdUser !== undefined) {
      return new User(createdUser);
    } else {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}

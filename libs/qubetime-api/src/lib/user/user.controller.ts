import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './dto/user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

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
      return createdUser;
    } else {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}

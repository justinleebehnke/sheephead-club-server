import { Controller, Post, Body } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { RegistrationResponseDto } from './dto/registration-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  async register(
    @Body() userData: RegistrationDto,
  ): Promise<RegistrationResponseDto> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = new User();
    newUser.username = userData.username;
    newUser.passwordHash = hashedPassword;

    const user = await this.usersService.create(newUser);

    return {
      message: 'Registration successful',
      id: user.id,
      username: user.username,
    };
  }
}

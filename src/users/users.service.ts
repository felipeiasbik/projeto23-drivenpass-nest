import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(body: CreateUserDto) {
    const user = await this.usersRepository.findUserByEmail(body.email);

    if (user) throw new ConflictException('Already existing email!');

    const passCrypt = bcrypt.hashSync(body.password, 10);
    return await this.usersRepository.signUp({
      email: body.email,
      password: passCrypt,
    });
  }

  async signIn(body: CreateUserDto) {
    const user = await this.usersRepository.findUserByEmail(body.email);
    if (!user)
      throw new UnauthorizedException('Invalid Email or Password information!');

    const checkPass = bcrypt.compareSync(body.password, user.password);
    if (!checkPass)
      throw new UnauthorizedException('Invalid Email or Password information!');

    const payload = { userId: user.id };
    const token = Jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  }
}

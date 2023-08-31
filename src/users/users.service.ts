import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private EXPIRATION_TIME = '7 days';
  private ISSUER = 'DrivenPass';
  private AUDIENCE = 'users';

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: CreateUserDto) {
    const user = await this.usersRepository.findUserByEmail(body.email);

    if (user) throw new ConflictException('Already existing email!');

    const passCrypt = bcrypt.hashSync(body.password, 10);
    const signUp = await this.usersRepository.signUp({
      email: body.email,
      password: passCrypt,
    });

    delete signUp.password;
    return signUp;
  }

  async signIn(body: CreateUserDto) {
    const user = await this.usersRepository.findUserByEmail(body.email);
    if (!user)
      throw new UnauthorizedException('Invalid Email or Password information!');

    const checkPass = bcrypt.compare(body.password, user.password);
    if (!checkPass)
      throw new UnauthorizedException('Invalid Email or Password information!');

    return this.createToken(user);
  }

  private async createToken(user: User) {
    const { id } = user;

    const payload = { id };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.EXPIRATION_TIME,
      subject: String(id),
      issuer: this.ISSUER,
      audience: this.AUDIENCE,
    });

    return { token };
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token, {
      audience: this.AUDIENCE,
      issuer: this.ISSUER,
    });

    return data;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }
}

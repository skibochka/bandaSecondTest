import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Users from './entities/users.entity';
import UserDto from './dto/user.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  public async findByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOne({ email });
  }

  public async update(email: string, password:string): Promise<object> {
    return this.userRepository.update({ email }, { password });
  }

  public async register(data: UserDto): Promise<Users> {
    const { email } = data;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}

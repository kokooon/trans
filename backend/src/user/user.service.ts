// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { MyConfigService } from '../config/myconfig.service';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly myConfigService: MyConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByPseudo(pseudo: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { pseudo } } as FindOneOptions<User>);
  }

  async findByFortyTwoId(profile: any): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { pseudo: profile.username } });
  }

  async checkLogin(pseudo: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { pseudo, password } } as FindOneOptions<User>);
    return !!user;
  }

  async add_user_42(profile: any)
  {
    let user = new User();
    user.id = profile.id;
    user.pseudo = profile.username;
    user.email = profile.emails[0].value;
    user.password = "1234";
    return this.userRepository.save(user);
  }

  async add_user(pseudo: string, password: string): Promise<User> {
    const existingUser = await this.findByPseudo(pseudo);

    if (existingUser) {
      throw new BadRequestException('Username already exists.');
    }

    let user = new User();
    user.pseudo = pseudo;
    user.password = password;

    return this.userRepository.save(user);
  }
  
  // async exampleMethodUsingEnvVars(): Promise<void> {
  //   const apiKey = this.myConfigService.get_env().apiKey;
  //   const publicapiKey = this.myConfigService.get_env().publicapiKey;
  //   console.log(apiKey);
  // }
  
}

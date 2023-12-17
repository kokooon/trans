// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { MyConfigService } from '../config/myconfig.service';
import * as axios from 'axios';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly myConfigService: MyConfigService,
  ) {}

  async convertImageToBase64(imageUrl: string): Promise<string> {
    const response = await axios.default.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return base64Image;
  }

  async getAvatar(pseudo: string): Promise<string | undefined> {
    const user = await this.userRepository.findOne({ where: { pseudo } });

    // TROP VOLUMINEUX
    // if (user && user.avatar) {
    //   // Si l'utilisateur existe et a un avatar
    //   try {
    //     // Convertir l'URL de l'avatar en base64
    //     const base64Avatar = await this.convertImageToBase64(user.avatar); TROP VOLUMINEUX
    //     return base64Avatar;
    //   } catch (error) {
    //     console.error('Error converting avatar to base64:', error);
    //     return undefined;
    //   }
    // }
    if (user && user.avatar) {
      // Si l'utilisateur existe et a un avatar
      return user.avatar;
    }

    return undefined;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByPseudo(pseudo: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { pseudo } } as FindOneOptions<User>);
  }

  async findByFortyTwoId(profile: any): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { pseudo42: profile.username } });
  }

  async checkLogin(pseudo: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { pseudo, password } } as FindOneOptions<User>);
    return !!user;
  }

  async add_user_42(profile: any)
  {
    let user = new User();
    user.fortytwoId = profile.id;
    user.pseudo = "ChooseUsername";
    user.pseudo42 = profile.username;
    user.email = profile.emails[0].value;
    user.password = "1234";
    // if (profile._json.image && profile._json.image.link) {
    //   const base64Image = await this.convertImageToBase64(profile._json.image.link);
    //   user.avatar = base64Image;
    // } TROP VOLUMINEUX
    user.avatar = profile._json.image.link;
    return this.userRepository.save(user);
  }

  async add_user(pseudo: string, password: string, email: string, avatar: string): Promise<User> {
    const existingUser = await this.findByPseudo(pseudo);

    if (existingUser) {
      throw new BadRequestException('Username already exists.');
    }

    let user = new User();
    user.pseudo = pseudo;
    user.pseudo42 = pseudo;
    user.password = password;
    user.email = email;
    user.avatar = avatar; 
    return this.userRepository.save(user);
  }
  
  // async exampleMethodUsingEnvVars(): Promise<void> {
  //   const apiKey = this.myConfigService.get_env().apiKey;
  //   const publicapiKey = this.myConfigService.get_env().publicapiKey;
  //   console.log(apiKey);
  // }
  
}

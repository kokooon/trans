// user.service.ts
import { Injectable, Res } from '@nestjs/common';
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

  async updateAvatar(userId: number, newAvatar: string): Promise<void> {
  
    const user = await this.findById(userId);

    if (user) {
      user.avatar = newAvatar;
      await this.userRepository.save(user);
    } else {
      // Handle the case where the user with the given ID is not found
      throw new BadRequestException('User not found');
    }
  }
  
  async updatePseudo(userId: number, newPseudo: string): Promise<void> {
  
    const user = await this.findById(userId);

    if (user) {
      user.pseudo = newPseudo;
      await this.userRepository.save(user);
    } else {
      // Handle the case where the user with the given ID is not found
      throw new BadRequestException('User not found');
    }
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

  async findById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async checkById(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    // If the user is found, return true; otherwise, return false
    return !!user; // Convert to boolean
  }  

  async checkLogin(pseudo: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { pseudo, password } } as FindOneOptions<User>);
    return !!user;
  }

  async add_user_42(profile: any) {
    try {
        let user = new User();
        user.fortytwoId = profile.id;
        user.pseudo = profile.username;
        user.pseudo42 = profile.username;
        user.email = profile.emails[0].value;
        user.password = "1234";
        user.avatar = profile._json.image.link;

        // Enregistrez l'utilisateur dans la base de données
        const savedUser = await this.userRepository.save(user);

        return savedUser;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        throw new Error('Erreur lors de l\'ajout de l\'utilisateur');
    }
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
  
  async checkId(jwtCookie: string): Promise<Boolean> {
    if (!jwtCookie)
      return false;
    return true;
  }
  // async exampleMethodUsingEnvVars(): Promise<void> {
  //   const apiKey = this.myConfigService.get_env().apiKey;
  //   const publicapiKey = this.myConfigService.get_env().publicapiKey;
  //   console.log(apiKey);
  // }
  
}

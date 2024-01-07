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
  
  async SetNotifications(userId: number, FriendRequestid: number): Promise<void>{
    const userN = await this.findById(FriendRequestid);

    if (!userN) {
      throw new BadRequestException('User not found');
    }
    const friendNotificationsAsNumbers = userN.friendNotifications.map(Number);
    if (!friendNotificationsAsNumbers.includes(userId) && userId !== FriendRequestid)
    {
      userN.friendNotifications.push(userId);
      await this.userRepository.save(userN);
    }
    else {
      console.log(`L'ID ${userId} est déjà présent dans la liste de notifications.`);
    }
  }

  async AddInFriendRequest(userId: number, FriendRequestid: number): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const friendIdsAsNumbers = user.friendRequest.map(Number);
    if (!friendIdsAsNumbers.includes(FriendRequestid) && user.id !== FriendRequestid) {
      user.friendRequest.push(FriendRequestid);
      await this.userRepository.save(user);
    }
    else {
      console.log(`L'ID ${FriendRequestid} est déjà présent dans la liste d'amis.`);
    }
    this.SetNotifications(userId, FriendRequestid);
}

  async RefuseFriend(userId: number, Friendtwo: string): Promise<void>{
    const user = await this.findById(userId);
    const usertwo = await this.findByPseudo(Friendtwo);

    if (!user || !usertwo) {
      // Handle the case where the user with the given ID is not found
      throw new BadRequestException('User not found');
    }
    user.friendNotifications = user.friendNotifications.filter(id => Number(id) !== usertwo.id);
    usertwo.friendRequest = user.friendNotifications.filter(id => Number(id) !== user.id)

    await this.userRepository.save(user);
    await this.userRepository.save(usertwo);
  }

  async unblockUser(userId: number, Friendtwo: string): Promise<void>{
    const user = await this.findById(userId);
    const usertwo = await this.findByPseudo(Friendtwo);
    if (!user || !usertwo) {
      // Handle the case where the user with the given ID is not found
      throw new BadRequestException('User not found');
    }
    console.log("id user = ", user.id);
    console.log("id unblock = ", usertwo.id);
    user.banlist = user.banlist.filter(id => Number(id) !== usertwo.id);
    await this.userRepository.save(user);
  }

  async blockUser(userId: number, Friendtwo: string): Promise<void>{
    const user = await this.findById(userId);
    const usertwo = await this.findByPseudo(Friendtwo);
    if (!user || !usertwo) {
      // Handle the case where the user with the given ID is not found
      throw new BadRequestException('User not found');
    }
    user.banlist.push(usertwo.id);
    await this.userRepository.save(user);
  }

  async updateFriend(userId: number, Friendtwo: string): Promise<void>{
    const user = await this.findById(userId);
    const usertwo = await this.findByPseudo(Friendtwo);
    if (!user || !usertwo) {
      // Handle the case where the user with the given ID is not found
      throw new BadRequestException('User not found');
  }
  const friendsAsNumbers = user.friends.map(Number);
  const friendsAsNumberstwo = usertwo.friends.map(Number);
  if (!friendsAsNumbers.includes(usertwo.id) && !friendsAsNumberstwo.includes(user.id)){
    user.friends.push(usertwo.id);
    usertwo.friends.push(user.id);
  }
  else{
    console.log('Already Friend');
  }
  usertwo.friendRequest = usertwo.friendRequest.filter(id => Number(id) !== user.id);
  user.friendRequest = user.friendRequest.filter(id => Number(id) !== usertwo.id);

  usertwo.friendNotifications = usertwo.friendNotifications.filter(id => Number(id) !== user.id);
  user.friendNotifications = user.friendNotifications.filter(id => Number(id) !== usertwo.id);

  await this.userRepository.save(user);
  await this.userRepository.save(usertwo);
  }


  async updatePseudo(userId: number, newPseudo: string): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
        // Handle the case where the user with the given ID is not found
        throw new BadRequestException('User not found');
    }

    // Vérifie si le nouveau pseudo est déjà utilisé par un autre utilisateur
    const isPseudoTaken = await this.userRepository.findOne({ where: { pseudo: newPseudo } });

    if (isPseudoTaken && isPseudoTaken.id !== userId) {
        // Le pseudo est déjà pris par un autre utilisateur
        throw new BadRequestException('Pseudo is already taken');
    }

    // Si le pseudo n'est pas pris ou s'il est pris par l'utilisateur actuel, procédez à la mise à jour
    user.pseudo = newPseudo;
    await this.userRepository.save(user);
}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByPseudo(pseudo: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { pseudo } } as FindOneOptions<User>);
  }

  async findIdByPseudo(pseudo: string): Promise<number | undefined> {
    const user = await this.userRepository.findOne({ where: { pseudo } } as FindOneOptions<User>);
    return user.id;
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
        user.friends = [];
        user.friendRequest = [];
        user.friendNotifications = [];
        user.History = [];
        user.banlist = [];
        user.channels = [];
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

  async update2FA(userId: number, is2FAEnabled: boolean): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      user.is2FAEnabled = is2FAEnabled;

      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to update 2FA: ${error.message}`);
    }
  }

  
}

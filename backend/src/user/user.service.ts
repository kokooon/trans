// user.service.ts
// user.service.ts
import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Secret } from 'src/entities/secret.entity';
import { BadRequestException } from '@nestjs/common';
import { MyConfigService } from '../config/myconfig.service';
import * as axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Secret)  // Ajoutez ceci pour injecter SecretRepository
    private readonly secretRepository: Repository<Secret>,
    private readonly myConfigService: MyConfigService,
  ) {}

  async getFriends(userId: number): Promise<number[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
  
    return user.friends || [];
  }

    //social
    async unfriend(userId: number, unfriendId: number): Promise<void> {
      const user = await this.findById(userId);
      const usertwo = await this.findById(unfriendId);
      if (!user || !usertwo)
        throw new BadRequestException('User not found');
      user.friends = user.friends.filter(id => Number(id) != unfriendId);
      usertwo.friends = usertwo.friends.filter(id => Number(id) != userId);
      await this.userRepository.save(user);
      await this.userRepository.save(usertwo);
    }

    //social
    async RefuseFriend(userId: number, Friendtwo: string): Promise<void>{
      const user = await this.findById(userId);
      const usertwo = await this.findByPseudo(Friendtwo);
      if (!user || !usertwo) {
        throw new BadRequestException('User not found');
      }
      user.friendNotif = user.friendNotif.filter(id => Number(id) !== usertwo.id);
      usertwo.friendRequest = user.friendNotif.filter(id => Number(id) !== user.id)
      await this.userRepository.save(user);
      await this.userRepository.save(usertwo);
    }
  
    //social
    async unblockUser(userId: number, Friendtwo: string): Promise<void>{
      const user = await this.findById(userId);
      const usertwo = await this.findByPseudo(Friendtwo);
      if (!user || !usertwo) {
        throw new BadRequestException('User not found');
      }
      user.banlist = user.banlist.filter(id => Number(id) !== usertwo.id);
      await this.userRepository.save(user);
    }
  
    //social
    async blockUser(userId: number, Friendtwo: string): Promise<void>{
      const user = await this.findById(userId);
      const usertwo = await this.findByPseudo(Friendtwo);
      if (!user || !usertwo) {
        throw new BadRequestException('User not found');
      }
      const banlistAsNumbers = user.banlist.map(Number);
      if (!banlistAsNumbers.includes(usertwo.id)) {
        user.banlist.push(usertwo.id);
        await this.userRepository.save(user);
      }
    }

    //social
    async AddInFriendRequest(userId: number, FriendRequestid: number): Promise<void> {
      const user = await this.findById(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const friendIdsAsNumbers = user.friendRequest.map(Number);
      const friendsAsNumbers = user.friends.map(Number);
      if (!friendIdsAsNumbers.includes(FriendRequestid) && user.id !== FriendRequestid) {
        if (!friendsAsNumbers.includes(FriendRequestid)){
          user.friendRequest.push(FriendRequestid);
          await this.userRepository.save(user);
        }
      }
      this.SetNotifications(userId, FriendRequestid);
  }

    //social
    async SetNotifications(userId: number, FriendRequestid: number): Promise<void>{
      const userN = await this.findById(FriendRequestid);
      if (!userN) {
        throw new BadRequestException('User not found');
      }
      const blockedAsNumbers = userN.banlist.map(Number);
      if (!blockedAsNumbers.includes(userId)){
        const friendNotificationsAsNumbers = userN.friendNotif.map(Number);
        const friendsAsNumber = userN.friends.map(Number);
        if (!friendNotificationsAsNumbers.includes(userId) && userId !== FriendRequestid)
        {
          if (!friendsAsNumber.includes(userId)){
            userN.friendNotif.push(userId);
            await this.userRepository.save(userN);
          }
        }
      }
    }

  //social
  async addChannelId(channelId: number, user: User): Promise<void> {
    const channelsAsNumbers = user.channels.map(Number);
    if (!channelsAsNumbers.includes(channelId)){
      user.channels.push(channelId);
      await this.userRepository.save(user);
    }
  }

    //social
    async updateFriend(userId: number, Friendtwo: string): Promise<void>{
      const user = await this.findById(userId);
      const usertwo = await this.findByPseudo(Friendtwo);
      if (!user || !usertwo) {
        throw new BadRequestException('User not found');
    }
    const friendsAsNumbers = user.friends.map(Number);
    const friendsAsNumberstwo = usertwo.friends.map(Number);
    if (!friendsAsNumbers.includes(usertwo.id) && !friendsAsNumberstwo.includes(user.id)){
      user.friends.push(usertwo.id);
      usertwo.friends.push(user.id);
    }
    usertwo.friendRequest = usertwo.friendRequest.filter(id => Number(id) !== user.id);
    user.friendRequest = user.friendRequest.filter(id => Number(id) !== usertwo.id);
  
    usertwo.friendNotif = usertwo.friendNotif.filter(id => Number(id) !== user.id);
    user.friendNotif = user.friendNotif.filter(id => Number(id) !== usertwo.id);
  
    await this.userRepository.save(user);
    await this.userRepository.save(usertwo);
    }
    //end of /social function

    async save(user: User) {
        await this.userRepository.save(user);
    }

  async convertImageToBase64(imageUrl: string): Promise<string> {
    const response = await axios.default.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return base64Image;
  }

  async getAvatar(pseudo: string): Promise<string | undefined> {
    const user = await this.userRepository.findOne({ where: { pseudo } });
    if (user && user.avatar) {
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
      throw new BadRequestException('User not found');
    }
  }

  async updatePseudo(userId: number, newPseudo: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
        throw new BadRequestException('User not found');
    }
    const isPseudoTaken = await this.userRepository.findOne({ where: { pseudo: newPseudo } });
    if (isPseudoTaken && isPseudoTaken.id !== userId) {
        throw new BadRequestException('Pseudo is already taken');
    }
    user.pseudo = newPseudo;
    await this.userRepository.save(user);
}

async validate2FA(userId: number, is2FAValidate: boolean): Promise<void> {
  try {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    user.is2FAVerified = is2FAValidate;
    await this.userRepository.save(user);
  } catch (error) {
    throw new Error(`Failed to update 2FA: ${error.message}`);
  }
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

  async findPseudoById(userId: number): Promise<string | undefined> {
    const user = this.userRepository.findOne({ where: { id: userId } });
    return (await user).pseudo;
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async checkById(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return !!user; // Convert to boolean
  }  

  async checkConnectedById(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user.is2FAVerified === true)
      return true;
    else
      return false;
  }  

  async checkLogin(pseudo: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { pseudo, password } } as FindOneOptions<User>);
    return !!user;
  }

  async add_user_42(profile: any) {
    try {
        let user = new User();
        user.pseudo = profile.username;
        user.email = profile.emails[0].value;
        user.avatar = profile._json.image.link;
        user.friends = [];
        user.friendRequest = [];
        user.friendNotif = [];
        user.History = [];
        user.banlist = [];
        user.channels = [];
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
    user.email = email;
    user.avatar = avatar; 
    return this.userRepository.save(user);
  }
  
  async checkId(jwtCookie: string): Promise<Boolean> {
    if (!jwtCookie)
      return false;
    return true;
  }

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

  async findSecretById(userid: number): Promise<Secret> {
      return await this.secretRepository.findOne({ where: { userId: userid}});
  }

  async addSecret(userId: number, otpSecret: string): Promise<Secret> {
    try {
      const secret = new Secret();
      secret.userId = userId;
      secret.otpSecret = otpSecret;
      return await this.secretRepository.save(secret);
    } catch (error) {
      console.error('Error adding secret:', error);
      throw new Error('Failed to add secret');
    }
  }

  async updateConnectionCount(userId: number, newCount: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      user.connectionCount = newCount;
      await this.userRepository.save(user);
    } catch (error) {
      console.error(`Failed to update connectionCount: ${error.message}`);
      throw new Error(`Failed to update connectionCount: ${error.message}`);
    }
  }

}

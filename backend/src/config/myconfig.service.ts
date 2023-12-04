// ./myconfig.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}

  get_env() {
    const apiKey = this.configService.get<string>('42_API_KEY');
    const publicapiKey = this.configService.get<string>('42_PUBLIC_KEY');
    return { apiKey, publicapiKey };
  }
}
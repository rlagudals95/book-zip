import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get<string>('NAVER_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { id } = profile;
    const email = profile._json.email || `${id}@naver.example.com`;
    const name = profile._json.nickname || email.split('@')[0];
    const profileImage = profile._json.profile_image || null;

    const user = await this.authService.validateSocialUser({
      email,
      name,
      provider: 'naver',
      providerId: id,
      profileImage,
    });

    done(null, user);
  }
}

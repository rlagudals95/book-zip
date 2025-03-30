import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

interface KakaoProfile {
  id: string;
  username?: string;
  _json?: {
    kakao_account?: {
      email?: string;
    };
    properties?: {
      profile_image?: string;
    };
  };
}

type SocialUserData = {
  email: string;
  name: string;
  provider: string;
  providerId: string;
  profileImage?: string;
};

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy as any, 'kakao') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID') || '',
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL') || '',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: KakaoProfile,
    done: (error: any, user?: any) => void,
  ) {
    try {
      const { id, username } = profile;
      const email =
        profile._json?.kakao_account?.email || `${id}@kakao.example.com`;
      const name = username || email.split('@')[0];
      const profileImage =
        profile._json?.properties?.profile_image || undefined;

      const userData: SocialUserData = {
        email,
        name,
        provider: 'kakao',
        providerId: id.toString(),
        profileImage,
      };

      const user = await (this.authService as any).validateSocialUser(userData);

      done(null, user);
    } catch (error) {
      const err = error as Error;
      done(err);
    }
  }
}

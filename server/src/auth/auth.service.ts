import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

interface SocialUserData {
  email: string;
  name: string;
  provider: string;
  providerId: string;
  profileImage?: string;
}

interface UserData {
  _id: string;
  email: string;
  name: string;
  interests: string[];
  emailSubscription: boolean;
  emailDeliveryTime: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateSocialUser(userData: SocialUserData): Promise<User> {
    const { email, provider, providerId } = userData;

    // 먼저 해당 소셜 로그인 정보로 사용자를 찾음
    let user = await this.usersService.findByProviderAndProviderId(
      provider,
      providerId,
    );

    // 사용자가 없으면 이메일로 한번 더 검색 (같은 이메일, 다른 소셜 로그인의 경우)
    if (!user) {
      user = await this.usersService.findByEmail(email);
    }

    // 사용자가 없으면 새로 생성
    if (!user) {
      user = await this.usersService.create(userData);
    }

    return user;
  }

  login(user: UserData) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        interests: user.interests,
        emailSubscription: user.emailSubscription,
        emailDeliveryTime: user.emailDeliveryTime,
      },
    };
  }
}

import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/users.entity';
import {
  FortyTwoCoal,
  FortyTwoProfile,
  FortyTwoTokenResponse,
} from './types/fortytwo-profile.interface';
import { ConfigService } from '@nestjs/config';
import { getSecret } from 'libs/shared/src/utils/secret.utils';
import axios from 'axios';
import { CoalitionEnum } from './types/coalition.enum';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ user: UserResponseDto; token: string }> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = await this.usersService.createUser({
      email: createUserDto.email,
      passwordHash: hashedPassword,
      username: createUserDto.username,
    });

    this.logger.log(
      `[AUTH REGISTER] New local account created: ${user.username} (${user.id})`,
    );

    const token = this.generateJwt(user);
    const sanitizedUser = new UserResponseDto({
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      coalitionId: user.coalitionId,
      settings: user.settings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    return { user: sanitizedUser, token };
  }

  generateJwt(user: User): string {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.userRoles,
      avatarUrl: user.avatarUrl,
      skin: user.settings.skin,
    };

    return this.jwtService.sign(payload);
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findOneByEmail(email, true);
    if (!user) {
      this.logger.warn(
        `[AUTH VALIDATION FAILED] No account found with email: ${email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(
        `[AUTH VALIDATION FAILED] Incorrect password for User: ${user.username} (${user.id})`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(
      `[AUTH VALIDATION SUCCESS] Credentials verified for User: ${user.username} (${user.id})`,
    );
    const token = this.generateJwt(user);

    return { user, token };
  }

  async handleFortyTwoAuth(code: string) {
    this.logger.log(
      '[OAUTH 42] Exchanging authorization code for access token...',
    );
    const accessToken = await this.exchangeCodeForToken(code);
    this.logger.log('[OAUTH 42] Fetching 42 profile and coalition data...');
    const profile = await this.getFortyTwoProfile(accessToken);
    const coal = await this.getFortyTwoCoal(accessToken, profile.id);

    const user = await this.usersService.findUserByFortyTwoId(profile.id);

    if (user) {
      this.logger.log(
        `[OAUTH 42 LOGIN] Existing user found: ${user.username} (${user.id}) - 42 ID: ${profile.id}`,
      );
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.userRoles,
        avatarUrl: user.avatarUrl,
      };
      const token = await this.jwtService.signAsync(payload);
      return { token, user };
    }
    this.logger.log(
      `[OAUTH 42 REGISTER] Creating new account for 42 User: ${profile.login} (42 ID: ${profile.id})`,
    );
    const userProfile = {
      email: profile.email,
      username: profile.login,
      avatarUrl: profile.image?.link,
      coalitionId: coal?.id,
      fortyTwoId: profile.id,
    };

    const newUser = await this.usersService.createFortyTwoUser(userProfile);
    this.logger.log(
      `[OAUTH 42 REGISTER SUCCESS] New user created: ${newUser.username} (${newUser.id})`,
    );
    const payload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.userRoles,
      avatarUrl: newUser.avatarUrl,
    };
    const token = await this.jwtService.signAsync(payload);
    return { token, newUser };
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const redirect_uri = this.configService.get<string>(
      'FORTYTWO_REDIRECT_URI',
    );
    const tokenExchangeUrl = this.configService.get<string>(
      'FORTYTWO_API_TOKENEXCHANGE',
    );
    const client_id = this.configService.get<string>('FORTYTWO_CLIENT_ID');
    // const client_id = getSecret('fortytwo_client_id');
    const client_secret = getSecret('fortytwo_client_secret');

    try {
      const tokenResponse = await axios.post<FortyTwoTokenResponse>(
        tokenExchangeUrl ?? 'https://api.intra.42.fr/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id,
          client_secret,
          code,
          redirect_uri,
        },
      );
      return tokenResponse.data.access_token;
    } catch (err: unknown) {
      let errorMessage = 'Unknown error';

      if (
        axios.isAxiosError<{ error_description?: string; message?: string }>(
          err,
        )
      ) {
        errorMessage =
          err.response?.data?.error_description ||
          err.response?.data?.message ||
          err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      this.logger.error(
        `[OAUTH 42 API ERROR] Token exchange failed: ${errorMessage}`,
      );
      throw new UnauthorizedException('Failed to authenticate.');
    }
  }

  async getFortyTwoProfile(accessToken: string): Promise<FortyTwoProfile> {
    try {
      const response = await axios.get<FortyTwoProfile>(
        `${
          this.configService.get<string>('FORTYTWO_API') ??
          'https://api.intra.42.fr/v2'
        }/me`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    } catch (err: unknown) {
      let errorMessage = 'Unknown error';

      if (axios.isAxiosError<{ message?: string; error?: string }>(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      this.logger.error(
        `[OAUTH 42 API ERROR] Profile fetch failed: ${errorMessage}`,
      );
      throw new InternalServerErrorException("Couldn't fetch user's profile.");
    }
  }
  async getFortyTwoCoal(
    accessToken: string,
    userId: number,
  ): Promise<FortyTwoCoal | undefined> {
    try {
      const response = await axios.get<Array<FortyTwoCoal>>(
        `${
          this.configService.get<string>('FORTYTWO_API') ??
          'https://api.intra.42.fr/v2'
        }/users/${userId}/coalitions`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const coalitions = response.data;
      const current_coal = coalitions.find((coal) =>
        (Object.values(CoalitionEnum) as number[]).includes(coal.id),
      );
      return current_coal;
    } catch (err: unknown) {
      let errorMessage = 'Unknown error';

      if (axios.isAxiosError<{ message?: string; error?: string }>(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      this.logger.error(
        `[OAUTH 42 API ERROR] Coalition fetch failed for 42 User ${userId}: ${errorMessage}`,
      );
      throw new InternalServerErrorException(
        "Couldn't fetch user's coalitions.",
      );
    }
  }
}

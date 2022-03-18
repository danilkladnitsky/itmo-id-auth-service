import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { sendAcessToken, sendUserData } from 'src/api/external';
import { AuthService } from './auth.service';

@ApiTags('ITMO.ID endpoints')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  @ApiResponse({
    status: 200,
    description: 'Token for obtaining a user data',
  })
  @ApiResponse({ status: 400, description: 'No code was provided' })
  async getToken(@Query() query, @Query('code') code: string) {
    if (!code) {
      throw new BadRequestException({ message: 'No code was provided' });
    }

    const access_token = await this.authService.getToken(code);

    await sendAcessToken({ ...query, access_token });

    return { status: 'ok', message: 'token was received' };
  }

  @Get('user')
  @ApiResponse({
    status: 200,
    description: 'User entity by access token',
  })
  @ApiResponse({ status: 400, description: 'No access token was provided' })
  async getUserByToken(@Query() query) {
    if (!query.access_token) {
      throw new BadRequestException({
        message: 'No access token was provided',
      });
    }

    const user = await this.authService.getUserByToken(query.access_token);

    await sendUserData({ ...query, user });

    return { status: 'ok', message: 'user was received' };
  }

  @Get('auth')
  @ApiResponse({
    status: 200,
    description: 'User entity by code',
  })
  @ApiResponse({ status: 400, description: 'No code was provided' })
  async getUser(@Query() query, @Query('code') code: string) {
    if (!code) {
      throw new BadRequestException({ message: 'No code was provided' });
    }

    const access_token = await this.authService.getToken(code);

    const user = await this.authService.getUserByToken(access_token);

    await sendUserData({ ...query, user_itmo: user });

    return { status: 'ok', message: 'auth was completed' };
  }
}

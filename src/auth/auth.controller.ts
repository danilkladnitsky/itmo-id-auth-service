import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async getToken(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException({ message: 'No code was provided' });
    }

    return await this.authService.getToken(code);
  }

  @Get('user')
  @ApiResponse({
    status: 200,
    description: 'User entity by access token',
  })
  @ApiResponse({ status: 400, description: 'No access token was provided' })
  async getUserByToken(@Query('access_token') access_token: string) {
    if (!access_token) {
      throw new BadRequestException({
        message: 'No access token was provided',
      });
    }

    return await this.authService.getUserByToken(access_token);
  }

  @Get('auth')
  @ApiResponse({
    status: 200,
    description: 'User entity by code',
  })
  @ApiResponse({ status: 400, description: 'No code was provided' })
  async getUser(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException({ message: 'No code was provided' });
    }

    const access_token = await this.authService.getToken(code);

    const user = await this.authService.getUserByToken(access_token);
    return user;
  }
}

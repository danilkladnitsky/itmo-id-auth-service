import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { sendAcessToken, sendUserData } from 'src/api/external';
import { AuthService } from './auth.service';

const { REDIRECT_URL } = process.env;

const REDIRECT_FAIL_QUERY = '?status=fail';
const REDIRECT_OK_QUERY = '?status=ok';
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
  async getUser(@Query() query, @Query('code') code: string, @Res() res) {
    if (!code) {
      throw new BadRequestException({ message: 'No code was provided' });
    }

    const access_token = await this.authService.getToken(code);

    const user = await this.authService.getUserByToken(access_token);

    await sendUserData({ ...query, user_itmo: user });

    // handling redirect

    if (REDIRECT_URL) {
      res.redirect(REDIRECT_URL + REDIRECT_OK_QUERY);
    }

    return { status: 'ok', message: 'auth was completed' };
  }
}

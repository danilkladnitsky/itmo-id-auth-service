import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateToken, morphData } from 'src/utils';
import {
  getAccessTokenRequest,
  getUserDataRequest,
} from 'src/const/itmo.id.requests';
import { headers, headersWithAccessToken } from 'src/const/itmo.id.headers';

import axios from 'axios';
import { data } from 'src/const/itmo.id.data';
import { logRequests } from 'src/const/internal.variables';

@Injectable()
export class AuthService {
  async getToken(code: string): Promise<string> {
    try {
      const credentials = {
        ...data,
        code,
      };

      const res = await axios.post(
        getAccessTokenRequest,
        morphData(credentials),
        {
          headers,
        },
      );

      const { access_token } = res.data;

      return access_token as string;
    } catch (err) {
      console.log(logRequests ? err : 'logging was disabled');
      throw new InternalServerErrorException({
        message: "Can't receive acess token",
      });
    }
  }

  async getUserByToken(access_token: string) {
    const headers = headersWithAccessToken(access_token);

    try {
      const res = await axios.get(getUserDataRequest, {
        headers,
      });

      const user = { ...res.data };

      return await generateToken(user);
    } catch (err) {
      console.log(logRequests ? err : 'logging was disabled');
      throw new InternalServerErrorException({
        message: "Can't receive user",
      });
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateToken, morphData } from 'src/utils';
import {
  getAccessTokenRequest,
  getUserDataRequest,
} from 'src/const/itmo.id.requests';
import { headers, headersWithAccessToken } from 'src/const/itmo.id.headers';
import { sendAcessToken, sendUserData } from 'src/api/external';

import axios from 'axios';
import { data } from 'src/const/itmo.id.data';

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

      await sendAcessToken(access_token, code);

      return access_token as string;
    } catch (err) {
      console.log(err);
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

      const user = { ...res.data, access_token };

      await sendUserData(user);

      return await generateToken(user);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException({
        message: "Can't receive user",
      });
    }
  }
}

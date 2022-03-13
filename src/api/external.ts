import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { headers } from '../const/callback.api.header';
import { logRequests } from 'src/const/internal.variables';

const { CALLBACK_URL, USER_CALLBACK_URL, ACCESS_TOKEN_CALLBACK_URL } =
  process.env;
export const sendAcessToken = async (data) => {
  if (!CALLBACK_URL && !ACCESS_TOKEN_CALLBACK_URL) {
    return;
  }

  try {
    await axios.get(ACCESS_TOKEN_CALLBACK_URL ?? CALLBACK_URL, {
      params: { ...data },
      headers,
    });
  } catch (error) {
    console.log(logRequests ? error : 'logging was disabled');
    throw new BadRequestException({
      message: "Can't proceed callback api url (sending access_token)",
      context: data,
      body: error,
    });
  }
};

export const sendUserData = async (data) => {
  if (!CALLBACK_URL && !USER_CALLBACK_URL) {
    return;
  }

  try {
    await axios.get(USER_CALLBACK_URL ?? CALLBACK_URL, {
      params: { ...data },
      headers,
    });
  } catch (error) {
    console.log(logRequests ? error : 'logging was disabled');
    throw new BadRequestException({
      message: "Can't proceed callback api url (sending user_data)",
      context: data,
      body: error,
    });
  }
};

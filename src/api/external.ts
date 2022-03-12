import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { headers } from '../const/itmo.id.headers';

const { CALLBACK_URL } = process.env;
export const sendAcessToken = async (access_token: string, code: string) => {
  if (!CALLBACK_URL) {
    return;
  }

  try {
    await axios.get(CALLBACK_URL, {
      params: { access_token, code },
      headers,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestException({
      message: "Can't proceed callback api url",
      body: error,
    });
  }
};

export const sendUserData = async (data) => {
  if (!CALLBACK_URL) {
    return;
  }

  try {
    await axios.get(CALLBACK_URL, {
      params: { ...data },
      headers,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestException({
      message: "Can't proceed callback api url",
      body: error,
    });
  }
};

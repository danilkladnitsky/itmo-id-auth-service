import { InternalServerErrorException } from '@nestjs/common';

const jwt = require('jsonwebtoken');

export const generateToken = async (data) => {
  try {
    return await jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: '5m',
      algorithm: 'HS384',
    });
  } catch (error) {
    console.log(error);

    throw new InternalServerErrorException({
      message: "Can't generate jwt token",
    });
  }
};

export const morphData = (data) =>
  Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

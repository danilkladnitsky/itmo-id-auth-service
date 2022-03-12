export const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: '*/*',
  Host: 'login.itmo.ru',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
};

export const headersWithAccessToken = (access_token) => ({
  Accept: '*/*',
  Host: 'login.itmo.ru',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  Authorization: `Bearer ${access_token}`,
});

const { CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, REDIRECT_URI } = process.env;

export const data = {
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  grant_type: GRANT_TYPE,
  redirect_uri: REDIRECT_URI,
};

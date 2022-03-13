const { SHOW_LOGS } = process.env;

export const logRequests = SHOW_LOGS === 'TRUE';

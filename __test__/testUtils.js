const axios = require('axios');

const localUrl = (route, queryObj) => {
  const baseURL = 'http://localhost:5000';
  const queries = !queryObj ? '' : Object.keys(queryObj).map((key) => `?${key}=${queryObj[key]}`).join('');
  const url = `${baseURL}/${route}${queries}`;
  return url;
};

const createSession = async (user) => {
  const session = await axios.create({
    baseURL: localUrl(''),
  });
  const authParams = user;
  const res = await axios.post(localUrl('signin'), authParams);
  const cookie = res.headers['set-cookie'][1];
  session.defaults.headers.Cookie = cookie;
  return session;
};

module.exports = {
  localUrl,
  createSession,
};

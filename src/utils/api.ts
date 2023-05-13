import axios from 'axios';
import { log } from './log';

const cookie = process.argv.slice(2)[0];

// check cookie
if (!cookie) {
  log('error', 'set cookie!');

  process.exit();
}

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json, text/plain, */*',
    cookie,
  },
});

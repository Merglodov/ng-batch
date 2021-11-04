import { JwtAuthToken } from './jwt-auth.type';

export class JwtAuthStorage {
  static set(token: JwtAuthToken) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  static get(): JwtAuthToken {
    return JSON.parse(<any>localStorage.getItem('token'));
  }

  static remove() {
    localStorage.removeItem('token');
  }
}

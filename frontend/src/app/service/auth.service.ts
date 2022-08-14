import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null;

  EXPIRE_AT = 'expire_at';
  ACCESS_TOKEN = 'access_token';

  constructor() {
    this.accessToken = this.getAccessToken();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  saveAccessToken(accessToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
    const now = new Date();
    const expire = now.setMinutes(now.getMinutes() + 30);
    localStorage.setItem(this.EXPIRE_AT, expire.toString());
  }

  login(accessToken: string) {
    this.accessToken = accessToken;
    this.saveAccessToken(accessToken);
  }

  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.EXPIRE_AT);
    this.accessToken = null;
  }

  isAuthenticated(): boolean {
    if (!this.getAccessToken()) {
      return false;
    }

    const expire = localStorage.getItem(this.EXPIRE_AT);
    if (!expire) {
      return false;
    }

    const now = new Date().getTime();
    return now < parseInt(expire);
  }
}

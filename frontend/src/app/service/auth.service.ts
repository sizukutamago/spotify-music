import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null;

  constructor() {
    this.accessToken = this.getAccessToken();
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  saveAccessToken(accessToken: string): void {
    localStorage.setItem('access_token', accessToken);
    const now = new Date();
    const expire = now.setMinutes(now.getMinutes() + 30);
    localStorage.setItem('expire_at', expire.toString());
  }

  login(accessToken: string) {
    this.accessToken = accessToken;
    this.saveAccessToken(accessToken);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.accessToken = null;
  }

  isAuthenticated(): boolean {
    if (!this.getAccessToken()) {
      return false;
    }

    const expire = localStorage.getItem('expire_at');
    if (!expire) {
      return false;
    }

    const now = new Date().getTime();
    return now < parseInt(expire);
  }
}

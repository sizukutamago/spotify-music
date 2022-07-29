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
  }

  login(accessToken: string) {
    this.accessToken = accessToken;
    this.saveAccessToken(accessToken);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.accessToken = null;
  }

  isAuthenticated() {
    return !!this.getAccessToken();
  }
}

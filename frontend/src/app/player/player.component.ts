import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private http: HttpClient,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.router.url.subscribe((url) => {
      if (url.length === 2) {
        const code = this.router.snapshot.queryParamMap.get('code') || '';
        this.getAccessToken(code);
      }
    });
  }

  getAccessToken(code: string) {
    this.http
      .post<{ access_token: string }>('http://localhost:3000/spotify', { code })
      .subscribe((response) => {
        this.auth.login(response.access_token);
      });
  }
}

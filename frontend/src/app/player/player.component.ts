import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  constructor(private router: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.router.url.subscribe((url) => {
      if (url.length === 2) {
        const code = this.router.snapshot.queryParamMap.get('code') || '';
        this.auth(code);
      }
    });
  }

  auth(code: string) {
    this.http
      .post('http://localhost:3000/spotify', { code })
      .subscribe((response) => {
        console.log(response);
      });
  }
}

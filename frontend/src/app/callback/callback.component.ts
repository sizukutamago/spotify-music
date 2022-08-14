import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      const queries = this.route.snapshot.fragment?.split('&');

      const accessTokenQuery = queries?.find((query) => {
        return query.indexOf('access_token') !== -1;
      });

      if (!accessTokenQuery) {
        return;
      }

      const accessTokenParam = accessTokenQuery.split('=');
      const accessToken = accessTokenParam[1];
      this.auth.login(accessToken);
      this.router.navigate(['player']);
    });
  }
}

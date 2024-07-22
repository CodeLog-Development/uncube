import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MOBILE, WEB } from '.';
import { Subject, takeUntil } from 'rxjs';
import { SidenavService } from './sidenav.service';
import { AuthService } from './auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login.dialog';
import { RegisterDialogComponent } from './auth/register.dialog';
import { Platform } from '@angular/cdk/platform';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'uncube-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  destroyed = new Subject<void>();
  isMobile = false;
  isSidenavOpen = false;
  loggedIn = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sidenavService: SidenavService,
    private authService: AuthService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private platform: Platform
  ) {
    this.breakpointObserver
      .observe([MOBILE, WEB])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const key of Object.keys(result.breakpoints)) {
          if (key === MOBILE) {
            this.isMobile = result.breakpoints[key];
          }
        }
      });
    this.authService.loggedIn
      .pipe(takeUntil(this.destroyed))
      .subscribe((loggedIn) => {
        this.loggedIn = loggedIn;
      });
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sidenavService.setSidenavOpen(this.isSidenavOpen);
  }

  ngOnInit(): void {
    this.sidenavService.setSidenavOpen(this.isSidenavOpen);
    this.sidenavService.observable.subscribe((isOpen) => {
      this.isSidenavOpen = isOpen;
    });

    if (!this.platform.isBrowser) {
      return;
    }

    this.authService.whoami().subscribe((data) => {
      if (data !== undefined) {
        console.log('We are logged in', data);
      } else {
        console.log('Not logged in');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  loginClick() {
    this.dialog.open(LoginDialogComponent);
  }

  registerClick() {
    this.dialog.open(RegisterDialogComponent);
  }

  statisticsClick() {
    this.router.navigate(['statistics'], {
      relativeTo: this.activatedRoute.parent,
    });
  }
}

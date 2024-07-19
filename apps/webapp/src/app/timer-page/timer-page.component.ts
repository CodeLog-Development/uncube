import { Component, OnDestroy, OnInit } from '@angular/core';
import { Solve, SolvePenalty } from '../solve-card';
import { ScrambleService } from '../timer/scramble.service';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MOBILE, WEB } from '../index';
import { SidenavService } from '../sidenav.service';
import { MatDrawerMode } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { SolveEntryDialogComponent } from './solve-entry.dialog';
import { SolveService } from '../solve-card/solve.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'uncube-timer-page',
  templateUrl: './timer-page.component.html',
  styleUrls: ['./timer-page.component.scss'],
})
export class TimerPageComponent implements OnInit, OnDestroy {
  solves: Solve[] = [];
  scramble = '';
  isMobile = false;
  lastSidenavState = false;
  destroyed = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private scrambleService: ScrambleService,
    private sidenavService: SidenavService,
    private dialog: MatDialog,
    private solveService: SolveService,
    private snackBar: MatSnackBar,
    private platform: Platform
  ) {
    this.breakpointObserver
      .observe([MOBILE, WEB])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        console.log(result);
        for (const key of Object.keys(result.breakpoints)) {
          if (key === MOBILE) {
            this.isMobile = result.breakpoints[key];
          }
        }
      });
  }

  sidenavClosing() {
    this.sidenavService.setSidenavOpen(false);
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit() {
    this.scrambleService
      .generateScramble()
      .then((scramble) => (this.scramble = scramble));
    this.sidenavService.observable
      .pipe(takeUntil(this.destroyed))
      .subscribe((isOpen) => {
        this.lastSidenavState = isOpen;
      });

    this.refresh();
  }

  refresh() {
    if (!this.platform.isBrowser) {
      return;
    }

    this.solveService.getSolves().subscribe((response) => {
      if (response.status === 200 && response.body) {
        this.solves = response.body.solves.map((solve) => ({
          ...solve,
          syncIcon: 'check_circle',
        }));
        this.solves.sort((a, b) => {
          return b.timestamp - a.timestamp;
        });
      } else {
        this.snackBar.open('Failed to retrieve solves', 'CLOSE', {
          duration: 5000,
        });
      }
    });
  }

  timerStopped(elapsed: number) {
    const newSolve: Solve = {
      millis: elapsed,
      timestamp: Date.now(),
      scramble: this.scramble,
    };

    this.solves.unshift(newSolve);

    this.solveService.create(newSolve).subscribe((response) => {
      if (response.status !== 201 || !response.body) {
        this.snackBar.open('Failed to upload solve', 'CLOSE', {
          duration: 5000,
        });
      } else {
        this.solves[0].id = response.body.id;
        this.solves[0].syncIcon = 'check_circle';
      }
    });

    this.scrambleService
      .generateScramble()
      .then((scramble) => (this.scramble = scramble));
  }

  get drawerMode(): MatDrawerMode {
    return this.isMobile ? 'over' : 'side';
  }

  get isDrawerOpen() {
    return this.isMobile ? this.lastSidenavState : true;
  }

  discardSolve(solve: Solve, id?: string) {
    const idx = this.solves.findIndex(
      (x) => x.timestamp === solve.timestamp || x.id === id
    );
    this.solves.splice(idx, 1);

    if (id) {
      this.solveService.deleteSolve(id).subscribe((response) => {
        if (response.status !== 200) {
          this.snackBar.open('Failed to delete solve', 'CLOSE', {
            duration: 5000,
          });
        }
      });
    }
  }

  penaltyChange(solve: Solve, event: SolvePenalty | undefined) {
    const idx = this.solves.findIndex((x) => x.timestamp === solve.timestamp);
    if (this.solves[idx] !== undefined) {
      this.solves[idx] = {
        ...solve,
        penalty: event,
      };
    }
  }

  fabClick() {
    const dialogRef = this.dialog.open(SolveEntryDialogComponent);
    dialogRef.afterClosed().subscribe((result: Solve | undefined) => {
      if (result) {
        this.solves.unshift(result);
      }
    });
  }

  solveUpdate(update: Solve) {
    if (update.id) {
      const idx = this.solves.findIndex((solve) => solve.id === update.id);
      this.solves[idx].syncIcon = 'pending';
      this.solveService.update(update.id, update).subscribe((response) => {
        if (response.status !== 200) {
          this.snackBar.open('Failed to update solve', 'CLOSE', {
            duration: 5000,
          });
          this.solves[idx].syncIcon = 'error';
        } else {
          this.solves[idx].syncIcon = 'check_circle';
        }
      });
    }
  }
}

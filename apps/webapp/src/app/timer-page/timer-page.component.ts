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
    private solveService: SolveService
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
  }

  timerStopped(elapsed: number) {
    this.solves.unshift({
      millis: elapsed,
      timestamp: Date.now(),
      scramble: this.scramble,
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
    const idx = this.solves.findIndex((x) => x.timestamp === solve.timestamp);
    this.solves.splice(idx, 1);
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
    this.solveService.update(update);
  }
}

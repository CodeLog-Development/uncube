import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { TimerState } from './timer.interface';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject, Subscription, interval, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MOBILE, WEB } from '..';

@Component({
  selector: 'uncube-timer',
  template: `
    <div class="timer-container">
      <span [class]="state" [class.unselectable]="true">
        {{ elapsed | solveTime }}
      </span>
    </div>
  `,
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnChanges, OnInit, OnDestroy {
  private startTime = 0;
  private endTime = 0;

  @Input()
  state: TimerState = 'cleared';
  @Output()
  stateChange = new EventEmitter<TimerState>(true);
  @Output()
  timerStopped = new EventEmitter<number>(true);
  isMobile = false;
  @Input()
  disabled = false;
  @Input({ required: true })
  touchTarget = '';

  destroyed = new Subject<void>();

  private isBrowser: boolean;
  private interactionSub?: Subscription;
  private timerSub?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) platformId: NonNullable<unknown>,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.breakpointObserver
      .observe([MOBILE, WEB])
      .pipe(takeUntil(this.destroyed))
      .subscribe((data) => {
        for (const key of Object.keys(data.breakpoints)) {
          if (key === MOBILE) {
            this.isMobile = data.breakpoints[key];
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  pad(num: number, len: number, padding = '0'): string {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += padding;
    }
    return (result + num.toString()).slice(-len);
  }

  keyDown() {
    if (this.state !== 'running') {
      this.interactionSub = new Observable((subscriber) => {
        setTimeout(() => {
          subscriber.next();
          subscriber.complete();
        }, 500);
      }).subscribe(() => {
        this.startTime = 0;
        this.endTime = 0;
        this.setState('armed');
      });
    } else {
      this.timerSub?.unsubscribe();
      this.timerStopped.emit(this.endTime - this.startTime);
      this.setState('stopped');
    }
  }

  keyUp() {
    this.interactionSub?.unsubscribe();

    if (this.state === 'armed') {
      this.startTime = Date.now();
      this.timerSub = interval(27).subscribe(() => {
        this.endTime = Date.now();
      });

      this.setState('running');
    }
  }

  ngOnInit() {
    console.log(this.touchTarget);
    if (this.isBrowser) {
      if (!this.isMobile) {
        window.addEventListener('keydown', (event) => {
          if (event.code === 'Space' && !event.repeat && !this.disabled) {
            this.keyDown();
          }
        });
        window.addEventListener('keyup', (event) => {
          if (event.code === 'Space' && !this.disabled) {
            this.keyUp();
          }
        });
      } else {
        const elem = document.getElementById(this.touchTarget);
        elem?.addEventListener('touchstart', () => {
          console.log('down');
          if (!this.disabled) {
            this.keyDown();
          }
        });

        elem?.addEventListener('touchend', () => {
          console.log('up');
          if (!this.disabled) {
            this.keyUp();
          }
        });
      }
    }
  }

  get elapsed(): number {
    return this.endTime - this.startTime;
  }

  onStateChange() {
    this.stateChange.emit(this.state);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stateChange.emit(changes['state']?.currentValue);
  }

  setState(state: TimerState) {
    this.state = state;
    this.stateChange.emit(this.state);
  }

  fabClick() {
    if (this.state !== 'running') {
      this.startTime = Date.now();
      this.timerSub = interval(27).subscribe(() => {
        this.endTime = Date.now();
      });

      this.setState('running');
    } else {
      this.timerSub?.unsubscribe();
      this.timerStopped.emit(this.endTime - this.startTime);
      this.setState('stopped');
    }
  }
}

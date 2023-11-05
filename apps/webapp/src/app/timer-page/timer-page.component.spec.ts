import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerPageComponent } from './timer-page.component';
import { TimerModule } from '../timer/timer.module';
import { SolveCardModule } from '../solve-card/solve-card.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TimerPageComponent', () => {
  let component: TimerPageComponent;
  let fixture: ComponentFixture<TimerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerPageComponent],
      imports: [
        BrowserAnimationsModule,
        TimerModule,
        SolveCardModule,
        MatIconModule,
        MatSidenavModule,
        MatButtonModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

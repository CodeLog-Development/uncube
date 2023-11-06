import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerPageComponent } from './timer-page.component';
import { TimerModule } from '../timer/timer.module';
import { SolveCardModule } from '../solve-card/solve-card.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimerPageRoutingModule } from './timer-page-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidenavService } from '../sidenav.service';

describe('TimerPageComponent', () => {
  let component: TimerPageComponent;
  let fixture: ComponentFixture<TimerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerPageComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        CommonModule,
        TimerModule,
        TimerPageRoutingModule,
        MatSidenavModule,
        SolveCardModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
      ],
      providers: [SidenavService],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

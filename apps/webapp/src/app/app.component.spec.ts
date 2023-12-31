import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TimerModule } from './timer/timer.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthModule } from './auth/auth.module';
import { SidenavService } from './sidenav.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        AuthModule,
        TimerModule,
      ],
      declarations: [AppComponent],
      providers: [SidenavService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const component = TestBed.createComponent(AppComponent).componentInstance;
    expect(component).toBeTruthy();
  });
});

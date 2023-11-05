import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolveCardComponent } from './solve-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PipesModule } from '../pipes/pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

describe('SolveCardComponent', () => {
  let component: SolveCardComponent;
  let fixture: ComponentFixture<SolveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolveCardComponent],
      imports: [
        MatCardModule,
        MatButtonModule,
        PipesModule,
        MatDialogModule,
        MatChipsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

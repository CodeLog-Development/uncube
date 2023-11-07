import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolveCardComponent } from './solve-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PipesModule } from '../pipes/pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


describe('SolveCardComponent', () => {
  let component: SolveCardComponent;
  let fixture: ComponentFixture<SolveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolveCardComponent],
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        PipesModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,
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

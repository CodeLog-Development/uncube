import { Component, HostListener, OnInit } from '@angular/core';
import { SolveService } from '../solve-card/solve.service';
import { Solve } from '../solve-card';
import { Platform } from '@angular/cdk/platform';

interface ChartSeries {
  name: string;
  series: {
    name?: string;
    value: number;
  }[];
}

const MIN_WIDTH = 700;

@Component({
  selector: 'uncube-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.scss',
})
export class StatsPageComponent implements OnInit {
  solves: Solve[] = [];
  view: [number, number] = [0, 300];

  constructor(private solveService: SolveService, private platform: Platform) { }

  ngOnInit(): void {
    this.view[0] = Math.max(window.innerWidth, MIN_WIDTH) - 80;
    this.refresh();
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    this.view[0] = Math.max(width, MIN_WIDTH) - 80;
  }

  solveData(): ChartSeries[] {
    const multi = [
      {
        name: 'Solves',
        series: this.solves.map((solve, index) => ({
          name: index.toString(),
          value: solve.millis / 1000,
        })),
      },
    ];
    return multi;
  }

  refresh() {
    if (!this.platform.isBrowser) {
      return;
    }

    this.solveService.getSolves().subscribe((response) => {
      if (response.ok && response.body) {
        this.solves = response.body.solves;
        this.solves.sort((a, b) => {
          return b.millis - a.millis;
        });
      }
    });
  }
}

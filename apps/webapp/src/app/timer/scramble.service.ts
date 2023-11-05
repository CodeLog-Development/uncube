import { Injectable } from '@angular/core';
import * as Cube from 'cubejs';

@Injectable()
export class ScrambleService {
  async generateScramble(): Promise<string> {
    Cube.initSolver();
    return Cube.scramble();
  }
}

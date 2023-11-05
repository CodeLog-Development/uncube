import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SidenavService {
  private sidenavOpen = new Subject<boolean>();

  get observable() {
    return this.sidenavOpen.asObservable();
  }

  setSidenavOpen(state: boolean) {
    this.sidenavOpen.next(state);
  }
}

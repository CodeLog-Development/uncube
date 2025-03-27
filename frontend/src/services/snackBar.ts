import type { SnackBarOpen, SnackBarOpenOptions } from '@/interfaces/snackBar';
import { Subject } from 'rxjs';

export function useSnackBar() {
  const openSubject = new Subject<SnackBarOpen>();

  function open(message: string, opts?: SnackBarOpenOptions) {
    openSubject.next({
      message,
      duration: opts?.duration,
    });
  }

  return { openSubject, open };
}

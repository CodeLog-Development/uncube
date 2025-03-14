import { Observable } from 'rxjs';

export const useHttp = () => {
  const get = function <T>(uri: string): Observable<T> {
    return new Observable((subscriber) => {
      fetch(uri, { method: 'GET' })
        .then((x) => {
          if (x.ok) {
            return x.json();
          } else {
            subscriber.error(x);
          }
        })
        .then((x) => {
          subscriber.next(x as T);
          subscriber.complete();
        });
    });
  };

  const post = function <T>(uri: string, body: unknown): Observable<T> {
    return new Observable((subscriber) => {
      fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((x) => {
          if (x.ok) {
            return x.json();
          } else {
            subscriber.error(x);
          }
        })
        .then((x) => {
          subscriber.next(x as T);
          subscriber.complete();
        });
    });
  };

  return { get, post };
};

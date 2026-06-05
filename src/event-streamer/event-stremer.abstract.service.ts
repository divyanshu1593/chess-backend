import { Observable } from 'rxjs';

export abstract class BaseEventStreamer {
  abstract getStream(
    id: string,
  ): Observable<string> | Promise<Observable<string>>;
  abstract sendEvent(id: string, message: string): void | Promise<void>;
}

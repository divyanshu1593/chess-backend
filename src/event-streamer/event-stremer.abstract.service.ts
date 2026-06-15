import { Observable } from 'rxjs';

export abstract class BaseEventStreamer<T> {
  abstract getStream(id: string): Promise<Observable<T>>;
  abstract sendEvent(id: string, message: T): Promise<void>;
}

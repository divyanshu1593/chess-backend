import { Subject, Subscription, throwError } from 'rxjs';
import { SubscriberLimitReachedError } from 'src/common/errors/subscriber-limit-reached.error';

export const withSubscriberLimit = <
  S extends new (...args: any[]) => Subject<any>,
>(
  ClassRef: S,
  limit: number,
): S => {
  return class extends ClassRef {
    private subscriberCount = 0;

    override subscribe(...args: any[]): Subscription {
      if (this.subscriberCount >= limit) {
        return throwError(() => new SubscriberLimitReachedError()).subscribe(
          ...args,
        );
      }

      this.subscriberCount += 1;
      const subscription = super.subscribe(...args);
      subscription.add(() => {
        this.subscriberCount -= 1;
      });

      return subscription;
    }
  };
};

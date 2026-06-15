import { Subject, Subscription } from 'rxjs';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

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
        throw new Error(ErrorMessages.SUBSCRIBER_LIMIT_REACHED);
      }

      this.subscriberCount += 1;
      return super.subscribe(...args);
    }

    override unsubscribe(): void {
      this.subscriberCount -= 1;
      super.unsubscribe();
    }
  };
};

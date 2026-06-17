import { ErrorMessages } from 'src/common/enums/error-messages.enum';

export class SubscriberLimitReachedError extends Error {
  constructor() {
    super(ErrorMessages.SUBSCRIBER_LIMIT_REACHED);
  }
}

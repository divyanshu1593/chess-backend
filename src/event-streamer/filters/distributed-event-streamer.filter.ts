import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { DistributedEventStreamerError } from 'src/event-streamer/errors/distributed-event-streamer.error';
import { MaxSubscriberReachedError } from 'src/event-streamer/errors/subscriber-limit-reached.error';

@Catch(DistributedEventStreamerError)
export class DistributedEventStreamerFilter implements ExceptionFilter {
  catch(exception: DistributedEventStreamerError) {
    if (exception instanceof MaxSubscriberReachedError) {
      throw new BadRequestException(exception.message);
    }

    throw exception;
  }
}

import { DistributedEventStreamerError } from 'src/event-streamer/errors/distributed-event-streamer.error';

export class MaxSubscriberReachedError extends DistributedEventStreamerError {}

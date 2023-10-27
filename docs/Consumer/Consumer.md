# Consumer

# Attributes

- **sync-send** - Producer waits for ack
- **async-send** - Producer does not wait for ack, messages can be lost

- **ack-cummulative** - Consumer can acknowledge receiving all messages upto and including the message being
  acknowledged `ack(msg, true)`
- **ack-one** - Consumer acknowledges individual messages. `ack(msg)`
- **nack** - Consumer can negatively acknowledge a message. Useful in the case of errors. May cause a retry? `nack(msg)`
- **regex** - Subscriptions can be based on a single topic, or a regular expression like `/public/finance-.\*`

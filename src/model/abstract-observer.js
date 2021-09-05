export default class AbstractSubscriber {
  constructor() {
    if (new.target === AbstractSubscriber) {
      throw new Error('Can\'t instantiate abstract class');
    }

    this._subscribers = new Set();
  }

  subscribe(subscriber) {
    this._subscribers.add(subscriber);
  }

  unsubscribe(subscriber) {
    this._subscribers.delete(subscriber);
  }

  _notify(event, payload) {
    this._subscribers.forEach((subscriber) => subscriber(event, payload));
  }
}

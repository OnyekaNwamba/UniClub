export class UserSwipe {
  constructor(from, to, swipeAction, dateTime) {
    this.fromId = from;
    this.toId = to;
    this.swipeAction = swipeAction;
    this.dateTime = dateTime;
  }

  static fromApi(item) {
    return new UserSwipe(item.fromId, item.toId, item.swipeAction, item.dateTime)
  }
}

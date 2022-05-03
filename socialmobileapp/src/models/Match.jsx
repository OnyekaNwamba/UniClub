export class Match {
  constructor(matchId, user1, user2) {
    this.matchId = matchId;
    this.user1 = user1;
    this.user2 = user2;
  }

  static fromApi(item) {
    return new Match(item.matchId, item.user1, item.user2);
  }
}

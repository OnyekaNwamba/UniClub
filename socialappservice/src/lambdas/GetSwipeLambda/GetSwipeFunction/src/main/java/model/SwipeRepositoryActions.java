package model;

public enum SwipeRepositoryActions {

  TO_LEFT_SWIPES("TO_LEFT_SWIPES"),
  TO_RIGHT_SWIPES("TO_RIGHT_SWIPES"),
  FROM_LEFT_SWIPES("FROM_LEFT_SWIPES"),
  FROM_RIGHT_SWIPES("FROM_RIGHT_SWIPES"),
  LEFT_SWIPE("left"),
  RIGHT_SWIPE("right");

  String action;

  SwipeRepositoryActions(String action) {
    this.action = action;
  }

  @Override
  public String toString() {
    return this.action;
  }
}

package model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import lombok.*;

@Builder
@Getter
@Setter
@DynamoDBTable(tableName = "SocialApp-User-Swipes")
@NoArgsConstructor
@AllArgsConstructor
public class UserSwipe {

  @NonNull
  @DynamoDBHashKey(attributeName = "from")
  String fromId;

  @NonNull
  @DynamoDBRangeKey(attributeName = "to")
  String toId;

  @NonNull
  @DynamoDBAttribute(attributeName = "swipe_action")
  String swipeAction;

  @NonNull
  @DynamoDBAttribute(attributeName = "date_time")
  String dateTime;
}

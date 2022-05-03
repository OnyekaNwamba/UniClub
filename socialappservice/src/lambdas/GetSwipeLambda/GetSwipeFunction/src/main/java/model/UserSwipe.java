package model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@DynamoDBTable(tableName = "SocialApp-User-Swipes")
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

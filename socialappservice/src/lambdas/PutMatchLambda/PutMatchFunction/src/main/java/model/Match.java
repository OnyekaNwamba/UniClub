package model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
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
@DynamoDBTable(tableName = "SocialApp-Matches")
public class Match {

  @NonNull
  @DynamoDBHashKey(attributeName = "match_id")
  String matchId;

  @NonNull
  @DynamoDBAttribute(attributeName = "user_1")
  String user1;

  @NonNull
  @DynamoDBAttribute(attributeName = "user_2")
  String user2;
}

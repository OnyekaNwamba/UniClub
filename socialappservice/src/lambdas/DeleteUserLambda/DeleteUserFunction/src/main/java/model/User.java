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
@DynamoDBTable(tableName = "SocialApp-Users")
@NoArgsConstructor
@AllArgsConstructor
public class User {

  @NonNull
  @DynamoDBHashKey(attributeName = "user_id")
  String id;

  @DynamoDBAttribute(attributeName = "first_name")
  String firstName;

  @DynamoDBAttribute(attributeName = "last_name")
  String lastName;

  @DynamoDBAttribute(attributeName = "email")
  String email;

  @DynamoDBAttribute(attributeName = "password")
  String password;

}

package model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@DynamoDBTable(tableName = "SocialApp-Users")
public class User {

  @NonNull
  @DynamoDBHashKey(attributeName = "user_id")
  String id;

  @NonNull
  @DynamoDBAttribute(attributeName = "first_name")
  String firstName;

  @NonNull
  @DynamoDBAttribute(attributeName = "last_name")
  String lastName;

  @NonNull
  @DynamoDBAttribute(attributeName = "email")
  String email;

  @NonNull
  @DynamoDBAttribute(attributeName = "password")
  String password;
}

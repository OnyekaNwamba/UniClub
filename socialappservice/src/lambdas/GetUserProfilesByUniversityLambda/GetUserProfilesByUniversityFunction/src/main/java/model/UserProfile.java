package model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverted;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import model.User;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
@DynamoDBTable(tableName = "SocialApp-Profiles")
public class UserProfile {

  @DynamoDBHashKey(attributeName = "user_id")
  String userId;

  @DynamoDBAttribute(attributeName = "dob")
  String dob;

  @DynamoDBAttribute(attributeName = "aboutMe")
  String aboutMe;

  @DynamoDBAttribute(attributeName = "likes")
  List<String> likes;

  @DynamoDBAttribute(attributeName = "university")
  String university;

  @DynamoDBAttribute(attributeName = "course")
  String course;

  @DynamoDBAttribute(attributeName = "yearOfStudy")
  String yearOfStudy;

  @DynamoDBAttribute(attributeName = "phoneNumber")
  String phoneNumber;

  @DynamoDBAttribute(attributeName = "profile_picture")
  String profilePicture;

  @DynamoDBAttribute(attributeName = "friends")
  List<User> friends;

}

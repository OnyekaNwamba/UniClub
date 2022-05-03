package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import model.User;
import model.UserProfile;

public class DynamoDbRepository {

  final AmazonDynamoDB client;
  final public DynamoDBMapper mapper;

  public DynamoDbRepository() {
    this.client = AmazonDynamoDBClientBuilder.standard()
      .withRegion(Regions.EU_WEST_2)
      .build();

    this.mapper = new DynamoDBMapper(client);
  }

  public void deleteUser(String userId) throws JsonProcessingException {
    User user = User.builder().id(userId).build();
    this.mapper.delete(user);
  }

  public void deleteUserProfile(String userId) {
    UserProfile profile = UserProfile.builder().userId(userId).build();
    this.mapper.delete(profile);
  }
}

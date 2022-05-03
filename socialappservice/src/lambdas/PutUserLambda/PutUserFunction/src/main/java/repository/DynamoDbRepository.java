package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import model.User;

public class DynamoDbRepository {

  final AmazonDynamoDB client;
  final DynamoDBMapper mapper;

  public DynamoDbRepository() {
    this.client = AmazonDynamoDBClientBuilder.standard()
      .withRegion(Regions.EU_WEST_2)
      .build();

    this.mapper = new DynamoDBMapper(client);
  }

  public void saveUser(User user) {
    this.mapper.save(user);
  }

  public DynamoDBMapper getMapper() {
    return this.mapper;
  }

}

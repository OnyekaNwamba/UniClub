package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import model.User;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

  public User getUser(String email) {
    Map<String, AttributeValue> eav = new HashMap<>();
    eav.put(":v1", new AttributeValue().withS(email));

    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
      .withFilterExpression("email = :v1")
      .withExpressionAttributeValues(eav);
    List<User> result = mapper.scan(User.class, scanExpression);
    if(result.isEmpty()) {
      return null;
    }
    return result.get(0);
  }

  public User getUserById(String id) {
    Map<String, AttributeValue> eav = new HashMap<>();
    eav.put(":v1", new AttributeValue().withS(id));

    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
      .withFilterExpression("id = :v1")
      .withExpressionAttributeValues(eav);
    List<User> result = mapper.scan(User.class, scanExpression);
    if(result.isEmpty()) {
      return null;
    }
    return result.get(0);
  }
}

package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import model.Match;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class DynamoDbRepository {

  final AmazonDynamoDB client;
  final public DynamoDBMapper mapper;

  public DynamoDbRepository() {
    this.client = AmazonDynamoDBClientBuilder.standard()
      .withRegion(Regions.EU_WEST_2)
      .build();

    this.mapper = new DynamoDBMapper(client);
  }

  public ArrayList<Match> getMatches(String userId) {
    Map<String, AttributeValue> eav = new HashMap<>();
    eav.put(":v1", new AttributeValue().withS(userId));

    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
      .withFilterExpression("user_1 = :v1 or user_2 = :v1")
      .withExpressionAttributeValues(eav);
    return new ArrayList<>(mapper.scan(Match.class, scanExpression));
  }
}

package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import model.UserSwipe;

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

  public ArrayList<UserSwipe> getUserSwipes(String id, String toOrFrom, String swipeAction) {
    Map<String, AttributeValue> eav = new HashMap<>();
    eav.put(":v1", new AttributeValue().withS(id));
    eav.put(":v2", new AttributeValue().withS(swipeAction));

    Map<String, String> ean = new HashMap<>();
    ean.put("#" + toOrFrom, toOrFrom);

    String filterExpression = "#" + toOrFrom + " = :v1 and swipe_action = :v2";
    System.out.println(swipeAction);

    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
      .withFilterExpression(filterExpression)
      .withExpressionAttributeValues(eav)
      .withExpressionAttributeNames(ean);

    return new ArrayList<>(mapper.scan(UserSwipe.class, scanExpression));

  }
}

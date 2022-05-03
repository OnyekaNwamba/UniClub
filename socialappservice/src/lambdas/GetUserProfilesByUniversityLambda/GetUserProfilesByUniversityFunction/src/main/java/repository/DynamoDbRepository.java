package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.document.spec.ScanSpec;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import model.User;
import model.UserProfile;

import java.util.*;
import java.util.stream.Collectors;

public class DynamoDbRepository {

  public AmazonDynamoDB client;
  public DynamoDBMapper mapper;

  public DynamoDbRepository() {
    this.client = AmazonDynamoDBClientBuilder.standard()
      .withRegion(Regions.EU_WEST_2)
      .build();

    this.mapper = new DynamoDBMapper(client);
  }

  public void saveUser(User user) {
    this.mapper.save(user);
  }

  public void saveUserProfile(UserProfile userProfile) {
    this.mapper.save(userProfile);
  }

  public User getUser(String id) {
    Map<String, AttributeValue> eav = new HashMap<>();
    eav.put(":v1", new AttributeValue().withS(id));

    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
      .withFilterExpression("user_id = :v1")
      .withExpressionAttributeValues(eav);
    List<User> result = mapper.scan(User.class, scanExpression);
    if(result.isEmpty()) {
      return null;
    }
    return result.get(0);
  }

  public ArrayList<UserProfile> getUserProfileByUniversity(String university) {
    Map<String, AttributeValue> eav = new HashMap<>();
    eav.put(":v1", new AttributeValue().withS(university));

    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
      .withFilterExpression("university = :v1")
      .withExpressionAttributeValues(eav);
    ArrayList<UserProfile> result = new ArrayList<>(mapper.scan(UserProfile.class, scanExpression));
    if(result.isEmpty()) {
      return new ArrayList<>();
    }
    return result;
  }

  public Map<User, UserProfile> getUserAndProfileByUniversity(String university) {
    Map<User, UserProfile> result = new HashMap<>();
    Map<String, AttributeValue> eav = new HashMap<>();
    eav.put(":v1", new AttributeValue().withS(university));

    DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
      .withFilterExpression("university = :v1")
      .withExpressionAttributeValues(eav);
    List<UserProfile> resultProfiles = mapper.scan(UserProfile.class, scanExpression);
    if(!resultProfiles.isEmpty()) {
      for(UserProfile userProfile : resultProfiles) {
        User user = this.getUser(userProfile.getUserId());
        if(user != null) {
          result.put(user, userProfile);
        }
      }
    }

    return result;
  }
}

import activity.GetUserProfileByUniversity;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import model.User;
import model.UserProfile;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.mockito.Mockito;
import repository.DynamoDbRepository;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class GetUserProfilesByUniversityTest {

  private final GetUserProfileByUniversity getUserProfileByUniversity = new GetUserProfileByUniversity();
  private final DynamoDbRepository dynamoDbRepository = new DynamoDbRepository();
  private final Map<String, String> q_params = new HashMap<>();

  @Before
  public void setUp() {
    // Set query parameters
    q_params.put("university", "Integration-Test-Fake-University");
  }

  @Test
  public void givenValidUniversity_whenGetUniversities_expectCorrectResult() {

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withPathParameters(this.q_params);

    // Create test user 1
    UserProfile user1 = new UserProfile();
    user1.setUniversity("Integration-Test-University");
    user1.setUserId("Integration-Test-Id-1");

    // Create test user 2
    UserProfile user2 = new UserProfile();
    user2.setUniversity("Integration-Test-University");
    user2.setUserId("Integration-Test-Id-2");

    // Save test users
    this.dynamoDbRepository.mapper.save(user1);
    this.dynamoDbRepository.mapper.save(user2);

    // Create user using lambda
    APIGatewayProxyResponseEvent result = this.getUserProfileByUniversity.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test get
    UserProfile actual1 =  this.dynamoDbRepository.mapper.load(user1);
    UserProfile actual2 =  this.dynamoDbRepository.mapper.load(user2);

    String expected = "[{\"userId\":\"Integration-Test-Id-2\",\"university\":\"Integration-Test-University\"},{\"userId\":\"Integration-Test-Id-1\",\"university\":\"Integration-Test-University\"}]";

    // Delete test user from table
    this.cleanup(actual1);
    this.cleanup(actual2);

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue()); // Assert status code is 200
    assertEquals(expected, result.getBody());
  }

  @Test
  public void givenNonExistentUniversity_whenGetUniversities_expectCorrectResult() {

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withPathParameters(this.q_params);

    // Create test user 1
    UserProfile user1 = new UserProfile();
    user1.setUniversity("Integration-Test-University");
    user1.setUserId("Integration-Test-Id-1");

    // Create test user 2
    UserProfile user2 = new UserProfile();
    user2.setUniversity("Integration-Test-University");
    user2.setUserId("Integration-Test-Id-2");

    // Save test users
    this.dynamoDbRepository.mapper.save(user1);
    this.dynamoDbRepository.mapper.save(user2);

    // Create user using lambda
    APIGatewayProxyResponseEvent result = this.getUserProfileByUniversity.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test get
    UserProfile actual1 =  this.dynamoDbRepository.mapper.load(user1);
    UserProfile actual2 =  this.dynamoDbRepository.mapper.load(user2);

    String expected = "[]";

    // Delete test user from table
    this.cleanup(actual1);
    this.cleanup(actual2);

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue());
    assertEquals(expected, result.getBody());

    // Delete test user from table
    this.cleanup(actual1);
    this.cleanup(actual2);
  }

    public void cleanup(UserProfile userProfile) {
    this.dynamoDbRepository.mapper.delete(userProfile);
  }
}

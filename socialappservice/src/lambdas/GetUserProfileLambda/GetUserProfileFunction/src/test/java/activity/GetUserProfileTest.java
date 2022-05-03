package activity;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.lambda.runtime.Context;
import model.UserProfile;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import repository.DynamoDbRepository;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class GetUserProfileTest {
  private final GetUserProfile getUserProfile = new GetUserProfile();
  private final DynamoDbRepository dynamoDbRepository = new DynamoDbRepository();
  private final Map<String, String> q_params = new HashMap<>();

  @Before
  public void setUp() {
    // Set query parameters
    q_params.put("userId", "Integration-Test-Id-1");
  }

  @Test
  public void givenExistingUserId_whenGetUserProfile_expectCorrectResult() {

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withPathParameters(this.q_params);

    // Create test user
    UserProfile userProfile = new UserProfile();
    userProfile.setUserId("Integration-Test-Id-1");

    // Save test users
    this.dynamoDbRepository.mapper.save(userProfile);

    // Create user using lambda
    APIGatewayProxyResponseEvent result = this.getUserProfile.handleRequest(requestEvent, Mockito.mock(Context.class));

    String actual = "{\"userId\":\"Integration-Test-Id-1\"}";

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue());
    assertEquals(actual, result.getBody());

    // Delete test user from table
    this.cleanup(userProfile);
  }

  @Test
  public void givenNonExistingUserId_whenGetUserProfile_expectCorrectResult() {

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withPathParameters(this.q_params);

    // Create user using lambda
    APIGatewayProxyResponseEvent result = this.getUserProfile.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue());
    assertEquals("null", result.getBody());
  }

  public void cleanup(UserProfile userProfile) {
    this.dynamoDbRepository.mapper.delete(userProfile);
  }
}

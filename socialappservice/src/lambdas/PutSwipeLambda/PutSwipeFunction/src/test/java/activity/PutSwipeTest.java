package activity;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import model.UserSwipe;
import repository.DynamoDbRepository;

import org.junit.Test;
import org.mockito.Mockito;

import static org.junit.Assert.assertEquals;

public class PutSwipeTest {

  private final PutSwipe putSwipe = new PutSwipe();
  private final DynamoDbRepository dynamoDbRepository = new DynamoDbRepository();
  private final Map<String, String> q_params = new HashMap<>();
  private final String now = Instant.now().toString();

  @Test
  public void givenLeftSwipe_whenPutSwipe_expectCorrectResult() {

    // Set query parameters
    q_params.put("userSwipe", "{\"fromId\": \"Integration-Test-From-Id-1\", \"toId\": \"Integration-Test-To-Id-1\", \"swipeAction\": \"left\", \"dateTime\": \"" + now + "\"}");

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    // Create match using lambda
    APIGatewayProxyResponseEvent result = this.putSwipe.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue()); // Assert status code is 200

    // Test match is saved
    UserSwipe expected = UserSwipe.builder()
      .fromId("Integration-Test-From-Id-1")
      .toId("Integration-Test-To-Id-1")
      .swipeAction("left")
      .dateTime(now)
      .build();

    UserSwipe actualSwipe = dynamoDbRepository.mapper.load(expected);

    assertEquals(expected.getFromId(), actualSwipe.getFromId());
    assertEquals(expected.getToId(), actualSwipe.getToId());
    assertEquals(expected.getSwipeAction(), actualSwipe.getSwipeAction());

    // Delete test user from table
    this.cleanup(actualSwipe);
  }

  @Test
  public void givenRightSwipe_whenPutSwipe_expectCorrectResult() {

    // Set query parameters
    q_params.put("userSwipe", "{\"fromId\": \"Integration-Test-From-Id-1\", \"toId\": \"Integration-Test-To-Id-1\", \"swipeAction\": \"right\", \"dateTime\": \"" + now + "\"}");

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    // Create match using lambda
    APIGatewayProxyResponseEvent result = this.putSwipe.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue()); // Assert status code is 200

    // Test match is saved
    UserSwipe expected = UserSwipe.builder()
      .fromId("Integration-Test-From-Id-1")
      .toId("Integration-Test-To-Id-1")
      .swipeAction("right")
      .dateTime(now)
      .build();

    UserSwipe actualSwipe = dynamoDbRepository.mapper.load(expected);

    assertEquals(expected.getFromId(), actualSwipe.getFromId());
    assertEquals(expected.getToId(), actualSwipe.getToId());
    assertEquals(expected.getSwipeAction(), actualSwipe.getSwipeAction());

    // Delete test user from table
    this.cleanup(actualSwipe);
  }

  public void cleanup(UserSwipe swipe) {
    this.dynamoDbRepository.mapper.delete(swipe);
  }

}

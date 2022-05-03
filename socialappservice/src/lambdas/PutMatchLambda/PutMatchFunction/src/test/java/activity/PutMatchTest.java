package activity;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.util.HashMap;
import java.util.Map;

import model.Match;
import repository.DynamoDbRepository;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import static org.junit.Assert.assertEquals;

public class PutMatchTest {

  private final PutMatch putMatch = new PutMatch();
  private final DynamoDbRepository dynamoDbRepository = new DynamoDbRepository();
  private final Map<String, String> q_params = new HashMap<>();

  @Before
  public void setUp() {

    // Set query parameters
    q_params.put("match", "{\"matchId\": \"Integration-Test-Match-Id\", \"user1\": \"Integration-Test-User-1\", \"user2\": \"Integration-Test-User-2\"}");

  }

  @Test
  public void givenValidMatchDetails_whenPutMatch_expectCorrectResult() {

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    // Create match using lambda
    APIGatewayProxyResponseEvent result = this.putMatch.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue()); // Assert status code is 200

    // Test match is saved
    Match expected = Match.builder()
      .matchId("Integration-Test-Match-Id")
      .user1("Integration-Test-User-1")
      .user2("Integration-Test-User-2")
      .build();

    Match actualMatch = dynamoDbRepository.mapper.load(expected);

    assertEquals(expected.getMatchId(), actualMatch.getMatchId());
    assertEquals(expected.getUser1(), actualMatch.getUser1());
    assertEquals(expected.getUser2(), actualMatch.getUser2());

    // Delete test user from table
    this.cleanup(actualMatch);
  }

  @Test
  public void givenInvalidJsonInQueryStringParameter_whenPutMatch_shouldReturnFailedStatusCode() {

    // Set query parameters
    q_params.put("match", "{\"matchId\": \"Integration-Test-Match-Id\",,, \"user1\"::: \"Integration-Test-User-1\", \"user2\": \"Integration-Test-User-2\"}");

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    // Create match using lambda
    APIGatewayProxyResponseEvent result = this.putMatch.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(500, result.getStatusCode().intValue());

  }


  public void cleanup(Match match) {
    this.dynamoDbRepository.mapper.delete(match);
  }

}

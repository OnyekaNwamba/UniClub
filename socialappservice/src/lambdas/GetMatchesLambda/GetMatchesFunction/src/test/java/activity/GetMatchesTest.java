package activity;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import model.Match;
import repository.DynamoDbRepository;

import org.junit.Test;
import org.mockito.Mockito;

import static org.junit.Assert.assertEquals;

public class GetMatchesTest {

  private final GetMatches getMatches = new GetMatches();
  private final DynamoDbRepository dynamoDbRepository = new DynamoDbRepository();
  private final Map<String, String> q_params = new HashMap<>();

  @Test
  public void givenUserId_whenGetMatches_shouldReturnAllUserMatches() throws JsonProcessingException {

    String userId = "Integration-Test-User-Id-1";

    // Set query parameters
    q_params.put("userId", userId);

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    // Create list of test match first
    Match match1 = Match.builder()
      .matchId("Integration-Test-Match-Id-1")
      .user1(userId)
      .user2("Integration-Test-User-Id-2")
      .build();

    Match match2 = Match.builder()
      .matchId("Integration-Test-Match-Id-2")
      .user1(userId)
      .user2("Integration-Test-User-Id-3")
      .build();

    Match match3 = Match.builder()
      .matchId("Integration-Test-Match-Id-3")
      .user1("Integration-Test-User-Id-3")
      .user2("Integration-Test-User-Id-4")
      .build();

    dynamoDbRepository.mapper.save(match1);
    dynamoDbRepository.mapper.save(match2);
    dynamoDbRepository.mapper.save(match3);


    APIGatewayProxyResponseEvent result = this.getMatches.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue());

    System.out.println(result.getBody());

    // Test matches retrieval
    Match[] asArray = new ObjectMapper().readValue(result.getBody(), Match[].class);
    List<Match> actual = new ArrayList<>(List.of(asArray));

    assertEquals(2, actual.size());
    assertEquals(userId, actual.get(0).getUser1());
    assertEquals(userId, actual.get(1).getUser1());
    assertEquals("Integration-Test-User-Id-3", actual.get(0).getUser2());
    assertEquals("Integration-Test-User-Id-2", actual.get(1).getUser2());

    // Delete test matches from table
    actual.add(match1);
    actual.add(match2);
    actual.add(match3);
    this.cleanup(actual);
  }

  @Test
  public void givenInvalidUserId_whenGetMatches_shouldReturnFailedStatusCode() {

    // Set query parameters
    q_params.put("userId", null);

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    // Create match using lambda
    APIGatewayProxyResponseEvent result = this.getMatches.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(500, result.getStatusCode().intValue());

  }

  public void cleanup(List<Match> matches) {
    for (Match match : matches) {
      this.dynamoDbRepository.mapper.delete(match);
    }
  }

}

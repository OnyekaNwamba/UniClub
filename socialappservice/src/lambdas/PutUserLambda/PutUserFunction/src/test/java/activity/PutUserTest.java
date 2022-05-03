package activity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.util.HashMap;
import java.util.Map;

import model.User;
import repository.DynamoDbRepository;

import org.junit.Test;
import org.mockito.Mockito;

import static org.junit.Assert.assertEquals;

public class PutUserTest {

  private final PutUser putUSer = new PutUser();
  private final DynamoDbRepository dynamoDbRepository = new DynamoDbRepository();
  private final Map<String, String> q_params = new HashMap<>();

  @Test
  public void givenUser_whenPutUser_expectCorrectResult() {

    // Set query parameters
    q_params.put("user", "{\"id\":\"Integration-Test-User-Id-1\",\"firstName\":\"Integration-Test-First-Name\",\"lastName\":\"Integration-Test-Last-Name\",\"email\":\"Integration-Test-Email\",\"password\":\"Integration-Test-Password\"}\n");

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    // Create match using lambda
    APIGatewayProxyResponseEvent result = this.putUSer.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(200, result.getStatusCode().intValue()); // Assert status code is 200

    System.out.println(result.getBody());

    // Test match is saved
    User expected = User.builder()
      .id("Integration-Test-User-Id-1")
      .firstName("Integration-Test-First-Name")
      .lastName("Integration-Test-Last-Name")
      .email("Integration-Test-Email")
      .password("Integration-Test-Password")
      .build();

    User actual = dynamoDbRepository.getMapper().load(expected);

    assertEquals(expected.getId(), actual.getId());
    assertEquals(expected.getFirstName(), actual.getFirstName());
    assertEquals(expected.getLastName(), actual.getLastName());
    assertEquals(expected.getLastName(), actual.getLastName());
    assertEquals(expected.getEmail(), actual.getEmail());
    assertEquals(expected.getPassword(), actual.getPassword());

    // Delete test user from table
    this.cleanup(expected);
  }

  @Test
  public void givenInvalidJsonInQueryStringParameter_whenPutUser_shouldReturnFailedStatusCode() {

    // Set query parameters
    q_params.put("user", "{\"id\":\"Integration-Test-User-Id-1\",\"firstName\":,:\"Integration-Test-First-Name\",\"lastName\"::\"Integration-Test-Last-Name\",\"email\":\"Integration-Test-Email\",\"password\":\"Integration-Test-Password\"}\n");

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    // Create match using lambda
    APIGatewayProxyResponseEvent result = this.putUSer.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test Status Code
    assertEquals(500, result.getStatusCode().intValue());

  }

  public void cleanup(User user) {
    this.dynamoDbRepository.getMapper().delete(user);
  }

}

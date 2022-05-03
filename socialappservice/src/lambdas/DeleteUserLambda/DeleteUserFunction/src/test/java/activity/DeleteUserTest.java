package activity;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.s3.model.S3Object;
import model.User;
import model.UserProfile;
import org.junit.Test;
import org.mockito.Mockito;
import repository.DynamoDbRepository;
import repository.S3Repository;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class DeleteUserTest {
  private final DeleteUser deleteUser = new DeleteUser();
  private final DynamoDbRepository dynamoDbRepository = new DynamoDbRepository();
  private final S3Repository s3Repository = new S3Repository();
  private final Map<String, String> q_params = new HashMap<>();

  @Test
  public void givenUserId_whenDeleteUser_shouldDeleteUser() throws IOException, InterruptedException {

    // Creating ApiGateway request
    APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent()
      .withQueryStringParameters(this.q_params);

    String userId = "Integration-Test-User-Id-1";
    q_params.put("userId", userId);

    // Create test user
    User user = new User();
    user.setId(userId);

    // Create test user profile
    UserProfile userProfile = new UserProfile();
    userProfile.setUserId(userId);

    // Save all info
    dynamoDbRepository.mapper.save(user);
    dynamoDbRepository.mapper.save(userProfile);
    s3Repository.addObject(userId, File.createTempFile(userId, "png"));

    APIGatewayProxyResponseEvent result = this.deleteUser.handleRequest(requestEvent, Mockito.mock(Context.class));

    // Test deletion
    User actualUser = dynamoDbRepository.mapper.load(user);
    UserProfile actualUserProfile = dynamoDbRepository.mapper.load(userProfile);
    S3Object actualPp = s3Repository.getObject(userId);

    assertEquals(200, result.getStatusCode().intValue());
    assertEquals("Account deleted", result.getBody());
    assertNull(actualUser);
    assertNull(actualUserProfile);
    assertNull(actualPp);
  }
}

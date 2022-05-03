package activity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import model.UserProfile;
import repository.DynamoDbRepository;
import repository.S3Repository;

/**
 * Handler for requests to Lambda activity.
 */
public class GetUserProfileByUniversity implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    S3Repository repository;
    DynamoDbRepository dynamoDbRepository;

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        repository = new S3Repository();
        dynamoDbRepository = new DynamoDbRepository();

        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
          .withHeaders(headers);
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            final String university = input.getPathParameters().get("university");
            List<UserProfile> profiles = dynamoDbRepository.getUserProfileByUniversity(university);
            String json = objectMapper.writeValueAsString(profiles);
            return response
              .withStatusCode(200)
              .withBody(json);
        } catch (Exception e) {
            return response
              .withBody(e.getMessage())
              .withStatusCode(500);
        }
    }
}

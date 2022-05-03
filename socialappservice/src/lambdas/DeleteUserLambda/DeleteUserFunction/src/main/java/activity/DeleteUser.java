package activity;

import java.util.HashMap;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import repository.DynamoDbRepository;
import repository.S3Repository;

/**
 * Handler for requests to Lambda activity.
 */
public class DeleteUser implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    DynamoDbRepository dynamoDbRepository;
    S3Repository s3Repository;

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        dynamoDbRepository = new DynamoDbRepository();
        s3Repository = new S3Repository();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
                .withHeaders(headers);

        try {
            final String userId = input.getQueryStringParameters().get("userId");

            dynamoDbRepository.deleteUser(userId);
            dynamoDbRepository.deleteUserProfile(userId);

            s3Repository.deleteProfilePicture(userId);

            return response
                    .withStatusCode(200)
                    .withBody("Account deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return response
                    .withBody(e.getMessage())
                    .withStatusCode(500);
        }
    }
}

package lambdas.GetUserByIdLambda.GetUserByIdFunction.src.main.java.activity;

import java.util.HashMap;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lambdas.GetUserProfileLambda.GetUserProfileFunction.src.main.java.model.User;
import lambdas.SendFriendRequestLambda.SendFriendRequestFunction.src.main.java.repository.DynamoDbRepository;

/**
 * Handler for requests to Lambda activity.
 */
public class GetUserById implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    DynamoDbRepository repository;

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        repository = new DynamoDbRepository();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
                .withHeaders(headers);
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            final String id = input.getQueryStringParameters().get("userId");
            System.out.println(id);
            User user = repository.getUser(id);

            if(user == null) {
                throw new Exception("UserNotFoundException: Could not found user with user id " + id);
            }

            String jsonUser = objectMapper.writeValueAsString(user);
            return response
                    .withStatusCode(200)
                    .withBody(jsonUser);
        } catch (Exception e) {
            return response
                    .withBody(e.getMessage())
                    .withStatusCode(500);
        }
    }
}

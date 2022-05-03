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
import model.SwipeRepositoryActions;
import model.UserSwipe;
import repository.DynamoDbRepository;

/**
 * Handler for requests to Lambda activity.
 */

public class GetSwipe implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private DynamoDbRepository repository;
    private static final String TO = "to";
    private static final String FROM = "from";

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        repository = new DynamoDbRepository();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
                .withHeaders(headers);

        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            final String id = input.getQueryStringParameters().get("id");
            final SwipeRepositoryActions action = SwipeRepositoryActions.valueOf(input.getQueryStringParameters().get("action"));
            List<UserSwipe> userSwipeList;

            switch(action) {
                case TO_LEFT_SWIPES:
                    System.out.println("1");
                    userSwipeList = repository.getUserSwipes(id, TO, SwipeRepositoryActions.LEFT_SWIPE.toString());
                    break;
                case TO_RIGHT_SWIPES:
                    System.out.println("2");
                    userSwipeList = repository.getUserSwipes(id, TO, SwipeRepositoryActions.RIGHT_SWIPE.toString());
                    break;
                case FROM_LEFT_SWIPES:
                    System.out.println("3");
                    userSwipeList = repository.getUserSwipes(id, FROM, SwipeRepositoryActions.LEFT_SWIPE.toString());
                    break;
                case FROM_RIGHT_SWIPES:
                    System.out.println("4");
                    userSwipeList = repository.getUserSwipes(id, FROM, SwipeRepositoryActions.RIGHT_SWIPE.toString());
                    break;
                default:
                    throw new IllegalStateException("Unexpected value: " + action);
            }

            return response
                    .withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(userSwipeList));
        } catch (Exception e) {
            e.printStackTrace();
            return response
                    .withBody(e.getMessage())
                    .withStatusCode(500);
        }
    }
}

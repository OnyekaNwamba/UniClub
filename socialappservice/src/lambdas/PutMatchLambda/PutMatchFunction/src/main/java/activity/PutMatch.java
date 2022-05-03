package activity;

import java.util.HashMap;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import model.Match;
import repository.DynamoDbRepository;

/**
 * Handler for requests to Lambda activity.
 */

public class PutMatch implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private DynamoDbRepository repository;

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        repository = new DynamoDbRepository();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
                .withHeaders(headers);

        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            final Match match = objectMapper.readValue(input.getQueryStringParameters().get("match"), Match.class);
            repository.saveMatch(match);

            return response
                    .withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(match));
        } catch (Exception e) {
            e.printStackTrace();
            return response
                    .withBody(e.getMessage())
                    .withStatusCode(500);
        }
    }
}

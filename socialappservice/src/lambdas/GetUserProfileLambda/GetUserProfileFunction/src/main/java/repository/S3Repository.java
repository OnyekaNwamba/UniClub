package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import model.UserProfile;

public class S3Repository {
  final AmazonS3 client = AmazonS3ClientBuilder.standard()
    .withRegion(Regions.EU_WEST_2)
    .build();

  final String bucketName = "social-app-user-profiles";
  final ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

  public UserProfile getUserProfile(String userId)  {
    final String KEY = userId + ".json";
    try {
      final S3Object result = this.client.getObject(bucketName, KEY);
      S3ObjectInputStream inputStream = result.getObjectContent();
      return objectMapper.readValue(inputStream, UserProfile.class);
    } catch (Exception e) {
      e.printStackTrace();
    }

    return null;
  }
}

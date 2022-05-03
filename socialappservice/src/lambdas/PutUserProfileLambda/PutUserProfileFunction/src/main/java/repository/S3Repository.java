package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import model.UserProfile;

public class S3Repository {
  final AmazonS3 client = AmazonS3ClientBuilder.standard()
    .withRegion(Regions.EU_WEST_2)
    .build();

  final String bucketName = "social-app-user-profiles";
  final ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

  public void saveUserProfile(UserProfile profile) {
    try {
      String profileJson  = objectMapper.writeValueAsString(profile);
//      this.client.putObject(bucketName, profile.getUser().getId(), objectMapper.writeValueAsString(profile));
      this.client.putObject(bucketName, profile.getUserId(), objectMapper.writeValueAsString(profile));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}

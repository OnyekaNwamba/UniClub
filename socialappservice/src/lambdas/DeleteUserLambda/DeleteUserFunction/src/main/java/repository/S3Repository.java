package repository;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;

import java.io.File;
import java.io.IOException;

public class S3Repository {
  final static String  BUCKET_NAME = "social-app-user-profile-pictures";
  final AmazonS3 client;


  public S3Repository() {
    client = AmazonS3ClientBuilder.standard()
      .withRegion(Regions.EU_WEST_2)
      .build();
  }

  public void deleteProfilePicture(String userId) throws IOException {
    client.deleteObject(new DeleteObjectRequest(BUCKET_NAME, userId));
  }

  // For integration tests
  public void addObject(String key, File file) throws IOException {
    client.putObject(new PutObjectRequest(BUCKET_NAME, key, file));
  }

  // For integration tests
  public S3Object getObject(String key) {
    try {
      return client.getObject(new GetObjectRequest(BUCKET_NAME, key));
    } catch (AmazonS3Exception amazonS3Exception) {
      return null;
    }
  }
}

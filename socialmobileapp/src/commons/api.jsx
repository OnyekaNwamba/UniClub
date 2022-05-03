import axios from 'axios';
import {User} from '../models/User';
import {UserProfile} from '../models/UserProfile';
import {UserSwipe} from '../models/UserSwipe';
import {Match} from '../models/Match';
import {RNS3} from 'react-native-s3-upload';

const local = axios.create();

export class ApiResult {

  constructor(success, error) {
    this.success = success;
    this.error = error;
    this.isError = !!error
  }

  static asError(error) {
    return new ApiResult(null, error);
  }

  static asSuccess(success) {
    return new ApiResult(success, null);
  }

  ifSuccessful(callback) {
    if (this.isError) {
      return this;
    }

    callback(this.success);
    return this;
  }

  orElse(callback) {
    if (!this.isError) {
      return this;
    }

    callback(this.error);
    return this;
  }
}

export class Api {

  S3_BUCKET = "social-app-user-profile-pictures";
  REGION = "eu-west-2";
  ACCESS_KEY = "YOUR AWS ACCESS KEY";
  SECRET_KEY = "YOUR AWS SECRET KEY";

  options = {
    // keyPrefix: "uploads/",
    bucket: this.S3_BUCKET,
    region: this.REGION,
    accessKey: this.ACCESS_KEY,
    secretKey: this.SECRET_KEY,
    successActionStatus: 200
  }

  // API Gateway link
  url = "https://580tmpvmi5.execute-api.eu-west-2.amazonaws.com/";
  wrap = async (callback, errorMessage) => {
    try {
      const result = await callback();
      return ApiResult.asSuccess(result);
    } catch (error) {
      // In case `error.response.data` not available fallback to `error`
      const response = ((error || {}).response || {}).data || error;

      const message = errorMessage
        ? `${errorMessage}. ${response}`
        : response;

      console.log(`ApiService: ${message}`);
      return ApiResult.asError(message);
    }
  }

  putUser = async (user) => {
    return this.wrap(async () => {
      const request = this.url + "users?user=" + JSON.stringify(user);
      const response = await local.get(request);
      return User.fromApi(response.data);
    }, "Failed to do put user");
  }

  getUser = async (email) => {
    return this.wrap(async () => {
      const request = this.url + "users/" + email;
      const response = await local.get(request);
      return User.fromApi(response.data);
    }, "Failed to do get user");
  }

  putUserProfile = async (profile) => {
    return this.wrap(async () => {
      const request = this.url + "profiles?profile=" + JSON.stringify(profile);
      const response = await local.put(request);
      return UserProfile.fromApi(response.data);
    }, "Failed to do put profile");
  }

  getUserProfile = async (userId) => {
    return this.wrap(async () => {
      const request = this.url + "profiles/" + userId;
      const response = await local.get(request);
      console.log("res", response)
      return UserProfile.fromApi(response.data)
    }, "Failed to do get user profile");
  }

  getUserProfileByUniversity = async (university) => {
    return this.wrap(async () => {
      const request = this.url + "profiles/university/" + university;
      const response = await local.get(request);
      return response.data.map(s => UserProfile.fromApi(s))
    }, "Failed to do get user profiles by uni");
  }

  getUserById = async (id) => {
    return this.wrap(async () => {
      const request = this.url + "user?userId=" + id;
      const response = await local.get(request);
      return User.fromApi(response.data)
    }, "Failed to do get user profiles by id " + id);
  }

  getAllRightSwipesFromMe = async (id) => {
    return this.wrap(async () => {
      const request = this.url + "swipes?id=" + id + "&action=FROM_RIGHT_SWIPES";
      const response = await local.get(request);
      return response.data.map(s => UserSwipe.fromApi(s));
    }, "Failed to do get swipe");
  }

  getAllLeftSwipesFromMe = async (id) => {
    return this.wrap(async () => {
      const request = this.url + "swipes?id=" + id + "&action=FROM_LEFT_SWIPES";
      const response = await local.get(request);
      return response.data.map(s => UserSwipe.fromApi(s));
    }, "Failed to do get swipe");
  }

  getAllRightSwipesToMe = async (id) => {
    return this.wrap(async () => {
      const request = this.url + "swipes?id=" + id + "&action=TO_RIGHT_SWIPES";
      const response = await local.get(request);
      return response.data.map(s => UserSwipe.fromApi(s));
    }, "Failed to do get swipe");
  }

  getAllLeftSwipesToMe = async (id) => {
    return this.wrap(async () => {
      const request = this.url + "swipes?id=" + id + "&action=TO_LEFT_SWIPES";
      const response = await local.get(request);
      return response.data.map(s => UserSwipe.fromApi(s));
    }, "Failed to do get swipe");
  }

  putUserSwipe = async (userSwipe) => {
    return this.wrap(async () => {
      const request = this.url + "swipe?userSwipe=" + JSON.stringify(userSwipe);
      const response = await local.post(request);
      console.log(response);
    }, "Failed to put swipe");
  }

  getMatches = async (userId) => {
    return this.wrap(async () => {
      const request = this.url + "matches?userId=" + userId;
      const response = await local.get(request);
      return response.data.map(s => Match.fromApi(s));
    }, "Failed to do get matches");
  }

  putMatch = async (match) => {
    return this.wrap(async () => {
      const request = this.url + "match?match=" + JSON.stringify(match);
      const response = await local.post(request);
      console.log(response);
    }, "Failed to put match");
  }

  putProfilePicture = async (file) => {
    return this.wrap(async () => {
      return RNS3.put(file, this.options);
    }, "Failed to put profile picture");
  }

  deleteAccount = async (userId, firstName, lastName) => {
    return this.wrap(async () => {
      const request = this.url + "delete?userId=" + userId + "&firstName=" + firstName + "&lastName=" + lastName;
      const response = await local.get(request);
      console.log(response);
    }, "Failed to delete account");
  }
}


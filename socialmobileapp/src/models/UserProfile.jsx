import { User } from "./User";

export class UserProfile {
  constructor(userId, dob, aboutMe, likes, university, course, yearOfStudy, phoneNumber, profilePicture, friends) {
    this.userId = userId;
    this.dob = dob;
    this.aboutMe = aboutMe;
    this.likes = likes;
    this.university = university;
    this.course = course;
    this.yearOfStudy = yearOfStudy;
    this.phoneNumber = phoneNumber;
    this.profilePicture = profilePicture;
    this.friends = friends
  }

  static fromApi(item) {
    return new UserProfile(
      item.userId,
      item.dob,
      item.aboutMe,
      item.likes,
      item.university,
      item.course,
      item.yearOfStudy,
      item.phoneNumber,
      item.profilePicture,
      item.friends
    )
  }

  static parse(item) {
    return {
      userId: item.userId,
      dob: item.dob,
      aboutMe: item.aboutMe,
      likes: item.likes,
      university: item.university,
      course: item.course,
      yearOfStudy: item.yearOfStudy,
      phoneNumber: item.phoneNumber || "",
      profilePicture:  item.profilePicture,
      friends: item.friends || [],
    }
  }
}

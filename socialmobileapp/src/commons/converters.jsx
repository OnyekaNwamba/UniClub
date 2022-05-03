import { UserProfile } from "../models/UserProfile";

export const userProfileConverter = {
  toFirestore: (item) => {
    console.log(item)
    return {
      userId: item.userId,
      dob: item.dob,
      aboutMe: item.aboutMe,
      likes: item.likes,
      university: item.university,
      course: item.course,
      yearOfStudy: item.yearOfStudy,
      phoneNumber: item.phoneNumber,
      profilePicture: item.profilePicture,
      friends: item.friends
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new UserProfile(
      data.userId,
      data.dob,
      data.aboutMe,
      data.likes,
      data.university,
      data.course,
      data.yearOfStudy,
      data.phoneNumber,
      data.profilePicture,
      data.friends,
    );
  }
}

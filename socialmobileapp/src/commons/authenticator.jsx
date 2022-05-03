import AsyncStorage from '@react-native-async-storage/async-storage';

export class Authenticator {

  async logIn(user) {
    await AsyncStorage.setItem('@user', JSON.stringify(user));
  }

  async authenticate(_user) {
    await AsyncStorage.setItem('@user', JSON.stringify(_user));
    return this.isLoggedIn();
  }

  async logOut() {
    await AsyncStorage.removeItem("@user");
  }

  async isLoggedIn() {
    return !!await AsyncStorage.getItem("@user");
  }
}

import React, { Component } from 'react';
import {
  Box,
  Avatar,
  Button,
  VStack,
  Heading,
  Input,
  Icon,
  Center,
  FormControl,
  ScrollView,
  TextArea,
  Modal,
  Image,
  Text,
  HStack,
  Badge,
  Spinner
} from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import {
  CalendarIcon,
  EmailIcon,
  HeartIcon,
  LockIcon,
  LogoutIcon,
  UserIcon,
  WorkIcon
} from "../../../commons/Icons";

import {StyleSheet, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {UserProfile} from "../../../models/UserProfile";
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isModalVisible: false,
      user: undefined,
      dob: "",
      university: "",
      likes: [],
      currentLike: "",
      course: "",
      yearOfStudy: "",
      phoneNumber: "",
      profilePicture: "",
      showDatePicker: false,
      aboutMe: ""
    };
  }

  async componentDidMount() {
    const loggedIn = await this.props.authenticator.isLoggedIn();
    if(loggedIn) {
      // let user = await this.props.authenticator.database.get("user");
      let user = await AsyncStorage.getItem("@user");
      user = JSON.parse(user);
      console.log(user);
      if(user) {
        console.log(user.id);
        const response = await this.props.api.getUserProfile(user.id);
        if(!response.isError) {
          const userProfile = response.success;
          this.setState({
            isLoading: false,
            user: user,
            firstName: user.firstName,
            lastName: user.lastName,
            dob: userProfile.dob,
            university: userProfile.university,
            likes: userProfile.likes,
            course: userProfile.course,
            yearOfStudy: userProfile.yearOfStudy,
            profilePicture: userProfile.profilePicture,
            aboutMe: userProfile.aboutMe
          });
        }
      }
    } else {
      await this.props.navigation.navigate("LogInPage")
    }
  }

  async logOut() {
    await this.props.authenticator.logOut();
    if(!await this.props.authenticator.isLoggedIn()) {
      this.props.navigation.navigate("LogInPage");
    }
  }

  renderHeader = () => {
    return (
      <Box
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.props.navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>

        <View style={styles.profileText}>
            <Heading >Profile</Heading>
        </View>

        <TouchableOpacity onPress={() => this.logOut()}>
          <LogoutIcon style={styles.logoutButton} />
        </TouchableOpacity>
      </Box>
    )
  }

  renderSaveButton = () => {
    return(
      <Button
        style={styles.loginButton}
        backgroundColor={"#6f61e8"}
        colorScheme={"#6f61e8"}
        w={"80%"}
        borderRadius={14}
        size="lg"
        p={3}
        ml={10}
        mt={4}
        onPress={() => this.clickSaveButtonHandler()}
      >
        Save Changes
      </Button>
    )
  }

  clickSaveButtonHandler = async () => {
    const userProfile = new UserProfile(
      this.state.user.id,
      this.state.dob,
      this.state.aboutMe,
      this.state.likes,
      this.state.university,
      this.state.course,
      this.state.yearOfStudy,
      this.state.phoneNumber,
      this.state.profilePicture,
    );

    const userResponse = await this.props.api.putUser(this.state.user);
    const userProfileResponse = await this.props.api.putUserProfile(userProfile);

    if(userResponse.isError) {
      console.log("ERROR: ", + userResponse.error)
    } else {
      console.log(userResponse.success)
    }

    if(userProfileResponse.isError) {
      console.log("ERROR: ", + userProfileResponse.error)
    }

  }

  onImagePressedHandler = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    })
  }

  onDeleteAccountPressedHandler = async () => {
    const response = await this.props.api.deleteAccount(this.state.user.id, this.state.user.firstName, this.state.user.lastName);
    if(!response.isError) {
      this.props.authenticator.logout(this.props.navigation);
    }
  }

  addLike = (e) => {
    if(e.text.indexOf(' ') >= 0) {
      const likes = this.state.likes;
      this.state.likes.push(this.state.currentLike);
      this.setState({
        likes: likes,
        currentLike: undefined
      });
    } else {
      this.setState({
        currentLike: e.text
      });
    }
  }

  renderLikes = () => {
    return this.state.likes.map((like, index) =>
      <TouchableOpacity
        onPress={() => {
          const likes = this.state.likes
          likes.splice(index, 1);
          this.setState({likes: likes});
        }}
      >
        <Badge key={index} bg={"#6f61e8"} variant={"solid"} borderRadius={15}>
          {like}
        </Badge>
      </TouchableOpacity>
    )
  }

  renderBody = (user, userProfile, isModalOpen, onImagePressedHandler) => {
    const profilePicture = userProfile.profilePicture.replace(" ", "%20");
    return(
      <ScrollView>
        <Box style={styles.body}>
          <Modal
            isOpen={isModalOpen}
            onClose={onImagePressedHandler}
          >
            <Modal.Content
              p="0"
              style={{ alignSelf: "stretch"}}
            >
              <Modal.CloseButton />
              <Modal.Body>
                <View>
                  <Image
                    style={{ width: '100%', height: 200, resizeMode: 'stretch' }}
                    source={{
                      uri: profilePicture
                    }}
                    key={profilePicture}
                    alt="Enlarged profile picture"
                  />
                </View>
              </Modal.Body>
            </Modal.Content>
          </Modal>
          <Center>
            <TouchableOpacity
              onPress={onImagePressedHandler}
            >
              <Avatar
                size="250px"
                source={{
                  uri: profilePicture
                }}
                key={profilePicture}
              >
              </Avatar>
            </TouchableOpacity>
          </Center>
          <Box style={{margin: 20}} />
          <Box style={styles.form}>
            <VStack space={4} mt={0}>
              <Box />
              <Heading size="md">Profile Info</Heading>
              <FormControl>
                <Input
                  onChangeText={(e) => {
                    user.firstName = e;
                    this.setState({
                      user: user
                    });
                  }}
                  placeholder="First Name"
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  value={user?.firstName}
                  InputLeftElement={
                    <Icon
                      as={<UserIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <FormControl>
                <Input
                  onChangeText={(e) => {
                    user.lastName = e;
                    this.setState({
                      user: user
                    });
                  }}
                  placeholder="Last Name"
                  value={user?.lastName}
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<UserIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <FormControl>
                <Input
                  onChangeText={(e) => {
                    userProfile.dob = e;
                    this.setState({
                      userProfile: userProfile
                    });
                  }}
                  placeholder="Date of Birth"
                  value={userProfile?.dob}
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<CalendarIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <FormControl>
                <Input
                  onChangeText={(e) => {
                    userProfile.university = e;
                    this.setState({
                      userProfile: userProfile
                    });
                  }}
                  placeholder="University"
                  value={userProfile?.university}
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<WorkIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <FormControl>
                <Input
                  onChangeText={(e) => {
                    userProfile.course = e;
                    this.setState({
                      userProfile: userProfile
                    });
                  }}
                  placeholder="Course"
                  value={userProfile?.course}
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<WorkIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <FormControl>
                <Input
                  onChangeText={(e) => this.setState({password: e})}
                  placeholder="Year of study"
                  value={userProfile?.yearOfStudy}
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<LockIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <FormControl>
                <TextArea
                  onChangeText={(e) => {
                    userProfile.aboutMe = e;
                    this.setState({
                      userProfile: userProfile
                    });
                  }}
                  minW={"90%"}
                  placeholder="Bio"
                  style={styles.textArea}
                  value={userProfile?.aboutMe}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  p={10}/>
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Likes/Hobbies"
                  onChange={(e) => this.addLike(e.nativeEvent)}
                  value={this.state.currentLike}
                  value={userProfile?.likes}
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<HeartIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
                <HStack space={4} mt={2}>
                  {this.renderLikes()}
                </HStack>
              </FormControl>
              <Box style={{margin: 10}} />
              <Heading size="md">Account Info</Heading>
              <FormControl>
                <Input
                  onChangeText={(e) => {
                    user.email = e;
                    this.setState({
                      user: user
                    });
                  }}
                  value={user?.email}
                  placeholder="Email"
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<EmailIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <Heading size="xs">Change password</Heading>
              <FormControl>
                <Input
                  onChangeText={(e) => this.setState({password: e})}
                  placeholder="Password"
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<LockIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Confirm Password"
                  w={"90%"}
                  borderRadius={14}
                  borderColor={"white"}
                  bg={"white"}
                  size="lg"
                  p={4}
                  InputLeftElement={
                    <Icon
                      as={<LockIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                    />
                  }>
                </Input>
              </FormControl>
              <Box style={{margin: 10}} />
              <TouchableOpacity onPress={this.onDeleteAccountPressedHandler}>
                <Box>
                  <Heading size="sm" style={{color: "red"}} >Delete Your Account</Heading>
                  <Text fontSize="sm">This will remove all of your data and cannot be undone</Text>
                </Box>
              </TouchableOpacity>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.isLoading ?
          <Spinner color={"#6f61e8"} /> :
          <Box>
            {this.renderHeader()}
            {this.renderBody(this.state.user, this.state ? this.state : {}, this.state.isModalVisible, this.onImagePressedHandler)}
            {this.renderSaveButton()}
          </Box>
        }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7fc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 30,
    paddingTop: 30,
    paddingRight: 30
  },
  backButton: {
    width: 35,
    height: 35
  },
  logoutButton: {
    width: 35,
    height: 35
  },
  profileText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0
  },
  body: {
    padding: 20,
    paddingTop: 40
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center"
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
  },
  textArea: {
    width: 312,
    height: 400
  }
})

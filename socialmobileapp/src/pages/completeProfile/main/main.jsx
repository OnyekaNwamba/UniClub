import React, {Component} from 'react';
import {
  Avatar, Badge,
  Box,
  Button,
  Center,
  FormControl,
  Heading, HStack,
  Icon,
  Input, Modal,
  ScrollView,
  Select, Spinner,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import DatePicker from 'react-native-date-picker';
import {CalendarIcon, HeartIcon, LockIcon, WorkIcon} from '../../../commons/Icons';
import {StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {UserProfile} from '../../../models/UserProfile';
import * as ImagePicker from 'react-native-image-picker';
import { universities } from './universities';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class CompleteProfilePage extends Component {
  constructor(props) {
    super(props);

    let user;

    this.state = {
      user: user,
      dob: undefined,
      university: "",
      likes: [],
      currentLike: "",
      course: "",
      yearOfStudy: "",
      phoneNumber: "",
      showDatePicker: false,
      universityList: universities.sort(),
      bio: "",
      singleFile: undefined,
      uri: "",
      isModalVisible: false
    };
  }

  async componentDidMount() {
    this.setState({
      user: this.props.route.params.user
    });
  }

  async uploadImage () {

    const file = {
      uri: this.state.uri,
      name: `${this.state.user.id}.png`,
      type: "image/png"
    };

    const img = await this.props.api.putProfilePicture(file);

  }

  selectPhoto = async () => {
    const options = {
      mediaType: 'photo',
    };
    ImagePicker.launchImageLibrary(options)
      .then(result => {
        this.setState({
        uri: result.assets[0].uri
      });
    });
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

  async completeProfileButtonChangeHandler() {
    // Get user from params
    const user = this.state.user;

    console.log(this.state.user);

    // Profile picture link
    const profilePicture = `https://social-app-user-profile-pictures.s3.eu-west-2.amazonaws.com/${user.id}.png`;

    // Create profile
    const profile = new UserProfile(
      user.id,
      this.state.dob,
      this.state.bio,
      this.state.likes,
      this.state.university,
      this.state.course,
      this.state.yearOfStudy,
      "",
      profilePicture
    );

    this.setState({
      isModalVisible: true
    })

    this.uploadImage();
    const userResponse = await this.props.api.putUser(this.state.user);
    if(!userResponse.isError) {
      const profileResponse = await this.props.api.putUserProfile(profile);
      if(!profileResponse.isError) {
        await this.props.authenticator.authenticate(this.state.user);
        const isLoggedIn = await this.props.authenticator.logIn(this.state.user);
        if(isLoggedIn) {
          this.setState({
            isModalVisible: false
          });
          this.props.navigation.navigate("ExplorePage", {user: this.state.user})
        }
      } else {
        console.log(profileResponse.error);
      }
    }
    this.setState({
      isModalVisible: false
    });
  }

  render() {
    return (
      <ScrollView>
        <Box style={{width: "100%", height: "100%"}} bg="#f7f7fc">
          <Modal
            isOpen={this.state.isModalVisible}
            onClose={() => this.setState({isModalVisible: false})}
            size="lg"
          >
            <Modal.Content maxWidth="400px">
              <Modal.Header>Creating Account</Modal.Header>
              <Modal.Body>
                Loading
                <Spinner size={"lg"} colorScheme={"purple"} color={"purple"} />
              </Modal.Body>
            </Modal.Content>
          </Modal>
          <Box style={styles.heading}>
            <Heading size="2xl" mt={20} color={"#6f61e8"} textAlign={"center"} p={9}>Complete your profile</Heading>
            <Text fontSize={'lg'}> It will help others know more about you️</Text>
          </Box>
          <Center style={styles.avatar}>
            <TouchableOpacity
              onPress={this.selectPhoto}
            >
              <Avatar
                size="250px"
                source={{ uri: this.state.uri || "https://icons-for-free.com/download-icon-camera-131965017355314519_256.icns" }}
                key={this.state.uri || "https://icons-for-free.com/download-icon-camera-131965017355314519_256.icns"}
              />
            </TouchableOpacity>
          </Center>
          <Box style={styles.form}>
            <VStack space={4} m={5} mt={0}>
              <Box />
              <FormControl>
                <Input
                  w={"100%"}
                  placeholder="Date of Birth"
                  value={this.state.dob}
                  borderRadius={14}
                  borderColor={"#ffffff"}
                  bg={"#ffffff"}
                  size="lg"
                  p={4}
                  onChangeText={() => {this.setState({showDatePicker: true})}}
                  InputLeftElement={
                    <Icon
                      as={<CalendarIcon style={{marginLeft: 15}} />}
                      size={8}
                      ml="2"
                      color="muted.500"
                      onPress={() => {
                        console.log(this.state);
                        this.setState({showDatePicker: true})
                      }}
                    />
                  }>
                </Input>
                <DatePicker
                  modal
                  locale={"en-GB"}
                  open={this.state.showDatePicker}
                  mode={"date"}
                  date={new Date()}
                  onChange={(e, date) => {console.log(e, date)}}
                  onCancel={() => {this.setState({showDatePicker: false})}}
                  onConfirm={(date) => this.setState({dob: moment(date).format("D/M/YYYY")})}
                />
              </FormControl>
              <FormControl>
                <Select
                  placeholder="Choose University"
                  onValueChange={itemValue => this.setState({university: itemValue})}
                  minWidth="100%"
                  minHeight="50"
                  backgroundColor={"white"}
                  borderWidth={0}
                  borderRadius={14}
                  pt={5}
                  pl={5}
                  pr={50}
                >
                  {this.state.universityList.map((university, index) =>  {
                    return <Select.Item size="lg" minHeight="50" key={index} value={university.name} label={university.name}/>})
                  }
                </Select>
              </FormControl>
              <FormControl>
                <Input
                  onChangeText={(e) => this.setState({course: e})}
                  placeholder="Course"
                  w={"100%"}
                  borderRadius={14}
                  borderColor={"#ffffff"}
                  bg={"#ffffff"}
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
                  onChangeText={(e) => this.setState({yearOfStudy: e})}
                  placeholder="Year of study"
                  w={"100%"}
                  borderRadius={14}
                  borderColor={"#ffffff"}
                  bg={"#ffffff"}
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
                <Text fontSize="xs" ml={1}>Press space to enter item</Text>
                <Input
                  onChange={(e) => this.addLike(e.nativeEvent)}
                  value={this.state.currentLike}
                  placeholder="Likes/Hobbies"
                  w={"100%"}
                  borderRadius={14}
                  borderColor={"#ffffff"}
                  bg={"#ffffff"}
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
              <FormControl>
                <TextArea
                  onChangeText={(e) => {
                    this.setState({
                      bio: e
                    });
                  }}
                  placeholder="Bio"
                  style={styles.textArea}
                  value={this.state.bio}
                  borderRadius={14}
                  borderColor={"#ffffff"}
                  bg={"#ffffff"}
                  size={"lg"}
                  p={10}/>
              </FormControl>
            </VStack>
          </Box>
          <Button
            style={styles.completeProfileButton}
            minW={"90%"}
            borderRadius={14}
            size="lg"
            p={3}
            ml={5}
            mt={4}
            mr={5}
            mb={10}
            onPress={() => this.completeProfileButtonChangeHandler()}
          >
            Complete profile
          </Button>
        </Box>
        </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    flex: 0.9,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    justifyContent: "center",
    alignItems: "center",
    margin: 50
  },

  form: {
    justifyContent: "center",
    alignItems: "center",
  },

  completeProfileButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6f61e8"
  },

  or: {
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  textArea: {
    width: 350,
    height: 400
  }
})

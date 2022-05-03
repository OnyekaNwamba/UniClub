import React, { Component, useState } from "react";
import {
  Box,
  Spinner,
  Center,
  Heading,
  Avatar,
  Modal,
  FormControl,
  Input,
  Button,
  Radio,
  Slider,
  Checkbox,
  Stack,
  HStack, Text,
} from 'native-base';
import CardStack  from 'react-native-card-stack-swiper';
import CardFlip from 'react-native-card-flip';
import LinearGradient from 'react-native-linear-gradient';
import { BottomNavigation } from "../../../commons/BottomNavigation";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import styles, {DIMENSION_HEIGHT, DIMENSION_WIDTH} from "../../../assets/styles";
import University from "../../../components/University";
import Filters from "../../../components/Filters";
import CardItem from "../../../components/CardItem";
import { DateTimeUtils } from "../../../shared/DateTimeUtils";
import BackCardItem from "../../../components/BackCardItem";
import { UserSwipe } from "../../../models/UserSwipe";
import { MatchedPage } from "./matched";
import { collection, where, setDoc, query, onSnapshot, doc, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IMAGE_UNAVAILABLE = "https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg";

export class ExplorePage extends Component {


  constructor(props) {
    super(props)

    this.state = {
      myActions: [],
      cardIndex: 0,
      user: {},
      users: [],
      unfiltered: [],
      currentFilters: {age: {minAge: 18, maxAge: 50}},
      userProfile: {},
      swipedForMe: [],
      swipedLeftFromMe: [],
      swipedLeftToMe: [],
      swipedRightToMe: [],
      swipedRightFromMe: [],
      isModalVisible: false,
      hasInitiallyFiltered: false,
      isLoading: true,
      checked: true
    }
  }


  async componentDidMount() {
    let user;
    this._isMounted = true;

    const loggedIn = await this.props.authenticator.isLoggedIn();

    if(!loggedIn) {
      this.props.navigation.navigate("LogInPage")
    }

    user = JSON.parse(await AsyncStorage.getItem("@user"));

    const profileResponse = await this.props.api.getUserProfile(user.id);

    // If user exists but not profile, we make user complete their profile
    if(profileResponse.isError) {
      this.props.navigation.navigate("CompleteProfilePage");
      return
    }
    const userProfile = profileResponse.success;
    const profilesResponse = await this.props.api.getUserProfileByUniversity(userProfile.university);

    let profiles = profilesResponse.isError
      ? []
      : await Promise.all(profilesResponse.success
        .filter(item => item.userId !== user.id)
        .map(async profile => {
          const userResponse = await this.props.api.getUserById(profile.userId);
          if (!userResponse.isError) {
            profile.user = userResponse.success;
            return await profile;
          }
        })
      );

    this.setState({
      isLoading: false
    });

    const swipedLeftFromMeQuery = query(
      collection(this.props.firebaseDb, "swipes"),
      where("swipeAction", "==", "left"),
      where("from", "==", user.id)
    );

    const swipedLeftToMeQuery = query(
      collection(this.props.firebaseDb, "swipes"),
      where("swipeAction", "==", "left"),
      where("to", "==", user.id)
    );

    const swipedRightToMeQuery = query(
      collection(this.props.firebaseDb, "swipes"),
      where("swipeAction", "==", "right"),
      where("to", "==", user.id)
    );

    const swipedRightFromMeQuery = query(
      collection(this.props.firebaseDb, "swipes"),
      where("swipeAction", "==", "right"),
      where("from", "==", user.id)
    );

    const swipedRightToMeSnapshot = await getDocs(swipedRightToMeQuery);
    const swipedRightToMe = swipedRightToMeSnapshot.docs.map(doc => doc.data());

    this.setState({
      swipedRightToMe: swipedRightToMe
    });

    if(!this.state.hasInitiallyFiltered) {
      // Initial filtering to remove user's we've already seen
      const swipedLeftFromMeSnapshot = await getDocs(swipedLeftFromMeQuery);
      swipedLeftFromMeSnapshot.forEach((doc) => {
        const swipe = doc.data();
        const found = profiles.findIndex(user => user.userId === swipe.to);
        if(found !== -1) {
          profiles.splice(found, 1)
        }
      })

      const swipedRightFromMeSnapshot = await getDocs(swipedRightFromMeQuery);
      swipedRightFromMeSnapshot.forEach((doc) => {
        const swipe = doc.data();
        const found = profiles.findIndex(user => user.userId === swipe.to);
        if(found !== -1) {
          profiles.splice(found, 1)
        }
      })
    }

    this.setState({
      user: user,
      users: profiles,
      unfiltered: profiles,
      userProfile: userProfile,
      currentFilters: {course: "everyone", yearOfStudy: "any", age: { minAge: 18, maxAge: 50 }}
    });

    onSnapshot(swipedLeftFromMeQuery, (querySnapshot) => {
      const swipedLeftFromMe = [];
      querySnapshot.forEach((doc) => {
        swipedLeftFromMe.push(doc.data());
      });
      this.setState({swipedLeftFromMe: swipedLeftFromMe});
    });

    onSnapshot(swipedLeftToMeQuery, (querySnapshot) => {
      const swipedLeftToMe = [];
      querySnapshot.forEach((doc) => {
        swipedLeftToMe.push(doc.data());
      });
      this.setState({swipedLeftToMe: swipedLeftToMe});
    });

    onSnapshot(swipedRightToMeQuery, (querySnapshot) => {
      const swipedRightToMe = [];
      querySnapshot.forEach((doc) => {
        swipedRightToMe.push(doc.data());
      });
      this.setState({swipedRightToMe: this.state.swipedRightToMe.concat(swipedRightToMe)});
    });

    onSnapshot(swipedRightFromMeQuery, (querySnapshot, ) => {
      const swipedRightFromMe = [];
      querySnapshot.forEach((doc) => {
        swipedRightFromMe.push(doc.data());
      });
      this.setState({swipedRightFromMe: swipedRightFromMe});
    });

    // Remove all people who I swiped left for
    this.state.swipedLeftFromMe.forEach(swipe => {
      const found = profiles.findIndex(user => user.userId === swipe.toId);
      if(found !== -1) {
        profiles.splice(found, 1)
      }
    });

    // Remove all people who I swiped right for
    this.state.swipedRightFromMe.forEach(swipe => {
      const found = profiles.findIndex(user => user.userId === swipe.toId);
      if(found !== -1) {
        profiles.splice(found, 1)
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  nth = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  applyFilters() {
    let subset = this.state.unfiltered;
    const filters = this.state.currentFilters;
    const userProfile = this.state.userProfile;

    // Filter course
    if(filters.course === "me") {
      subset = subset.filter(profile => profile.course === userProfile.course);
    }

    // Filter age
    const minAge = filters.age.minAge;
    const maxAge = filters.age.maxAge;
    subset =  subset
      .filter(profile =>  DateTimeUtils.getAge(profile.dob) <= maxAge)
      .filter(profile =>  DateTimeUtils.getAge(profile.dob) >= minAge);


    // Filter year group
    if(filters.yearOfStudy !== "any") {
      subset =  subset.filter(profile => profile.yearOfStudy === userProfile.yearOfStudy);
    }

    this.setState({
      users: subset
    })

  }

  addFilter(filterName, filterValue) {
    let currentFilters = this.state.currentFilters;
    currentFilters[filterName] = filterValue;
    this.setState({
      currentFilters: currentFilters
    });
    console.log(currentFilters);
    this.applyFilters();
  }

  renderSwipedAll = () => {

    if(this.state.users === [] || this.state.users.length === 0) {
      return <View style={style.swipedAll}>
        <Avatar
          borderColor="cyan.500"
          size={64}
          source={
            require("../../../assets/images/no_text_logo.jpg")
          }
        />
        <Box size={15} />
        <Heading textAlign={"center"} color={"#6f61e8"}>
          You've seen all potential matches.
        </Heading>
      </View>
    }

    return <View style={style.swipedAll}>
      <Avatar
        borderColor="cyan.500"
        size={64}
        source={
          require("../../../assets/images/no_text_logo.jpg")
        }
      />
      <Box size={15} />
      <Heading textAlign={"center"} color={"#6f61e8"}>
        You've seen all potential matches.
      </Heading>
    </View>
  }

  onSwipedLeft = async () => {
    const toId = this.state.users[this.state.cardIndex].userId;
    this.setState({
      cardIndex: this.state.cardIndex  + 1
    });
    const userSwipe = new UserSwipe(this.state.user.id, toId, "left", new Date().toISOString());

    const swipeId = this.state.user.id + "_" + toId;

    await setDoc(doc(this.props.firebaseDb, "swipes", swipeId), {
      from: this.state.user.id,
      to: toId,
      swipeAction: "left",
      dateTime: new Date().toISOString()
    });

    const swipedLeftFromMe = this.state.swipedLeftFromMe;
    swipedLeftFromMe.push(userSwipe);
    this.setState({
      swipedLeftFromMe: swipedLeftFromMe
    });
  }

  onSwipedRight = async () => {
    const otherUser = this.state.users[this.state.cardIndex];
    const toId = otherUser.userId;
    this.setState({
      cardIndex: this.state.cardIndex  + 1
    });
    const userSwipe = new UserSwipe(this.state.user.id, toId, "right", new Date().toISOString());

    const swipedRightFromMe = this.state.swipedRightFromMe;
    swipedRightFromMe.push(userSwipe);
    this.setState({
      swipedRightFromMe: swipedRightFromMe
    });

    const swipeId = this.state.user.id + "_" + toId;

    await setDoc(doc(this.props.firebaseDb, "swipes", swipeId), {
      from: this.state.user.id,
      to: toId,
      swipeAction: "right",
      dateTime: new Date().toISOString()
    });
    // Check if user swiped right for me
    if(this.state.swipedRightToMe.find(swipe => swipe.from === toId)) {
      // Match found!
      this.props.navigation.navigate("MatchedPage", {user: this.state.userProfile, other: otherUser})
    }
  }

  renderHeader = () => {
    return(
      <LinearGradient colors={["#6f61e8", "#6f61e8"]}>
        <View >
          <View style={styles.top}>
            <University university={this.state?.userProfile?.university}/>
            <Heading style={{color: "white"}}>Discover</Heading>
            <Filters onPress={() => this.setState({isModalVisible: !this.state.isModalVisible})}/>
          </View>
        </View>
      </LinearGradient>
    )
  }

  renderCards = () => {

    const cards = this.state?.users.map((item, index) => {
      return {
        key: index,
        id: index,
        userId: item.userId,
        name: `${item?.user?.firstName} ${item?.user?.lastName}, ${DateTimeUtils.getAge(item.dob)}`,
        status: 'Online',
        match: '90',
        description: `${item?.course}, ${item?.yearOfStudy}${DateTimeUtils.nth(item?.yearOfStudy)} year`,
        image: item.profilePicture || IMAGE_UNAVAILABLE,
        aboutMe: item?.aboutMe,
        likes: item?.likes
      }
    });

    if(this.state.isLoading) {
      return (
        <View
          style={{...styles.bg, backgroundColor: "#f7f7fc"}}
        >
          <View style={styles.containerHome}>
            <Box h={5} />
            <Box h={1}/>
            <View style={style.swipedAll}>
              <Avatar
                borderColor="cyan.500"
                size={64}
                source={
                  require("../../../assets/images/no_text_logo.jpg")
                }
              />
              <Box size={15} />
              <Spinner colorScheme={"purple"} color={"purple"} />
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View
          style={{...styles.bg, backgroundColor: "#f7f7fc"}}
        >
          <View style={styles.containerHome}>
            <Box h={5} />
            <Box h={1}/>
            <CardStack
              renderNoMoreCards={() => this.renderSwipedAll()}
              ref={swiper => (this.swiper = swiper)}
              onSwipedLeft={() => this.onSwipedLeft()}
              onSwipedRight={() => this.onSwipedRight()}
            >
              {(cards || []).map((item, index) => {
                return <View style={style.container}>
                  <CardFlip
                    style={style.cardContainer}
                    ref={ (card) => this['card' + index] = card }
                    key={index}
                  >

                    <TouchableOpacity
                      onPress={() => this['card' + index].flip()}
                      activeOpacity={1}
                      key={index}
                    >
                      {/*Front of card */}
                      <CardItem
                        key={index}
                        image={item.image}
                        name={item.name}
                        description={item.description}
                        actions
                        onPressLeft={() => this.swiper.swipeLeft}
                        onPressRight={() => this.swiper.swipeRight}
                        onSwipweUp={() => {this['card' + index].flip()}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this['card' + index].flip()}
                      activeOpacity={1}
                      key={index}
                    >
                      {/*Back of card */}
                      <BackCardItem
                        name={"BACK"}
                        aboutMe={item.aboutMe}
                        likes={item.likes || []}
                        actions
                        onPressLeft={() => this.swiper.swipeLeft()}
                        onPressRight={() => this.swiper.swipeRight()}
                        key={index}
                      />
                    </TouchableOpacity>
                  </CardFlip>
                </View> }
              )}
            </CardStack>
          </View>
        </View>
      );
    }
  };

  renderModal = () => {
    return (
      <Modal isOpen={this.state.isModalVisible} onClose={() => this.setState({isModalVisible: false})}>
        <Modal.Content minWidth="350px" p="10">
          <Modal.CloseButton />
          <Modal.Header>Filters</Modal.Header>
          <Modal.Body>
            <FormControl mt="5">
              <FormControl.Label>Course</FormControl.Label>
              <Radio.Group
                name="universityRadioGroup"
                accessibilityLabel="favorite number"
                value={this.state.currentFilters.course}
                onChange={(e) => this.addFilter("course", e)}
                colorScheme={"purple"}
              >
                <Radio value="me" size="sm">Only show people in my course</Radio>
                <Radio value="everyone" size="sm">Everyone</Radio>
              </Radio.Group>
            </FormControl>
            <FormControl mt="5">
              <FormControl.Label>Year of Study</FormControl.Label>
                  <Radio.Group
                    value={this.state.currentFilters.yearOfStudy}
                    accessibilityLabel="pick a year group"
                    onChange={e => {this.setState({yearOfStudy: e}); this.addFilter("yearOfStudy", e)}}
                    name={"yearOfStudy"}
                  >
                    <HStack space={4}>
                      <Radio value="me" colorScheme="purple" size="sm" my={1}>
                        Only my year of study
                      </Radio>
                      <Radio value="any" colorScheme="purple" size="sm" my={1}>
                        Any
                      </Radio>
                      </HStack>
                  </Radio.Group>
            </FormControl>
            <FormControl mt="5">
              <FormControl.Label>Min. Age</FormControl.Label>
              <HStack space={6}>
                <Slider
                  w="3/4"
                  maxW="300"
                  defaultValue={this.state.currentFilters.age.minAge}
                  minValue={18}
                  maxValue={50}
                  step={1}
                  colorScheme={"purple"}
                  onChange={value => {
                    let currentFilters = this.state.currentFilters;
                    currentFilters.age.minAge = value;
                    this.setState({
                      currentFilters: currentFilters
                    })
                  }}
                  onChangeEnd={value => {
                    this.addFilter("age", {minAge: value, maxAge: this.state.currentFilters.age.maxAge})}}
                >
                  <Slider.Track>
                    <Slider.FilledTrack />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider>
                <Text>{this.state.currentFilters.age.minAge}</Text>
              </HStack>
            </FormControl>
            <FormControl mt="5">
              <FormControl.Label>Max. Age</FormControl.Label>
              <HStack space={6}>
                <Slider
                  w="3/4"
                  maxW="300"
                  defaultValue={this.state.currentFilters.age.maxAge}
                  minValue={18}
                  maxValue={50}
                  step={1}
                  colorScheme={"purple"}
                  onChange={value => {
                    let currentFilters = this.state.currentFilters;
                    currentFilters.age.maxAge = value;
                    this.setState({
                      currentFilters: currentFilters
                    })
                  }}
                  onChangeEnd={value => {
                    this.addFilter("age", {maxAge: value, minAge: this.state.currentFilters.age.minAge})}}
                >
                  <Slider.Track>
                    <Slider.FilledTrack />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider>
                <Text>{this.state.currentFilters.age.maxAge}</Text>
              </HStack>
            </FormControl>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    )
  }

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    })
  };

  render() {

    if(this.state.users) {

      if(this.state.swipedAllCards) {
        return <Box style={{height: "100%", backgroundColor: "#f7f7fc"}}>
          {this.renderSwipedAll()}
          <BottomNavigation
            selectedPage={"home"}
            navigation={this.props.navigation}
            backgroundColor={'rgba(52, 52, 52, alpha)'}
          />
        </Box>
      }
      return <Box style={{height: "100%", backgroundColor: "#f7f7fc"}}>
        {this.renderHeader()}
        {this.renderCards()}
        {this.renderModal()}
        <BottomNavigation
          selectedPage={"home"}
          navigation={this.props.navigation}
          backgroundColor={'rgba(52, 52, 52, alpha)'}
        />
      </Box>
    } else {
      return <SafeAreaView>
        <Center>
          <Spinner size="lg" />
        </Center>
      </SafeAreaView>
    }
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: DIMENSION_WIDTH - 18,
    height: DIMENSION_HEIGHT + 10,
  },
  swipedAll: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: DIMENSION_WIDTH / 10,
    marginVertical: DIMENSION_HEIGHT / 10
  }
});

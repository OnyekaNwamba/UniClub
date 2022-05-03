import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  Box,
  Text,
  Button,
  VStack,
  Heading,
  FormControl,
  Input,
  Icon,
  Link,
  Modal, Spinner,
} from 'native-base';
import { EmailIcon, LockIcon, OrIconDivider, UserIcon } from "../../../commons/Icons";
import { v4 as uuid } from "uuid";
import { User } from "../../../models/User";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

export class SignUpPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      isModalVisible: false,
      modalText: "Email already in use!",
      isLoadingModalVisible: false
    };
  }

  async componentDidMount() {
    const loggedIn = await this.props.authenticator.isLoggedIn();
    if(loggedIn) {
      this.props.navigation.navigate("ExplorePage");
    }
  }

  createAccountButtonChangeHandler = async () => {

    const id = uuid();
    const isEmpty = Object.values(this.state).some(x => x === '');
    if(isEmpty) {
      this.setState({
        isModalVisible: true,
        modalText: "Complete all fields to continue"
      })
    } else {

      this.setState({
        isLoadingModalVisible: true
      });

      // Hash password for security
      const password = Base64.stringify(sha256(this.state.password));

      // Create account
      const user = new User(id, this.state.firstName, this.state.lastName, this.state.email, password);

      const userResponse = await this.props.api.getUser(this.state.email);
      if(!userResponse.isError) {
        this.state.setState({
          isModalVisible: true
        });
      } else {
        this.setState({
          isLoadingModalVisible: false
        });
        this.props.navigation.navigate("CompleteProfilePage", {user: user});
      }
    }
  }

  encryptPassword = async (password) => {
    const encoder = new TextEncoder();
    const encoded = await encoder.encode(password);
    return crypto.subtle.digest('SHA-256', encoded);
  }

  render() {
    return (
      <Box style={{width: "100%", height: "100%"}} bg="#6f61e8">
        <Box style={styles.heading}>
          <Heading size="2xl" m={4} color={"white"} textAlign={"center"}>Create a new account</Heading>
          <Text fontSize={'lg'} color={"white"}> to make new campus friends ✌️</Text>
        </Box>
        <Box style={styles.form}>
          <Modal
            isOpen={this.state.isLoadingModalVisible}
            onClose={() => this.setState({isLoadingModalVisible: false})}
            size="lg"
          >
            <Modal.Content maxWidth="400px">
              <Modal.Header>Social App</Modal.Header>
              <Modal.Body>
                <Spinner size={"lg"} colorScheme={"purple"} color={"purple"} />
              </Modal.Body>
            </Modal.Content>
          </Modal>
          <VStack space={4} m={5} mt={0}>
            <Box />
            <FormControl>
              <Input
                placeholder="First Name"
                onChangeText={(e) => this.setState({firstName: e})}
                w={"90%"}
                borderRadius={14}
                borderColor={"#f7f8f8"}
                bg={"#f7f8f8"}
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
            <FormControl isRequired>
              <Input
                onChangeText={(e) => this.setState({lastName: e})}
                placeholder="Last Name"
                w={"90%"}
                borderRadius={14}
                borderColor={"#f7f8f8"}
                bg={"#f7f8f8"}
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
            <FormControl isRequired>
              <Input
                onChangeText={(e) => this.setState({email: e})}
                placeholder="Email"
                w={"90%"}
                borderRadius={14}
                borderColor={"#f7f8f8"}
                bg={"#f7f8f8"}
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
            <FormControl isRequired>
              <Input
                onChangeText={(e) => this.setState({password: e})}
                placeholder="Password"
                type={"password"}
                w={"90%"}
                borderRadius={14}
                borderColor={"#f7f8f8"}
                bg={"#f7f8f8"}
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
            <FormControl isRequired>
              <Input
                type={"password"}
                placeholder="Confirm Password"
                w={"90%"}
                borderRadius={14}
                borderColor={"#f7f8f8"}
                bg={"#f7f8f8"}
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
          </VStack>
        </Box>
        <Button
          style={styles.createAccountButton}
          w={"80%"}
          borderRadius={14}
          borderWidth={3}
          variant="outline"
          borderColor={"#ffffff"}
          size="lg"
          p={3}
          ml={10}
          mt={4}
          colorScheme={"#ffffff"}
          color={"#ffffff"}
          onPress={() => this.createAccountButtonChangeHandler()}
        >
          <Text isExternal color={"white"} bold>
            Create account
          </Text>
        </Button>
        <Modal isOpen={this.state.isModalVisible} onClose={() => this.setState({isModalVisible: false})} size="lg">
          <Modal.Content maxWidth="400px">
            <Modal.Header>Social App</Modal.Header>
            <Modal.Body>
              {this.state.modalText}
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <VStack space={5} style={styles.or} mb={10}>
          <OrIconDivider color={"white"}/>
          <Text isExternal color={"white"}>
            Already have an account? { " " }
            <Link  colorScheme={"white"} _text={{
              color: "white"
            }} isExternal onPress={() => this.props.navigation.navigate("LogInPage")}>Login</Link>
          </Text>
        </VStack>
      </Box>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    flex: 0.9,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },

  form: {
    justifyContent: "center",
    alignItems: "center",
  },

  createAccountButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  or: {
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
  }
})

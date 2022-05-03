import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Text,
  Button,
  VStack,
  Heading,
  FormControl,
  Input,
  Icon,
  Link, Modal, Spinner,
} from 'native-base';
import { EmailIcon, LockIcon, OrIconDivider } from "../../../commons/Icons";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

export class LoginPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isModalVisible: false,
      modalBody: "Please complete all fields",
      isLoading: false
    };
  }

  async componentDidMount() {
    const loggedIn = await this.props.authenticator.isLoggedIn();
    if(loggedIn) {
      this.props.navigation.navigate("ExplorePage");
    }
  }

  loginButtonChangeHandler = async () => {

    const isEmpty = Object.values(this.state).some(x => x === '');
    if(isEmpty) {
      this.setState({
        isModalVisible: true
      });
    } else {
      this.setState({
        isModalVisible: true,
        modalBody: <Spinner size={"sm"} colorScheme={"purple"} color={"purple"} />
      });
      const response = await this.props.api.getUser(this.state.email);
      if(!response.isError) {
        this.setState({
          isModalVisible: false,
        });
        const user = response.success;
        const hashedPassword = Base64.stringify(sha256(this.state.password)).replaceAll(" ", "+");
        console.log(hashedPassword)
        const dbPassword = user.password.replaceAll(" ", "+");
        if(hashedPassword === dbPassword) {
          await this.props.authenticator.authenticate(user);
        } else {
          this.setState({
            isModalVisible: true,
            modalBody: "Incorrect username or password!"
          });
        }

        await this.props.authenticator.logIn(user);
        const isLoggedIn = await this.props.authenticator.isLoggedIn();
        if(isLoggedIn) {
          this.props.navigation.navigate("ExplorePage");
        }

      } else {
        this.setState({
          isModalVisible: true,
          modalBody: "Unable to find user"
        });
        console.log(response.error);
      }
    }
  }


  render() {
    return ( <Box style={{width: "100%", height: "100%"}} bg="#f7f7fc">
        <Modal isOpen={this.state.isModalVisible} onClose={() => this.setState({isModalVisible: false})} size="lg">
          <Modal.Content maxWidth="400px">
            <Modal.Header>Social App</Modal.Header>
            <Modal.Body>
              {this.state.modalBody}
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Box style={styles.heading}>
          <Heading size="2xl" m={4} color={"#6f61e8"}>Welcome Back!</Heading>
          <Text fontSize={'lg'} color={"#6f61e8"}> Login to make new campus besties 💜 </Text>
        </Box>
        <Box style={styles.form}>
          <VStack space={4} m={5} mt={0}>
            <Box />
            <FormControl>
              <Input
                onChangeText={(e) => this.setState({email: e})}
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
            <FormControl>
              <Input
                onChangeText={(e) => this.setState({password: e})}
                placeholder="Password"
                type={"password"}
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
          </VStack>
        </Box>
      <Button
          style={styles.loginButton}
          w={"80%"}
          borderRadius={14}
          size="lg"
          p={3}
          ml={10}
          mt={4}
          onPress={() => this.loginButtonChangeHandler()}
        >
          Login
        </Button>
        <VStack space={5} style={styles.or}>
          <OrIconDivider />
          <Text isExternal _text={{color: "#6f61e8"}} styles={{color: "#6f61e8"}}>
            Don't have an account yet? { " " }
            <Link onPress={() => this.props.navigation.navigate("SignUpPage")}>Sign up</Link>
          </Text>
        </VStack>
      </Box>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    flex: 0.5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    justifyContent: "center",
    alignItems: "center",
  },

  loginButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6f61e8",
  },

  or: {
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
  }
})

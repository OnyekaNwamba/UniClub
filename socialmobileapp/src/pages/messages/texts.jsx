import { useActionSheet } from '@expo/react-native-action-sheet'
import { Chat } from '@flyerhq/react-native-chat-ui'
import React, { useEffect, useState } from 'react'
import DocumentPicker from 'react-native-document-picker'
import FileViewer from 'react-native-file-viewer'
import { launchImageLibrary } from 'react-native-image-picker'
import { v4 as uuidv4 } from 'uuid'
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Center, Heading } from "native-base";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { DARK_GRAY, DIMENSION_WIDTH } from "../../assets/styles";
import { doc, onSnapshot, getDoc, updateDoc, setDoc } from 'firebase/firestore';


const TextsPage = ({props}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const [messages, setMessages] = useState([]);
  const [me, setMe] = useState({});
  const [otherUser, setOtherUser] = useState({});

  useEffect(() => {

    getMe();
    getOtherUser();

    console.log(props.api);
    console.log(props.route.params);

    getFirebaseDoc();
    onSnapshot(doc(props.firebaseDb, "chats", props.route.params.chatId), (doc) => {
      setMessages(doc.data().messages.reverse());
    });
  }, []);

  const getMe = async () => {
    const response = await props.authenticator.database.get("user");
    const userMe = {
      id: response.data.id,
      name: `${response.data.firstName} ${response.data.lastName}`,
      image: {uri: ""}
    }
    setMe(userMe)
  };

  const getOtherUser = async () => {
    const response = await props.api.getUserById(props.route.params.otherUser);
    let otherUser = {
      name: "Loading..."
    };
    if(!response.isError) {
      const user = response.success;
      otherUser = {
        id: props.route.params.other,
        name: `${user.firstName} ${user.lastName}`
      }
    }
    setOtherUser(otherUser);
  };

  const getFirebaseDoc = async () => {
    const docRef = doc(props.firebaseDb, "chats", props.route.params.chatId);
    const docSnap = await getDoc(docRef);
    if(!docSnap.exists()) {
      setDoc(docRef, {
        messages: [],
        user1: props.route.params.user.id,
        user2: props.route.params.user.other.id
      })
    }
  };

  const addMessage = (message) => {
    setMessages([message, ...messages])
  }

  const handleAttachmentPress = () => {
    showActionSheetWithOptions(
      {
        options: ['Photo', 'File', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            handleImageSelection()
            break
          case 1:
            handleFileSelection()
            break
        }
      }
    )
  }

  const handleFileSelection = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      })
      const fileMessage = {
        author: user,
        createdAt: Date.now(),
        id: uuidv4(),
        mimeType: response.type ?? undefined,
        name: response.name,
        size: response.size ?? 0,
        type: 'file',
        uri: response.uri,
      }
      addMessage(fileMessage)
    } catch {}
  }

  const handleImageSelection = () => {
    launchImageLibrary(
      {
        includeBase64: true,
        maxWidth: 1440,
        mediaType: 'photo',
        quality: 0.7,
      },
      ({ assets }) => {
        const response = assets?.[0]

        if (response?.base64) {
          const imageMessage = {
            author: user,
            createdAt: Date.now(),
            height: response.height,
            id: uuidv4(),
            name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
            size: response.fileSize ?? 0,
            type: 'image',
            uri: `data:image/*;base64,${response.base64}`,
            width: response.width,
          }
          addMessage(imageMessage)
        }
      }
    )
  }

  const handleMessagePress = async (message) => {
    if (message.type === 'file') {
      try {
        await FileViewer.open(message.uri, { showOpenWithDialog: true })
      } catch {}
    }
  }

  const handlePreviewDataFetched = ({ message, previewData}) => {
    setMessages(
      messages.map((m) =>
          m.id === message.id ? { ...m, previewData } : m
      )
    )
  }

  const handleSendPress = async (message) => {
    const textMessage = {
      author: me,
      createdAt: Date.now(),
      text: message.text,
      type: 'text',
    };

    const docRef = doc(props.firebaseDb, "chats", props.route.params.chatId);
    const docSnap = await getDoc(docRef);

    let _messages = [];
    if (docSnap.exists()) {
      _messages = docSnap.data().messages || [];
    } else {
      console.log("No such document!");
    }
    _messages.push(textMessage);

    const updated = new Array(messages);
    updated.push(textMessage);

    try {
      await updateDoc(docRef, {
        messages: _messages
      });
    } catch (e) {
    }

    addMessage(textMessage)
  }

  return (
    <View style={styles.containerMessages}>
      <View style={styles.top}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
        <Center>
          <Heading style={styles.title}>{otherUser.name}</Heading>
        </Center>
      </View>
      <Chat
        messages={messages}
        onAttachmentPress={handleAttachmentPress}
        onMessagePress={handleMessagePress}
        onPreviewDataFetched={handlePreviewDataFetched}
        onSendPress={handleSendPress}
        user={me}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  containerMessages: {
    flex: 1,
  },
  top: {
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white"
  },
  title: {
    paddingBottom: 10,
    fontSize: 22,
    color: DARK_GRAY,
    marginLeft: DIMENSION_WIDTH / 10,
    marginRight: DIMENSION_WIDTH / 3
  },
  backButton: {
    paddingLeft: 40,
  },
})


export default TextsPage

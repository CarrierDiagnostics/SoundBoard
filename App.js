import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import React, { useState, useCallback, useEffect, memo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import Login from "./login.js"
import styles from "./styles.js"

export default function App() {
  const [socketUrl, setSocketUrl] = useState('wss://carriertech.uk:8008/');

  const [previousScreen, compareScreens] = React.useState("");
  const [currentScreen, onScreenChange] = React.useState("LogIn");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  
  /*const {
    getWebSocket,
    status,
    send,
    close,
  } = useWebSocket(socketUrl);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (getWebSocket()) {
      getWebSocket().onmessage = (event) => {
        alert("got message");
        let tmessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, tmessage]);
      };
    }
  }, [getWebSocket]);
  */

  function screenHandler(){

    onScreenChange("LogIn");
    alert(currentScreen);
    return <Screen/>
  }
  return (
    <View style={styles.container}>
      <Text display="none">{currentScreen}</Text>
      <Login sendMessage={sendMessage}/>
      <Text>{readyState} = {connectionStatus}</Text>
      <Text>{lastMessage ? JSON.parse(lastMessage.data)["result"]: null}</Text>
       
  
      <StatusBar style="auto" />
    </View>
  );
}



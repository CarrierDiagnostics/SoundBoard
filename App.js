import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import React, { useState, useCallback, useEffect, memo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import Login from "./login.js"
import styles from "./styles.js"
import MainPage from "./mainPage.js"
export default function App() {
  const [socketUrl, setSocketUrl] = useState('wss://carriertech.uk:8008/');

  const [viewLogin, setLogin] = useState(true);
  const [viewSignup, setSignup] = useState(false);
  const [viewMainPage, setMainPage] = useState(false);
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
  useEffect(() => {
    screenHandler(lastMessage);
  },[lastMessage]);


  function screenHandler(lastMessage){
    if(lastMessage){
      let e = JSON.parse(lastMessage.data)["result"]
      if (e == "build webage"){
        setSignup(false);
        setMainPage(true);
        setLogin(false);
      }
    }
  }
  return (
    <View style={styles.container}>
      <Text display="none">{currentScreen}</Text>
      <Login sendMessage={sendMessage} display={viewLogin}/>
      <Text>{readyState} = {connectionStatus}</Text>
      <Text>{lastMessage ? JSON.parse(lastMessage.data)["result"]: null}</Text>
      <MainPage display={viewMainPage}/>
  
      <StatusBar style="auto" />
    </View>
  );
}



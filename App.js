import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView } from 'react-native';
import React, { useState, useCallback, useEffect, memo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import Login from "./login.js"
import styles from "./styles.js"
import MainPage from "./mainPage.js"

export default function App() {
  const [socketUrl, setSocketUrl] = useState('wss://carriertech.uk:8008/');
  var tempToken = null;
  const [viewLogin, setLogin] = useState(true);
  const [viewSignup, setSignup] = useState(false);
  const [viewMainPage, setMainPage] = useState(false);
  const [previousScreen, compareScreens] = React.useState("");
  const [currentScreen, onScreenChange] = React.useState("LogIn");
  const [userData, setUserData] = React.useState(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const temp = {"test":"test"};
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

  function cleanUserData(userData){
    let temp = {}
    for (let [k,v] of Object.entries(userData.data)){
      k = k.split(")")[1].split("_");
      k = k[4]+"-"+k[2]+"-"+k[1];
      temp[k] = v;
    }
    setUserData(temp);
  }
  function screenHandler(lastMessage){
    if(lastMessage){
 
      let e = JSON.parse(lastMessage.data);
      if (e.result == "build webage" && viewMainPage!=true){
        console.log(e["tempToken"]);
        save("tempToken", e["tempToken"]);
        cleanUserData(e.data);
        setSignup(false);
        setMainPage(true);
        setLogin(false);
      }
    }
  }
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  return (
    
    <View style={styles.container}>
      
      <Login sendMessage={sendMessage} display={viewLogin}/>
      <Text>{readyState} = {connectionStatus}</Text>
      <MainPage display={viewMainPage} sendMessage={sendMessage} userData ={userData}  lastMessage={lastMessage ? JSON.parse(lastMessage.data):null}/>
      <StatusBar style="auto" />
    </View>
  );
}



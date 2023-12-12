import {Text, View, ScrollView, Button,Pressable, Image} from "react-native"
import React, { useState } from 'react';
import styles from "./styles.js"
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import { Date } from 'expo';
import * as SecureStore from 'expo-secure-store';


function MainPage({display, sendMessage, lastMessage}){
    
    const recImage = require('./assets/rec.png');
    const recStop = require('./assets/stoprec.png');
    const [recButton, changeRecState] = React.useState(recImage)
    const [recording, setRecording] = React.useState();
    //var tempToken = null;

    /*if (lastMessage && lastMessage.hasOwnProperty("result") && !tempToken && lastMessage.result=="build webage"){
        console.log(lastMessage["tempToken"]);
        tempToken = lastMessage["tempToken"];
        console.log("tempToken set=", tempToken);
      }*/

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result) {
          alert("🔐 Here's your value 🔐 \n" + result);
        } else {
          alert('No values stored under that key.');
        }
      }
    function record(){
        if(recButton == recImage){
            changeRecState(recStop);
            startRecording();
        }else{
            changeRecState(recImage);
            stopRecording();
        }
    }

    async function startRecording() {
        try {
          await Audio.requestPermissionsAsync();
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
    
          const { recording } = await Audio.Recording.createAsync( 
            Audio.RecordingOptionsPresets.HIGH_QUALITY
          );
          setRecording(recording);
        } catch (err) {
          console.error('Failed to start recording', err);
        }
      }
    
      async function stopRecording() {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
          {
            allowsRecordingIOS: false,
          }
        );
        const uri = recording.getURI();
        let tempToken = await SecureStore.getItemAsync("tempToken");
        let toSend = {"userID":tempToken,
                      "browser":"app",
                      "action":"processVoice"}
        sendMessage(JSON.stringify(toSend));
        let fileOptions = {encoding: FileSystem.EncodingType.Base64};
        let theFile = await FileSystem.readAsStringAsync(uri, fileOptions );
        sendMessage(theFile);
        
        console.log('Recording stopped and stored at', uri);
      }
      
    if (display){
    return(   
        <View style={styles.container}>
            <View style={styles.MainPage}>
                <View id="TextArea" style={styles.textArea}>
                    <Text>Last Message was</Text>
                    <Text>{JSON.stringify(lastMessage)}</Text>
                </View>
                <View id="ButtonArea" style={styles.buttonArea}>
                    <Pressable onPress={record} >
                    <Image style={styles.recImage} source={recButton} resizeMode="contain" />
                    </Pressable>
                </View>
            </View>
            <View style={styles.footer}>
                <Button title="Calendar" style={styles.footerButton}/>
                <Button title="Main" style={styles.footerButton}/>
                <Button title="Organise" style={styles.footerButton}/>
                <Button title="Analysis" style={styles.footerButton}/>
                <Button title="Settings" style={styles.footerButton}/>
            </View>
        </View>
           
       
        );
    }else{
        return
    }
}
export default MainPage
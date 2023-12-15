import {Text, View, ScrollView, Button,Pressable, Image, FlatList} from "react-native"
import React, { useState } from 'react';
import styles from "./styles.js"
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import { Date } from 'expo';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from "react";
import { Calendar } from 'react-native-calendars';


function MainPage({display, sendMessage, userData, lastMessage}){
    //userData for calendar and rants
    const recImage = require('./assets/rec.png');
    const recStop = require('./assets/stoprec.png');
    const [recButton, changeRecState] = React.useState(recImage)
    const [recording, setRecording] = React.useState();
    const [currentSession, handleSession] = React.useState([]);
    const [viewScreen, setViewScreen] = React.useState({
      "interactPage":true,
      "calendar":false,
      "organise":false,
      "analysis":false,
      "settings":false
    })
    const [viewCalendar, setCalendar] = React.useState(false);
    const [viewInteractPage, setInteractPage] = React.useState(false);
    const [viewOrganise, setOrganise] = React.useState(false);
    const [viewAnalysis, setAnalysis] = React.useState(false);
    const [viewSettings, setSettings] = React.useState(false);
    useEffect(()=> {
        if (lastMessage && lastMessage.hasOwnProperty("result") && lastMessage.result == "add text"){
            handleSession(prev => [...prev,lastMessage]);
        }
    },[lastMessage]);
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

    function MainText(){
        var mainText = [];
        currentSession.forEach(function (x, i){
            let t = x.data.textBox.replace(/<br>/g,'');
            mainText.push(<Text key={i}>{t}</Text>);
        })
        console.log(mainText);
        return <View>{mainText}</View>;
    }
    function InteractPage(){
        
      if (viewScreen.interactPage){
        return (
          <View style={styles.MainPage}>
          <View id="TextArea" style={styles.textArea}>
              <Text>Stuff should be addedd lower to this</Text>
              <MainText/>
              <Text>Last Message was</Text>
              <Text>{JSON.stringify(lastMessage)}</Text>
          </View>
          <View id="ButtonArea" style={styles.buttonArea}>
              <Pressable onPress={record} >
              <Image style={styles.recImage} source={recButton} resizeMode="contain" />
              </Pressable>
          </View>
      </View>
        )
      }
    }

    function CalendarPage(){
      if (viewScreen.calendar) return(<View style={styles.CalendarPage}><Calendar 
        markedDates={{
            '2023-12-01': {selected: true,  selectedColor: 'red'},
            '2023-12-02': {marked: true},
            '2023-12-03': {selected: true, selectedColor: 'blue'}
          }}  /></View>)
    }
    function changeScreen(e){
        let tempO = {};
        for (let [k,v] of Object.entries(viewScreen)){
            if (k==e) {
                tempO[k]=true;
            }else{ tempO[k]=false;}
        }
        setViewScreen(tempO);
        
    }
    if (display){
    return(   
        <View style={styles.container}>
            <InteractPage />
            <CalendarPage />
            <View style={styles.footer}>
                <Button id='calendar' title="Calendar" 
                    style={styles.footerButton}
                    onPress={()=>changeScreen('calendar')}/>
                <Button title="Main" 
                    style={styles.footerButton} 
                    onPress={()=>changeScreen('interactPage')}/>
                <Button title="Organise" 
                    style={styles.footerButton} 
                    onPress={()=>changeScreen('organise')}/>
                <Button title="Analysis" style={styles.footerButton} onPress={()=>changeScreen('analysis')}/>
                <Button title="Settings" style={styles.footerButton} onPress={()=>changeScreen('settings')}/>
            </View>
        </View>
           
       
        );
    }else{
        return
    }
}
export default MainPage
import {Text, View, ScrollView, FlatList, Button,Pressable, Image, SectionList} from "react-native"
import React, { useState, useRef, useCallback } from 'react';
import styles from "./styles.js"
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import { Date } from 'expo';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from "react";
import { Calendar } from 'react-native-calendars';
import DateObject from "react-date-object";
import { useCalendarPermissions } from "expo-calendar";
import { GiftedChat } from 'react-native-gifted-chat'
import 'react-native-get-random-values';

import { v4 as uuidv4 } from 'uuid';


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
    });

    var today = new DateObject().format("YYYY-MM-DD");
    const [dayMoods, setDayMoods] = React.useState();
    const [cYearMonth, setcYearMonth] = React.useState(today);
    const [markedDates, setMarkedDates] = React.useState(today);
    const [dialogData, setDialogData] = React.useState(null);
    const [textBoxData, setTBD] = React.useState(null)
    const [todayText, setTodayText] = React.useState([]);
    const [publishTextBoxData, setPTBD] = React.useState([]);
    const [viewCalendar, setCalendar] = React.useState(false);
    const [viewInteractPage, setInteractPage] = React.useState(false);
    const [viewOrganise, setOrganise] = React.useState(false);
    const [viewAnalysis, setAnalysis] = React.useState(false);
    const [viewSettings, setSettings] = React.useState(false);
    const emotionColours = {'neutral':{"colour": "#808080", "val":{"speechEmotion":1, "textEmotion":1}}, 
    'calm': {"colour": "#75945b", "colourRGB":[117,148,91], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'happy': {"colour": "#fff761", "colourRGB":[255,247,97],"val":{"speechEmotion":1, "textEmotion":1}}, 
    'sad' : {"colour": "#6e79ff", "colourRGB":[110,121,255],"val":{"speechEmotion":1, "textEmotion":1}}, 
    'angry' : {"colour": "#ff4313","colourRGB":[255,67,19], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'fear' : {"colour": "#ff8c2d","colourRGB":[255,140,45], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'disgust' : {"colour": "#e564df","colourRGB":[229,100,223], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'surprise' : {"colour": "#24c9ff","colourRGB":[36,201,255], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'love' : {"colour": "#f3cec9","colourRGB":[243,206,201], "val":{"speechEmotion":1, "textEmotion":1}}};
    const [organiseUserData, setUserData] = React.useState(false);
    const textBoxRef = useRef(null);
    const todayTextRef = useRef(null);
    const [STT, setSTT] = React.useState("");
    const [llmresponse, setllmresponse] = React.useState("");
    const [messages, setMessages] = useState([])
    useEffect(()=> {
        if (lastMessage && lastMessage.hasOwnProperty("result") && lastMessage.result == "add text"){
            let tdd = dialogData;
            tdd.at(-1)['data'].push(lastMessage["data"]["textBox"].replace(/<br>/g,""));
            tdd.at(-1)['data'].push(lastMessage["data"]["llmresponse"]);
            setTodayText([...todayText, lastMessage["data"]["textBox"].replace(/<br>/g,""), lastMessage["data"]["llmresponse"]])
            handleSession(prev => [...prev,lastMessage]);
            setDialogData(tdd);
            setMessages([...messages,
              MakeMsg(
                uuidv4(),
                lastMessage["data"]["textBox"].replace(/<br>/g,""),
                new DateObject().format("YYYY-MM-DDTHH:mm:ss"),
                1,
                "User"
              ),
              MakeMsg(
                uuidv4(),
                lastMessage["data"]["llmresponse"],
                new DateObject().format("YYYY-MM-DDTHH:mm:ss"),
                2,
                "AI Response"
              )])
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
        
      }
    

    const ButtonArea = React.memo(() => {
      return(
        <View id="ButtonArea" style={styles.buttonArea}>
              <Pressable onPress={record} >
              <Image style={styles.recImage} source={recButton} resizeMode="contain" />
              </Pressable>
          </View>
      )
    })

  const The_chat = React.memo(() => {
    return(
      <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{
                _id: 1,
              }}
              inverted={false}
              scrollToBottom={true}
            />
    )
  });

    const InteractPage = React.memo(() => {
      if (viewScreen.interactPage){
        return (
          <View style={styles.MainPage}>
          <View id="TextArea" style={styles.textArea}>
            <The_chat/>
            
          </View>
          <ButtonArea />
      </View>
        )
      }
    });
    
    function CalendarPage(){ 
      if (viewScreen.calendar) return(
      <View style={styles.CalendarPage}>
        <Calendar markedDates={markedDates}/>
      </View>)
    }

    function MakeMsg(tLenght,text,the_date, uID, uName){
      return({
        _id: tLenght,
        text: text,
        createdAt: the_date,
        user: {
          _id: uID,
          name: uName,
          avatar: 'https://placeimg.com/140/140/any',
        }
      })
    }

    function setEmotionData(userData){
      console.log("setEMotioNData should only be calledo nce");
      let tmarkedDates = {};  //Currently using textEmotion for emotion data, to change to prosody when ready. Also just using highest number to determine rants emotion and then median for days emotion
      let tDialogData = []; // for textBox and llmresponse
      let tSubsection = {title:null};
      let tempTextBox = []
      let msg = {}
      let tID = 0;
      for (let [k,v] of Object.entries(userData)){
            let tHighEmtion = 0;
            let tHighNum = 0;

            if (tSubsection['title']!= k){
              if(tSubsection['title']){
        
                tDialogData.push(tSubsection)}
              tSubsection = {title:k, data:[]};
            }
            tSubsection['data'].push(v['textBox'].replace(/<br>/g,''));
            tSubsection['data'].push(v['llmresponse']);
            
            tempTextBox.push(MakeMsg(uuidv4(),
                v['textBox'].replace(/<br>/g,''),
                k, 1, "User"));
            
            tempTextBox.push(MakeMsg(uuidv4(),
              v['llmresponse'],
              k, 2, "AI response"));
            for (let [ke, ve] of Object.entries(v["textEmotion"])){
              if (ve > tHighNum){
                tHighEmtion = ke;
                tHighNum = ve;
              }
            tmarkedDates[k] = {"selected": true, "selectedColor":emotionColours[tHighEmtion]["colour"]};//;
      
              
          }
        }
      tDialogData.push({title:"Today",data:[]})
      setMarkedDates(tmarkedDates);
      setDialogData(tDialogData);
      setMessages(tempTextBox);
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
    function OrganisePage(){
      if (viewScreen.organise){
        return(
          <View>
            
          </View>
      )
      }
    }

    if (display){
      if (!organiseUserData){
        setEmotionData(userData);
        setUserData(markedDates);
        console.log("I should only be called once");

      }
    return(  
        <View style={styles.container}>
            <InteractPage />
            <CalendarPage />
            <OrganisePage />
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
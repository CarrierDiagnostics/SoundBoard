import {TextInput, Text, View, Button} from "react-native";
import React from 'react';
import styles from "./styles.js"


const Login = ({sendMessage}) =>{

    const sendM = sendMessage();
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    function handleclick(email, password){
      if (email && password){
        let toSend = {"email":email,
                      "password":password,
                      "action":"LogIn"}
        sendM(JSON.stringify(toSend));
      }else{
        alert("somethiogn is null");
      }
    }
    
      return(
        <View>
          <TextInput
            style={styles.input}
            onChangeText={email => onChangeEmail(email)}
            placeholder="email"
            keyboardType="email-address"
          />
        <TextInput secureTextEntry={true} 
          style={styles.input} placeholder="password"
          onChangeText={password =>onChangePassword(password)} />
        <Button label="LogIn" 
          email={email} password={password} 
          onPress ={() => handleclick(email, password)}
          title="Press Me" >
            LogIn
          </Button>
        </View>
      );
    
  };

  export default Login
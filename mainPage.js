import {Text, View, ScrollView} from "react-native"
import styles from "./styles.js"

function MainPage({display}){
    if (display){
    return(
        
            <ScrollView horizontal={true}>
                <View style={{
                    flex:1,

                    backgroundColor: 'powderblue',
                }}>
                    <Text>Screen 1</Text>
                </View>
                <View style={{
                    height: '900px',
                    width:'800px',
                    maxWidth:1000,

                    backgroundColor: 'blue',
                }}>
                <Text>Screen 2</Text>
                </View>
                <View style={{
                    height: '900px',
                    width:'800px',
                    maxWidth:1000,
                    backgroundColor: 'red',
                }}>
                <Text>Screen 3</Text>
                </View>
            </ScrollView>
       
        );
    }else{
        return
    }
}
export default MainPage
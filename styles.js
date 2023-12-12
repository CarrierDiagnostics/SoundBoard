import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'stretch',
        justifyContent: 'center',
        },
    centre: {
        flex: 0.5,
        width:"70%",
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
        },
    input: {
        fontSize: 16,
        margin: 10,
        borderWidth: 1,
        alignItems: 'stretch',

    },
    inputViews: {
        width:"100%",
        alignItems: 'stretch',

    },
    textArea: {
        flex:8,
        borderWidth: 5,
        backgroundColor: 'white',
    },
    buttonArea: {
        flex:2,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        },
    MainPage: {
        flex:9,
        width:"100%",
        backgroundColor: 'grey',
    },
    footer: {
        flex:1,
        flexDirection:"row",
        backgroundColor: 'white',
        alignItems: 'stretch',
    },
    recImage: {
        flex:1,
    },
    footerButton: {
        flex:1,
        alignItems: 'stretch',
    }
});

export default styles;

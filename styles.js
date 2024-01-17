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
    CalendarPage: {
        flex:9,
        alignItems: "stretch",
        justifyContent:"center",
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
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
      },
      item: {
        padding: 10,
        fontSize: 18,
        height: 44,
      },
});

export default styles;

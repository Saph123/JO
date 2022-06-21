import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 20,
        margin: 10,
    },
    tablecontainer: {
        flex: 1,
        // alignSelf: "flex-start",
        margin: 30,
        width: 400,
        backgroundColor: "#EFF8FF"
    },
    listcontainer: {
        flex: 1,
        alignSelf: "flex-start",
        backgroundColor: "#EFF8FF"
    },
    matchover: {
        backgroundColor: "#D62628",
        flexDirection: 'column',
        justifyContent: "center",
        borderWidth: 1,
        alignItems: "center",
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 25,
        width: 250,
        minHeight: 130
    },
    match: {
        backgroundColor: "#A8DADC",
        flexDirection: 'column',
        justifyContent: "center",
        borderWidth: 1,
        alignItems: "center",
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 25,
        width: 250,
        minHeight: 130
    },
    matchpouleover: {
        flex: 1,
        backgroundColor: "#D62628",
        flexDirection: 'column',
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        margin: 30,
        minWidth: 200,
        borderRadius: 15
    },
    matchpoule: {
        flex: 1,
        backgroundColor: "#A8DADC",
        flexDirection: 'column',
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        margin: 30,
        minWidth: 200,
        borderRadius: 15
    },
    textmatch: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: "calibri",
        width: "100%"
    },
    teamUserIsIn: {
        textAlign: "center",
        // width: "100%",
        fontSize: 16,
        color: "black",
        fontWeight: "bold"
    },
    teamnormal: {
        textAlign: "center",
        // width: "100%",
        fontSize: 16,
        color: "black"
    },
    lose: {
        textAlign: "center",
        // width: "100%",
        color: "grey",
        textDecorationLine: "line-through",
    },
    fetching: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },

    middle: {
        flex: 0.3,
        backgroundColor: "beige",
        borderWidth: 5,
    },
    line: {
        flex: 1,
        flexDirection: "row",
        // justifyContent: "space-around",
        marginBottom: 30,

    },
    bracket: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-evenly",
        marginTop: 30,
        marginBottom: 30
    },
    column: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        margin: 30
    },
    bottom: {
        flex: 0.3,
        backgroundColor: "pink",
        borderWidth: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    bottom: {
        fontFamily: "cochin",
        // textAlign: "justify"
    },
    showPlayers: {
        borderWidth: 1,
        minWidth: 200,
        height: 30,
        marginLeft: 5,
        textAlign: "center",
        textAlignVertical: "center"
    },
    showPlayersIsIn: {
        fontWeight: "bold",
        borderWidth: 1,
        minWidth: 200,
        height: 30,
        marginLeft: 5,
        textAlign: "center",
        textAlignVertical: "center"
    },
    inputScore: {
        borderWidth: 1,
        width: 100,
        height: 30,
        textAlign: "center",
        textAlignVertical: "center"
    },
    score: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 26
        // borderColor: "black",
        // borderWidth: 1,
        // maxWidth:50
    },
    svg: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        // zIndex:0
    },
    centeredView: {
        flex: 0.5,
        maxWidth: 200,
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        margin: 20,
        maxWidth: 200,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    podium: {
        marginTop: 20,
        flex:1,
        // margin:10,
        maxWidth: 100,
        maxHeight: 300,
        // minWidth:80,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    bet: {
        margin: 20,
        flex:1,
        // margin:10,
        maxWidth: 100,
        // minWidth:80,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 2,
        borderColor:"grey",
        padding: 5,
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 10,
            height: 20
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    betScore: {
        margin: 20,
        marginRight: 60,
        flex:1,
        // margin:10,
        maxWidth: 60,
        // minWidth:80,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor:"grey",
        borderRadius: 4,
        padding: 5,
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    betScoreIsIn: {
        margin: 20,
        marginRight: 60,
        flex:1,
        // margin:10,
        maxWidth: 60,
        // minWidth:80,
        backgroundColor: "#f1f625",
        borderWidth: 2,
        borderColor:"grey",
        borderRadius: 4,
        padding: 5,
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    matchZoomView: {
        margin: 20,
        minWidth: 300,
        minHeight: 600,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    closeButton: {
        width: 23,
        height: 19,
        alignItems: "flex-end",
        alignSelf: "flex-end"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    inProgress: {
        // flex: 1,
        backgroundColor: "#ff8484",
        width: 70,
        height: 70,

        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 8,
    },
    eventDone: {
        flex: 1,
        backgroundColor: "#ADADAD",
        // width: 70,
        // height: 70,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 8,
    },
    homebuttons: {
        // flex: 1,
        backgroundColor: "#FED8B1",
        width: 70,
        height: 70,

        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        // alignItems: 'stretch',
        // justifyContent: 'center',
        // alignSelf: 'center',
        margin: 8,
    },
    loginbutton: {
        // flex: 1,
        backgroundColor: "lightgreen",
        width: 100,
        textAlign: "center",
        fontSize: 16,
        height: 50,

        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 8,
    },
    logoutbutton: {
        // flex: 1,
        backgroundColor: "lightcoral",
        width: 100,
        textAlign: "center",
        fontSize: 16,
        height: 50,

        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 8,
    },
    texthomebutton: {
        fontWeight: "bold",
        fontSize: 12,
        justifyContent: "center",
        alignSelf: "center"
    },
    sportimage: {
        width: 68,
        height: 68,
    },
    tabimage: {
        width: 40,
        height: 40,
    },
    logosah: {
        width: 108,
        height: 108,
    },
    chicken: {
        width: 158,
        height: 126,
    },
    williwaller: {
        width: 220,
        height: 110,
    },
    logomaximator: {
        width: 40,
        height: 108,
    },
    logoalstom: {
        width: 220,
        height: 68,
    },
    logogaec: {
        width: 220,
        height: 125,
    },
    medailletransparent: {
        width: 20,
        height: 30,
        flexDirection: "row",
        // backgroundColor: "lightgrey",
        tintColor: "lightgrey",
        opacity: 0.2
    },
    medailleabsent: {
        width: 20,
        height: 30,
        flexDirection: "row",
        // backgroundColor: "lightgrey",
        tintColor: "lightgrey",
        opacity: 0
    },
    medailleopaque: {
        width: 20,
        height: 30,
        flexDirection: "row",
        // backgroundColor: "lightgrey",
        tintColor: "lightgrey",
        opacity: 1
    },
    textday: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    texttime: {
        fontSize: 12,
        fontStyle: "italic",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20
    },
    textevent: {
        fontSize: 16,
        fontStyle: "italic",
        textAlign: "center",
    },
    calendar: {
        margin: 10,
        width: 200,
        backgroundColor: "#FED8B1",
        borderRadius: 15,
        height: 600,
        flexDirection: "column"
    },
    medailleNumber: {
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 5,
        marginLeft: 5,

    },
    medailleText: {
        fontSize: 24,
        // marginRight:10,
    },
    tabView: {
        flex: 1,
        backgroundColor: "black",
        borderColor: "white",
        borderWidth: 1,
        alignContent: "center"

    },
    tabViewSelected: {
        flex: 1,
        backgroundColor: "black",
        borderColor: "white",
        borderWidth: 1,
        textAlignVertical: "center"

    },
    textTab: {
        textAlign: "center",
        alignSelf: "center",
        color: "white",
        fontSize: 24,
        textAlignVertical: "center",
    },
    bottomTabs: {
        marginLeft: 10,
        height: 60,
        width: 60
    },
    dateTabsSelected: {
        flex: 1,
        minHeight: 60,
        backgroundColor: "white",
        alignContent: "center",
        alignSelf: "center",
        alignItems: "center",
        borderColor: "white",
        borderWidth: 3,
        // borderBottomStartRadius: 15,
        // borderBottomEndRadius: 15,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
    },
    dateTabsNotSelected: {
        flex: 1,
        minHeight: 60,
        backgroundColor: "black",
        alignContent: "center",
        alignSelf: "center",
        alignItems: "center",
        borderColor: "black",
        borderWidth: 3,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        borderBottomWidth:0,
        shadowColor:"red",
    },
    dateTextTabsNotSelected:{
        color:"grey",
        marginTop: "20%",
        flex:1
    },
    dateTextTabs: {
        color: "black",
        marginTop: "20%",
        flex:1,
        fontWeight:"bold",
    }
})
export default styles;

'use strict'
import {StyleSheet} from 'react-native';

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 20,
        margin: 10,
    },
    tablecontainer: {
        flex: 1,
        alignSelf: "flex-start",
        margin: 30,
        width: 242,
        backgroundColor: "#EFF8FF"
    },
    matchover: {
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#D62628",
        borderWidth: 1,
        marginLeft: 30,
        marginRight: 30,
        width: 100,
    },
    matchpouleover: {
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#D62628",
        borderWidth: 1,
        margin: 30,
        flex: 1,
        // width: 100,
        // height: 100,
        borderRadius: 15
    },
    match: {
        flexDirection: 'column',
        justifyContent: "space-evenly",
        backgroundColor: "#A8DADC",
        borderWidth: 1,
        alignItems: "center",
        marginLeft: 30,
        marginRight: 30,
        width: 100,
    },
    matchpoule: {
        flexDirection: 'column',
        justifyContent: "space-between",
        backgroundColor: "#A8DADC",
        borderWidth: 1,
        flex: 1,
        alignItems: "center",
        margin: 30,
        // width: 100,
        // height:100,
        borderRadius: 15
    },
    textmatch: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: "calibri",
        width: "100%"
    },
    teamnormal: {
        textAlign: "center",
        width: "100%",
        fontSize: 16,
    },
    lose: {
        textAlign: "center",
        width: "100%",
        color: "grey",
        textDecorationLine: "line-through",
        // fontSize: 16
    },
    fetching: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: "100%",
        height:"100%",
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
        justifyContent: "space-around",
        marginBottom: 30,
        marginRight: 0,
        marginLeft: 0
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
    score: {
        textAlign: "center",
        borderColor: "black",
        borderWidth: 1,
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
        alignItems: "center",
        marginTop: 22
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
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    homebuttons: {
        // flex: 1,
        backgroundColor: "#FED8B1",
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
    sportimage:{
        width:68,
        height:68,
    }
    })
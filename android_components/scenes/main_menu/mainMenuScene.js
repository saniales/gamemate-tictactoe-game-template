import React, { Component } from 'react';
import { Application } from '../../../shared_components/application.js';
import { LoadingButton } from '../../buttons/loadingButton.js';
import { ToggleButton } from '../../buttons/toggleButton.js';
import { LoadingSpinner } from '../../misc/loadingSpinner.js';
import { Lobby } from './lobby.js';

import {
  Text,
  StyleSheet,
  ListView,
  View,
  ActivityIndicator,
  ToastAndroid,
  Alert
} from 'react-native';

export class MainMenuScene extends Component {
  constructor(props){
    super(props);
    this.searchRoom = this._searchRoom.bind(this);
  }

  componentWillMount() {
    this.setState({
      loading : false,
      socket : null
    });
    this.setState({socket : this.getSocket()});
  }

  componentDidMount() {

  }

  getSocket() {
    const ws = new WebSocket('ws://gamemate.di.unito.it:8080/match/channel');
    ws.onopen = () => {
      console.warn("Socket open");
    };
    ws.onmessage = null;
    ws.onerror = (error) => {
      this.setState({loading : false});
      //toast android here.
      console.warn("Socket error : " + error.message);
    }
    ws.onclose = () => {
      this.setState({loading : false});
      //toast android here
      console.warn("Socket closed");
    }
    return ws;
  }

  _searchRoom() {
    const { navigator, username } = this.props;
    const { socket } = this.state;
    //to get_room and wait for response.
    const request = {
      Type : "GetRoom",
      API_Token : Application.APIToken,
      SessionToken : Application.SessionToken,
      Username : username
    }
    socket.send(JSON.stringify(request));
    this.setState({loading : true});
  }

  render() {
    const { loading, lobby, socket } = this.state;
    return (
      <View style={styles.container}>
        <Text>{loading ? "Searching opponents..." : "Press the button to play."}</Text>
        <LoadingButton
          style={styles.button}
          loading={loading}
          text="search a lobby"
          onPress={this.searchRoom}/>
        <Lobby socket={socket}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection : 'column',
    alignItems : 'center',
    backgroundColor:'white',
    paddingTop:75
  },
  button : {
    alignItems:'center',
    justifyContent:'center',
    borderRadius:30,
    backgroundColor : 'lightgray',
    marginTop:15,
    height:40,
    width:120
  },
  center : {
    alignItems : 'center'
  }
});

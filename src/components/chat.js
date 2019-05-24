import React, { Component } from 'react';
import ChatInput from './ChatInput';
import Users from "./Users";
import ChatMessages from './ChatMessages';
import socketIOClient from 'socket.io-client';

class Chat extends Component {

    constructor(props){
        super(props);
        this.socket = null;
        this.state = {
            username : localStorage.getItem('username') ? localStorage.getItem('username') : '',
            id : localStorage.getItem('id') ? localStorage.getItem('id') : this.generateID(),
            chat_ready : false,
            users : [],
            messages : [],
            message : ''
        }
    }

    componentDidMount(){
        if(this.state.username.length) {
            this.initChat();
        }
    }

    generateID(){
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 12; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        localStorage.setItem('id', text);
        return text;
    }

    setUsername(username, e){
        this.setState({
            username : username
        }, () => {
            this.initChat();
        });
    }

    sendMessage(message, e){
        console.log(message);
        this.setState({
            messages : this.state.messages.concat([{
               username : localStorage.getItem('username'),
               uid : localStorage.getItem('id'),
               message : message,
           }])
        });
        this.socket.emit('message', {
            username : localStorage.getItem('username'),
            uid : localStorage.getItem('id'),
            message : message,
        });
        this.scrollToBottom();
    }

    scrollToBottom(){
        let messages = document.getElementsByClassName('messages')[0];
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    }

    initChat(){
        localStorage.setItem('username', this.state.username);
        this.setState({
            chat_ready : true,
        });
        this.socket = socketIOClient('http://localhost:3000', {
            query : 'username='+this.state.username+'&uid='+this.state.id
        });

        this.socket.on('updateUsersList', function (users) {
            console.log(users);
            this.setState({
                users : users
            });
        }.bind(this));

        this.socket.on('message', function (message) {
            this.setState({
                messages : this.state.messages.concat([message])
            });
            this.scrollToBottom();
        }.bind(this));
    }

    render(){
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.chat_ready ? (
                        <React.Fragment>
                            <Users users={this.state.users}/>
                            <ChatMessages
                                sendMessage={this.sendMessage.bind(this)}
                                messages={this.state.messages}
                            />
                        </React.Fragment>
                    ) : (
                        <ChatInput
                            setUsername={this.setUsername.bind(this)}
                        />
                    )}
                </header>
            </div>
        );
    }
}

export default Chat;
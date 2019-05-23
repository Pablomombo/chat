import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Chat from './components/Chat';
import 'bootstrap';
import * as serviceWorker from './serviceWorker';

class Index extends React.Component{
 
    render(){
        return(
            <React.Fragment>
                <Chat/>
            </React.Fragment>
        )
    }
}
 
ReactDOM.render(
    <Index/>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

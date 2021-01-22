import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB5XFTqDIs6fldZGPaOfCSdlSJ5s4sey94",
  authDomain: "flashcards-84ed2.firebaseapp.com",
  databaseURL: "https://flashcards-84ed2-default-rtdb.firebaseio.com",
  projectId: "flashcards-84ed2",
  storageBucket: "flashcards-84ed2.appspot.com",
  messagingSenderId: "448213602820",
  appId: "1:448213602820:web:f9ce9bd16b65122c1e1b51",
  measurementId: "G-V75B780V13"
};

var app = firebase.initializeApp(firebaseConfig);
console.log(app)

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
    });
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='app'>
        <header>
            <div className="wrapper">
              <h1>לומדים למבחן בפסיכולוגיה</h1>
                             
            </div>
        </header>
        <div className='container'>

          <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="username" placeholder="שאלה" onChange={this.handleChange} value={this.state.username} />
                  <input type="text" name="currentItem" placeholder="תשובה" onChange={this.handleChange} value={this.state.currentItem} />
                  <button>הוסף</button>
                </form>
          </section>
			<section className='display-item'>
              <p><div className="wrapper">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
						<h3><b>{item.user}</b></h3>
                        <div>{item.title}</div>
                        <p>
                          <button onClick={() => this.removeItem(item.id)}>מחק</button>
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div></p>
          </section>

        </div>
      </div>
    );
  }
}
export default App;

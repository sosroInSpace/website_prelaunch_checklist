import React, { Component } from "react";
import "./App.css";
import "./style.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
      list: []
    };


  }

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  componentDidMount() {
      this.hydrateStateWithLocalStorage();

       window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
   }

   componentWillUnmount() {
      window.removeEventListener(
        "beforeunload",
        this.saveStateToLocalStorage.bind(this)
      );

      // saves if component has a chance to unmount
      this.saveStateToLocalStorage();
  }

   saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  updateInput(key, value) {
    // update react state
    this.setState({ [key]: value });


  }

  addItem() {
    // create a new item
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice()
    };

    // copy current list of items
    const list = [...this.state.list];

    // add the new item to the list
    list.push(newItem);

    // update state with new list, reset the new item input
    this.setState({
      list,
      newItem: ""
    });

    // update localStorage

  }

  deleteItem(id) {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted
    const updatedList = list.filter(item => item.id !== id);

    this.setState({ list: updatedList });

    // update localStorage
  }

  render() {
    return (

      <div className="App">
   
        <div
          className="column-container"
        >
          <h2>Notes</h2>
          <br />
          <textArea
            type="textarea"
            placeholder="Add note."
            value={this.state.newItem}
            onChange={e => this.updateInput("newItem", e.target.value)}
          />
          <button
            onClick={() => this.addItem()}
            disabled={!this.state.newItem.length}
            className="add-button"
          >
            &#43; Add
          </button>
          <br /> 
          <ul>
            {this.state.list.map(item => {
              return (
                <li key={item.id}>
                  <div className="result-container">
                    <div className="result-column">
                     <p>{item.value}</p>
                    </div>
                    <div className="remove-column">
                    <button onClick={() => this.deleteItem(item.id)}>
                     Remove
                    </button>
                  </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
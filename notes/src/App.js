import React, { Component } from "react";
import "./App.css";
import "./style.scss";

/*
  Constants.
*/

const LOCAL_STORAGE_LIST_NAME = 'mathew-and-lukes-app.list';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newItemHeader: '',
      list: [],
    };
  }

  componentDidMount() {

    this.hydrateStateWithLocalStorage();

    window.addEventListener("beforeunload", this.saveStateToLocalStorage);
  }

  componentWillUnmount() {

    this.saveStateToLocalStorage();

    window.removeEventListener("beforeunload", this.saveStateToLocalStorage);
  }

  hydrateStateWithLocalStorage = () => {

    // Check if localstorage is available.

    if (typeof localStorage === 'undefined') {
      return;
    }

    // Get localstorage item.

    const listJSON = localStorage.getItem(LOCAL_STORAGE_LIST_NAME);

    if (listJSON == null) {
      return;
    }

    // Parse localstorage item and save it to state.

    const list = JSON.parse(listJSON);

    this.setState({ list });

  }

  saveStateToLocalStorage = () => {

    console.log("SAVING");

    const { list } = this.state;

    // Check if localstorage is available.

    if (typeof localStorage === 'undefined') {
      return;
    }

    // Save JSON to localstorage.

    const listJSON = JSON.stringify(list);

    localStorage.setItem(LOCAL_STORAGE_LIST_NAME, listJSON);
  }

  saveStateToLocalStorageDebounced = () => {

    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._timer = setTimeout(this.saveStateToLocalStorage, 300);

  }

  addItem = () => {

    const { newItemHeader, list } = this.state;

    // Get trimmed label.

    const label = newItemHeader.trim().replace(/\s\s+/g, ' ');

    // Check if the header already exists.

    if (list.some(obj => obj.label === label)) {
      return;
    }

    // create a new item.

    const newItem = {
      label: label,
      value: '',
    };

    // Add the item to our list.

    const nextList = list.concat([newItem]);

    // update state with new list, reset the new item input

    this.setState({ list: nextList, newItemHeader: '' });
    this.saveStateToLocalStorage();

  }

  deleteItem = (item) => () => {

    // Filter out the item being deleted.

    const { list } = this.state;

    const nextList = list.filter(obj => item !== obj);

    this.setState({ list: nextList });
    this.saveStateToLocalStorage();

  }

  handleChangeItemValue = (item) => (event) => {

    const { list } = this.state;

    // Copy the item.

    const nextItem = { ...item, value: event.target.value };

    // Save the item into a new list.

    const nextList = list.map(obj => obj === item ? nextItem : obj);

    // Save list.

    this.setState({ list: nextList });
    this.saveStateToLocalStorageDebounced();

  }

  handleChangeNewItemHeader = (event) => {

    this.setState({ newItemHeader: event.target.value });

  }

  render() {

    const { list, newItemHeader } = this.state;

    return (
      <div className="App">
   
        <div
          className="column-container"
          >
          <h2>Notes</h2>
          <br />
          <input
            type="text"
            placeholder="New item header."
            value={newItemHeader}
            onChange={this.handleChangeNewItemHeader}
            />
          <button
            onClick={this.addItem}
            disabled={!newItemHeader.length}
            className="add-button"
            >
            &#43; Add
          </button>
          <br /> 
          <ul>
            {list.map((item, i) => {
              return (
                <li key={item.label}>
                  <div className="result-container">
                    <div className="result-column">
                      <div>
                        <h5>{item.label}</h5>
                     </div>
                     <div>
                     <textarea value={item.value} onChange={this.handleChangeItemValue(item)}/>
                     </div>
                    </div>
                    <div className="remove-column">
                    <button onClick={this.deleteItem(item)}>
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

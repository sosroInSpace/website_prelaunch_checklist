import React, { Component } from "react";
import { Accordion, AccordionItem } from 'react-sanfona';
import Select from 'react-select';
import "./App.css";
import "./style.scss";

/*
  Constants.
*/

const LOCAL_STORAGE_LIST_NAME = 'mathew-and-lukes-app.list';

const LOCAL_STORAGE_THEME = 'theme'

const LOCAL_STORAGE_THEME_VALUE = 'theme-value'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newItemHeader: '',
      list: [],
      onKeyPress: this.onKeyPress,
      value: 'select'

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

  onChange(e) {
    const theme = document.getElementById('App');

    this.setState({
      value: e.target.value
    })



    if (e.target.value == "Light") {
        
        theme.classList.add('light-theme');
        theme.classList.remove('dark-theme');

        localStorage.setItem('theme', 'light-theme');
        localStorage.setItem('theme-value', 'Light');

    }
    else if (e.target.value == "Dark"){

        theme.classList.add('dark-theme');
        theme.classList.remove('light-theme');

        let darktheme = theme.classList.add('dark-theme');

         localStorage.setItem('theme', 'dark-theme');
         localStorage.setItem('theme-value', 'Dark');

    }

    else {


        theme.classList.remove('light-theme');
        theme.classList.remove('dark-theme');

        localStorage.setItem('theme', 'theme');
        localStorage.setItem('theme-value', 'theme');

    }
  }





  hydrateStateWithLocalStorage = () => {

    // Check if localstorage is available.

    if (typeof localStorage === 'undefined') {
      return;
    }

    // Get localstorage item.

    const listJSON = localStorage.getItem(LOCAL_STORAGE_LIST_NAME);

    const themeSelect = localStorage.getItem(LOCAL_STORAGE_THEME);

    const themeValue = localStorage.getItem(LOCAL_STORAGE_THEME_VALUE);

    const theme = document.getElementById('App');

    const themeView = document.getElementById('theme-selection');

   this.setState({
      value: themeValue
    })

    theme.classList.add(themeSelect);


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

  addItem = (event) => {

    const { newItemHeader, list } = this.state;

    // Get trimmed label.

    const label = newItemHeader.trim().replace(/\s\s+/g, ' ');

    // Check if the header already exists.

    if (list.some(obj => obj.label === label)) {

      alert('This label already exists..');
      return false;

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

  onKeyPress = (e) => {


        if(e.key === 'Enter'){
            
        const { newItemHeader, list } = this.state;

        // Get trimmed label.

        const label = newItemHeader.trim().replace(/\s\s+/g, ' ');

        // Check if the header already exists.

        if (list.some(obj => obj.label === label)) {
          alert('This label already exists..');
          return false;
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
    const options = ["Theme", "Light", "Dark"]

    return (

      <div className="App" id="App">
            <link rel="preload" href="https://res.cloudinary.com/dm8clqmym/image/upload/v1542516366/note-background_byoguu.jpg" as="image" />

      <div className="gradient-filter"></div>
        <div className="select-wrapper">
         <select id="theme-selection" value={this.state.value} onChange={this.onChange.bind(this)} className="form-control">
          {options.map(option => {
            return <option value={option} key={option} >{option}</option>
          })}
        </select>
      </div>
        <div
          className="column-container"
          >
          <h2>Notes<span>++</span></h2>
          <br />
          <input
            type="text"
            placeholder="New note label."
            value={newItemHeader}
            onChange={this.handleChangeNewItemHeader}
            onKeyPress={this.onKeyPress}
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
              <li>
                 
                    <Accordion>
                       {list.map((item, i) => {
                        return (
                          <AccordionItem className="accordionLabel" title={item.label} expanded={item === 1}>
                            <div>
                                   <textarea value={item.value} onChange={this.handleChangeItemValue(item)}/>
                            </div>
                             <div className="remove-column">
                                  <button onClick={this.deleteItem(item)}>
                                   Remove
                                  </button>
                                </div>
                          </AccordionItem>

                        );
                      })}
                    </Accordion>
                </li>
         
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

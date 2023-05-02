import React, { useState } from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const App = () => {
  const AlertDismissibleExample = () => {
    const [show, setShow] = useState(false);

    if (show) {
      return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>
            I am an alert of type <span className="dangerText">danger</span>!
            But my color is Teal!
          </Alert.Heading>
          <p>
            By the way the button you just clicked is an{" "}
            <span className="infoText">Info</span> button but is using the color
            Tomato. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Accusantium debitis deleniti distinctio impedit officia
            reprehenderit suscipit voluptatibus. Earum, nam necessitatibus!
          </p>
        </Alert>
      );
    }
    return (
      <Button variant="info" onClick={() => setShow(true)}>
        Show Custom Styled Alert
      </Button>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <AlertDismissibleExample />
        icon: <i className="bi bi-badge-tm-fill"></i>
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. Testing the pipeline
          process.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
};

export default App;

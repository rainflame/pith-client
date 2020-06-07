import React from "react";
import "./App.css";

import Library from "./components/Library";
import Discussion from "./components/Discussion";
import { createUser } from "./api";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
    };
  }

  componentDidMount() {
    // get the client's IP address
    const req = new Request("https://rainflame.com/cdn-cgi/trace");
    fetch(req)
      .then((response) => response.text())
      .then((text) => {
        const ip = text.substr(text.indexOf("ip=") + 3, 37);

        // serialize ip to base64, then create a user
        createUser(btoa(ip), (data) => {
          data = JSON.parse(data);
          this.setState({ id: data._id });
        });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <Library />
          <Discussion />
        </div>
      </div>
    );
  }
}

export default App;

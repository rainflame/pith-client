import React from "react";
import "./App.css";

import Library from "./components/Library";
import Discussion from "./components/Discussion";

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
        // serialize ip to base64
        this.setState({ id: btoa(ip) });
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

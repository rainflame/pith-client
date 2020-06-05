import React from "react";
import Post from "./Post";

import "./Discussion.css";

class Discussion extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="discussion-wrapper">
                <h2 className="discussion-header">Discussion</h2>
                <div className="discussion-overflow-wrapper">
                    <div className="discussion">
                        <Post />
                        <Post />
                        <Post />
                    </div>
                </div>
            </div>
        );
    }
}

export default Discussion;

import React from "react";
import Block from "./Block";

import "./Post.css";

class Post extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="post">
                <h4 className="post-title">New Post</h4>
                {this.props.children}
            </div>
        );
    }
}

export default Post;

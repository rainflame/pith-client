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
                <Block />
            </div>
        );
    }
}

export default Post;

import React from "react";

import "./Post.css";

function Post(props) {
    return (
        <div className="post" style={props.style}>
            <h4 className="post-title">New Post</h4>
            {props.children}
        </div>
    );
}

export default Post;

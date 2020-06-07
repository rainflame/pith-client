import React from "react";
import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";

import "./Discussion.css";

class Discussion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        };
    }

    render() {
        let editor = (
            <button onClick={() => this.setState({ editing: true })}>
                Add a new post
            </button>
        );
        if (this.state.editing) {
            editor = (
                <PostEditor onClose={() => this.setState({ editing: false })} />
            );
        }
        return (
            <div className="discussion-wrapper">
                <h2 className="discussion-header">Discussion</h2>
                <div className="discussion-overflow-wrapper">
                    <div className="discussion">
                        <Post>
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                        </Post>
                        <Post>
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                        </Post>
                        <Post>
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                        </Post>
                        <Post>
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                        </Post>
                        <Post>
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                        </Post>
                        <Post>
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                        </Post>
                        <Post>
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                        </Post>
                        <Post>
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                            <Block content={"this is some content"} />
                        </Post>
                    </div>
                </div>

                {editor}
            </div>
        );
    }
}

export default Discussion;

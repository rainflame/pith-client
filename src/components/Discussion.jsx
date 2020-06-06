import React from "react";
import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";

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

                <PostEditor />
            </div>
        );
    }
}

export default Discussion;

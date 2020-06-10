import React from "react";
import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";

import { getPosts, listenForCreatedPosts } from "../api";

import "./Discussion.css";

class Discussion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            posts: [],
        };
    }

    componentDidMount() {
        getPosts((data) => {
            this.setState({ posts: data });
        });

        listenForCreatedPosts((data) => {
            const posts = this.state.posts;
            posts.push(data);
            this.setState({ posts: posts });
        });
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

        const discussion = this.state.posts.map((post) => {
            const blocks = post.blocks.map((block) => {
                return <Block key={block} id={block} save />;
            });
            return <Post key={post._id}>{blocks}</Post>;
        });
        return (
            <div className="discussion-wrapper">
                <h2 className="discussion-header">Discussion</h2>
                <div className="discussion-overflow-wrapper">
                    <div className="discussion">{discussion}</div>
                </div>

                {editor}
            </div>
        );
    }
}

export default Discussion;

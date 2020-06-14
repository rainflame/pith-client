import React from "react";
import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";

import { getPosts, listenForCreatedPosts } from "../api/api";

import "./Discussion.css";

class Discussion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            posts: [],
        };

        this.adjustDiscussionSize = this.adjustDiscussionSize.bind(this);
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

        this.adjustDiscussionSize();
    }

    adjustDiscussionSize() {
        // this is kind of a stupid way of shrinking the chat content
        const editor = document.getElementsByClassName("post-editor")[0];
        const wrapperHeight = document.getElementsByClassName(
            "discussion-wrapper"
        )[0].clientHeight;
        const overflow = document.getElementsByClassName(
            "discussion-overflow-wrapper"
        )[0];
        if (editor) {
            overflow.style.height = `${
                wrapperHeight - editor.clientHeight - 40
            }px`;
        } else {
            overflow.style.height = `${wrapperHeight - 140}px`;
        }
        overflow.scrollTop = overflow.scrollHeight;
    }

    componentDidUpdate() {
        this.adjustDiscussionSize();
    }

    render() {
        let editor = (
            <button
                onClick={() => {
                    this.setState({ editing: true });
                    this.adjustDiscussionSize();
                }}
            >
                Add a new post
            </button>
        );

        if (this.state.editing) {
            editor = (
                <PostEditor
                    onClose={() => this.setState({ editing: false })}
                    onChange={this.adjustDiscussionSize}
                />
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

import React from "react";

import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";

import { getPosts, listenForCreatedPosts } from "../api/post";
import { getSavedBlocks } from "../api/block";
import { joinDiscussion } from "../api/discussion";

import "./Discussion.css";

class Discussion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            posts: [],
            savedBlocks: [],
        };

        this.adjustDiscussionSize = this.adjustDiscussionSize.bind(this);
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        joinDiscussion(params.discussionId, (data) => {
            console.log("joined discussion!");

            getPosts(params.discussionId, (data) => {
                this.setState({ posts: data, id: params.discussionId });
            });

            getSavedBlocks({ discussionId: params.discussionId }, (data) => {
                this.setState({ savedBlocks: data });
            });

            listenForCreatedPosts((data) => {
                const posts = this.state.posts;
                posts.push(data);
                this.setState({ posts: posts });
            });
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
                    discussionId={this.state.id}
                    onClose={() => this.setState({ editing: false })}
                    onChange={this.adjustDiscussionSize}
                />
            );
        }

        const discussion = this.state.posts.map((post) => {
            const blocks = post.blocks.map((block) => {
                return (
                    <Block
                        discussionId={this.state.id}
                        key={block}
                        id={block}
                        savedBlocks={this.state.savedBlocks}
                        // content={block.content}
                        // tags={block.tags}
                        save
                    />
                );
            });

            return (
                <Post
                    key={post._id}
                    time={post.created_at}
                    author={post.author}
                >
                    {blocks}
                </Post>
            );
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

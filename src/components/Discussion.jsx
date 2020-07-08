import React from "react";

import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";
import NameEditor from "./NameEditor";

import { getPosts, listenForCreatedPosts } from "../api/post";
import { getSavedBlocks } from "../api/block";
import { joinDiscussion, getDiscussionNames } from "../api/discussion";

import "./Discussion.css";

class Discussion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            chooseName: true,
            posts: [],
            savedBlocks: [],
            scrolled: 100,
            missedPosts: 0,
        };

        this.adjustDiscussionSize = this.adjustDiscussionSize.bind(this);
        this.recordScrollPercent = this.recordScrollPercent.bind(this);
        this.joinDiscussion = this.joinDiscussion.bind(this);
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        this.setState({ id: params.discussionId });
        // this.adjustDiscussionSize();
    }

    joinDiscussion(name) {
        this.setState({ chooseName: false }, () => {
            joinDiscussion(
                { discussionId: this.state.id, name: name },
                (data) => {
                    console.log("joined discussion!");

                    getDiscussionNames(this.state.id, (data) => {
                        this.setState({ names: data });
                    });

                    getPosts(this.state.id, (data) => {
                        this.setState({ posts: data }, () => {
                            this.adjustDiscussionSize(true);
                        });
                    });

                    getSavedBlocks({ discussionId: this.state.id }, (data) => {
                        this.setState({ savedBlocks: data });
                    });

                    listenForCreatedPosts((data) => {
                        const posts = this.state.posts;
                        posts.push(data);
                        this.setState({ posts: posts }, () => {
                            this.adjustDiscussionSize(true);
                        });
                    });
                }
            );
        });
    }

    adjustDiscussionSize(checkScrollPosition) {
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

        if (checkScrollPosition) {
            if (this.state.scrolled >= 100) {
                overflow.scrollTop = overflow.scrollHeight;
                if (this.state.missedPosts > 0) {
                    this.setState({ missedPosts: 0 });
                }
            } else {
                this.setState({ missedPosts: this.state.missedPosts + 1 });
            }
        }
    }

    recordScrollPercent(e) {
        const elt = e.target;
        const percentScrolled =
            (100 * elt.scrollTop) / (elt.scrollHeight - elt.clientHeight);
        if (percentScrolled === 100) {
            this.setState({ scrolled: percentScrolled, missedPosts: 0 });
        } else {
            this.setState({ scrolled: percentScrolled });
        }
    }

    render() {
        let editor = (
            <button
                onClick={() => {
                    this.setState({ editing: true });
                    this.adjustDiscussionSize(false);
                }}
            >
                Add a new post
            </button>
        );

        if (this.state.editing) {
            editor = (
                <PostEditor
                    discussionId={this.state.id}
                    onClose={() => {
                        this.setState({ editing: false });
                        this.adjustDiscussionSize(true);
                    }}
                    onChange={() => this.adjustDiscussionSize(false)}
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
                    author={this.state.names[post.user]["name"]}
                >
                    {blocks}
                </Post>
            );
        });

        let zoomButton = <div />;
        if (this.state.missedPosts > 0) {
            zoomButton = (
                <div
                    className="discussion-zoom"
                    onClick={() => {
                        this.setState({ scrolled: 100 }, () => {
                            this.adjustDiscussionSize(true);
                        });
                    }}
                >
                    {this.state.missedPosts} new post
                    {this.state.missedPosts > 1 ? "s" : ""} &darr;
                </div>
            );
        }

        if (this.state.chooseName) {
            return <NameEditor onSubmit={this.joinDiscussion} />;
        }
        return (
            <div className="discussion-wrapper">
                <h2 className="discussion-header">Discussion</h2>
                <div
                    className="discussion-overflow-wrapper"
                    onScroll={this.recordScrollPercent}
                >
                    <div className="discussion">{discussion}</div>
                </div>
                {zoomButton}
                {editor}
            </div>
        );
    }
}

export default Discussion;

import React from "react";
// import { CSSTransition, TransitionGroup } from "react-transition-group";

import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";
import NameEditor from "./NameEditor";

import { getPosts, listenForCreatedPosts } from "../api/post";
import { getSavedBlocks } from "../api/block";
import { joinDiscussion } from "../api/discussion";
import { saveValue, getValue } from "../api/local";

import "./style/Discussion.css";

class Discussion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            chooseName: true,
            title: "Discussion",
            theme: "",
            posts: [],
            savedBlocks: [],
            scrolled: 100,
            missedPosts: 0,
        };

        this.adjustDiscussionSize = this.adjustDiscussionSize.bind(this);
        this.recordScrollPercent = this.recordScrollPercent.bind(this);
        this.joinDiscussion = this.joinDiscussion.bind(this);
        this.createReply = this.createReply.bind(this);
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;

        this.setState({ id: params.discussionId }, () => {
            // try to retrieve the discussion id from localstorage (indicating we've
            // already joined it previously and don't need to make a new name)
            const name = getValue(params.discussionId);
            if (name !== null) {
                this.joinDiscussion(name);
            }
        });
    }

    joinDiscussion(name) {
        this.setState({ chooseName: false }, () => {
            joinDiscussion(
                { discussionId: this.state.id, name: name },
                (data) => {
                    console.log("joined discussion!");
                    this.setState({ title: data.title, theme: data.theme });

                    // save the discussion id in localstorage to indicate that we've
                    // already joined it once
                    saveValue(this.state.id, name);

                    getPosts(this.state.id, (data) => {
                        this.setState({ posts: data }, () => {
                            this.adjustDiscussionSize(true);
                        });
                    });

                    getSavedBlocks({ discussionId: this.state.id }, (data) => {
                        console.log(data);
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
                wrapperHeight - editor.clientHeight - 125
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

    createReply(id, content) {
        this.setState({
            editing: true,
            transclude: { id: id, content: content },
        });
    }

    render() {
        let editor = (
            <button
                onClick={() => {
                    this.setState({ editing: true }, () => {
                        this.adjustDiscussionSize(false);
                    });
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
                        this.setState(
                            { editing: false, transclude: null },
                            () => {
                                this.adjustDiscussionSize(true);
                            }
                        );
                    }}
                    onChange={() => this.adjustDiscussionSize(false)}
                    transclude={this.state.transclude || null}
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
                        onReply={(data) => this.createReply(block, data)}
                        // content={block.content}
                        // tags={block.tags}
                        save
                    />
                );
            });
            return (
                // <CSSTransition
                //     key={post.post_id}
                //     timeout={500}
                //     classNames="item"
                // >
                <Post time={post.created_at} author={post.author_name}>
                    {blocks}
                </Post>
                //  </CSSTransition>
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
                <div className="discussion-header">
                    <h1>{this.state.title}</h1>
                    <p className="discussion-theme">{this.state.theme}</p>
                </div>
                <div
                    className="discussion-overflow-wrapper"
                    onScroll={this.recordScrollPercent}
                >
                    <div className="discussion">
                        {/*<TransitionGroup>{discussion}</TransitionGroup>*/}
                        {discussion}
                    </div>
                </div>
                {zoomButton}
                {editor}
            </div>
        );
    }
}

export default Discussion;

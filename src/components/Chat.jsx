import React from "react";
// import { CSSTransition, TransitionGroup } from "react-transition-group";

import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";
import Library from "./Library";
import AccordionPanel from "./AccordionPanel";

import { getPosts, listenForCreatedPosts } from "../api/post";
import { getSavedBlocks } from "../api/block";

import "./style/Chat.css";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            posts: [],
            savedBlocks: [],
            scrolled: 100,
            missedPosts: 0,
            id: this.props.id,
        };

        this.adjustChatSize = this.adjustChatSize.bind(this);
        this.recordScrollPercent = this.recordScrollPercent.bind(this);
        this.createReply = this.createReply.bind(this);
    }

    componentDidMount() {
        if (this.state.id) {
            getPosts(this.state.id, (data) => {
                this.setState({ posts: data }, () => {
                    this.adjustChatSize(true);
                });
            });

            getSavedBlocks({ discussionId: this.state.id }, (data) => {
                this.setState({ savedBlocks: data });
            });

            listenForCreatedPosts((data) => {
                const posts = this.state.posts;
                posts.push(data);
                this.setState({ posts: posts }, () => {
                    this.adjustChatSize(true);
                });
            });
        }
    }

    adjustChatSize(checkScrollPosition, ignoreNewPosts) {
        // this is kind of a stupid way of shrinking the chat content
        const editor = document.getElementsByClassName("post-editor")[0];
        const wrapperHeight = document.getElementsByClassName("chat-wrapper")[0]
            .clientHeight;
        const overflow = document.getElementsByClassName(
            "chat-overflow-wrapper"
        )[0];
        if (editor) {
            overflow.style.height = `${wrapperHeight - editor.clientHeight}px`;
        } else {
            overflow.style.height = `${wrapperHeight}px`;
        }

        if (checkScrollPosition) {
            if (this.state.scrolled >= 100) {
                overflow.scrollTop = overflow.scrollHeight;
                if (this.state.missedPosts > 0) {
                    this.setState({ missedPosts: 0 });
                }
            } else if (!ignoreNewPosts) {
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
        const chat = this.state.posts.map((post) => {
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
                <Post
                    time={post.created_at}
                    key={post.post_id}
                    author={post.author_name}
                >
                    {blocks}
                </Post>
                //  </CSSTransition>
            );
        });

        let zoomButton = <div />;
        if (this.state.missedPosts > 0) {
            zoomButton = (
                <div
                    className="chat-zoom"
                    onClick={() => {
                        this.setState({ scrolled: 100 }, () => {
                            this.adjustChatSize(true);
                        });
                    }}
                >
                    {this.state.missedPosts} new post
                    {this.state.missedPosts > 1 ? "s" : ""} &darr;
                </div>
            );
        }

        return (
            <div className="chat-container">
                <h2>Discussion</h2>
                <div className="chat-wrapper">
                    <div
                        className="chat-overflow-wrapper"
                        onScroll={this.recordScrollPercent}
                    >
                        <div className="chat">
                            {/*<TransitionGroup>{discussion}</TransitionGroup>*/}
                            {chat}
                        </div>
                    </div>
                    {zoomButton}
                    <PostEditor
                        editing={this.state.editing}
                        discussionId={this.state.id}
                        onOpen={() => {
                            this.setState({ editing: true }, () => {
                                this.adjustChatSize(true, true);
                            });
                        }}
                        onClose={() => {
                            this.setState(
                                { editing: false, transclude: null },
                                () => {
                                    this.adjustChatSize(true);
                                }
                            );
                        }}
                        onChange={() => this.adjustChatSize(false)}
                        transclude={this.state.transclude || null}
                    />
                </div>
            </div>
        );
    }
}

export default Chat;

// <AccordionPanel
//                     title="Your saved blocks"
//                     onOpen={() => {
//                         window.scrollTo(0, document.body.scrollHeight);
//                     }}
//                 >
//                     <Library
//                         id={this.state.id}
//                         createReply={this.createReply}
//                     />
//                 </AccordionPanel>

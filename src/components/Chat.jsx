import React from "react";
// import { CSSTransition, TransitionGroup } from "react-transition-group";

import Post from "./Post";
import Block from "./Block";
import PostEditor from "./PostEditor";
// import Library from "./Library";
// import AccordionPanel from "./AccordionPanel";

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

    // getSnapshotBeforeUpdate(prevProps, prevState) {
    //     console.log(prevProps.posts.length, this.props.posts.length);
    //     return null;
    // }

    componentDidMount() {
        this.adjustChatSize(true);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.posts.length !== this.props.posts.length) {
            this.adjustChatSize(true);
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
        const chat = this.props.posts.map((post) => {
            const blocks = post.blocks.map((block) => {
                let blockContent = this.props.blocks[block];
                let transcluded = false;
                let newID = block;

                if (blockContent.body.includes("transclude<")) {
                    const id = blockContent.body.substring(
                        blockContent.body.lastIndexOf("<") + 1,
                        blockContent.body.lastIndexOf(">")
                    );

                    blockContent = this.props.blocks[id];
                    newID = id;
                    transcluded = true;
                }
                return (
                    <Block
                        discussionId={this.state.id}
                        key={block}
                        id={newID}
                        onReply={(data) => this.createReply(block, data)}
                        content={blockContent ? blockContent.body : null}
                        tags={blockContent ? blockContent.tags : null}
                        transcluded={transcluded}
                        saved={this.props.savedBlocks.includes(newID)}
                        save
                        addTag={(tag) => this.props.addTag(newID, tag)}
                        removeTag={(tag) => this.props.removeTag(newID, tag)}
                        saveBlock={() => this.props.saveBlock(newID)}
                        unsaveBlock={() => this.props.unsaveBlock(newID)}
                        userID={this.props.userID}
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

        const searchRes = this.props.searchResults.map((block) => {
            return {
                id: block,
                body: this.props.blocks[block].body,
                tags: this.props.blocks[block].tags,
            };
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
                        onSubmit={this.props.addPost}
                        transclude={this.state.transclude || null}
                        searchResults={searchRes}
                        blockSearch={this.props.blockSearch}
                        tagSearch={this.props.tagSearch}
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

import React from "react";
import Block from "./Block";
import Post from "./Post";

import "./PostEditor.css";

class PostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blocks: [""],
            focusIndex: 0,
        };

        this.updateBlock = this.updateBlock.bind(this);
        this.removeBlock = this.removeBlock.bind(this);
        this.addBlock = this.addBlock.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
        // this is kind of a stupid way of shrinking the chat content
        const height = document.getElementsByClassName("post-editor")[0]
            .clientHeight;
        const wrapperHeight = document.getElementsByClassName(
            "discussion-wrapper"
        )[0].clientHeight;
        document.getElementsByClassName(
            "discussion-overflow-wrapper"
        )[0].style.height = `${wrapperHeight - height - 40}px`;
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    updateBlock(index, value) {
        const blocks = this.state.blocks;
        blocks[index] = value;
        this.setState({ blocks: blocks, focusIndex: index });
    }

    addBlock(index, oldContent, newContent) {
        const blocks = this.state.blocks;
        blocks[index] = oldContent;
        // add in the new content after the old index
        blocks.splice(index + 1, 0, newContent);
        this.setState({ blocks: blocks, focusIndex: index + 1 });
    }

    removeBlock(index, oldContent) {
        const blocks = this.state.blocks;
        if (blocks.length > 1) {
            // if there was content on the current line, add it to the previous one
            if (oldContent) {
                blocks[index - 1] += oldContent;
            }
            // remove the block at the current index
            blocks.splice(index, 1);
            this.setState({ blocks: blocks, focusIndex: index - 1 });
        }
    }

    render() {
        const blocks = this.state.blocks.map((block, index) => (
            <Block
                content={block}
                editable
                focus={this.state.focusIndex === index}
                onEdit={(value) => this.updateBlock(index, value)}
                onNewline={(oldContent, newContent) =>
                    this.addBlock(index, oldContent, newContent)
                }
                onDelete={(oldContent) => this.removeBlock(index, oldContent)}
            />
        ));

        return (
            <div className="post-editor">
                <Post>{blocks}</Post>
                <button onClick={this.handleSubmit}>Add post</button>
                <button onClick={this.props.onClose}>Cancel</button>
            </div>
        );
    }
}

export default PostEditor;

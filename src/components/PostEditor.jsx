import React from "react";
import EditableBlock from "./EditableBlock";
import Post from "./Post";

import { createPost } from "../api/api";

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
        this.props.onChange();
    }

    handleSubmit(e) {
        // remove blanks
        let cleaned = this.state.blocks.filter((word) => {
            return word.length > 0;
        });

        // clean transclusion text
        cleaned = cleaned.map((word) => {
            if (word.includes("transclude<")) {
                const id = word.substring(
                    word.lastIndexOf("<") + 1,
                    word.lastIndexOf(">")
                );
                return `transclude<${id}>`;
            }
            return word;
        });

        if (cleaned.length > 0) {
            createPost(cleaned, (data) => {
                console.log("Added post!");
                this.props.onClose();
            });
        }
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
            <EditableBlock
                content={block}
                editable
                focus={this.state.focusIndex === index}
                onEdit={(value) => this.updateBlock(index, value)}
                onChange={this.props.onChange}
                onNewline={(oldContent, newContent) =>
                    this.addBlock(index, oldContent, newContent)
                }
                onDelete={(oldContent) => this.removeBlock(index, oldContent)}
            />
        ));

        return (
            <div className="post-editor">
                <Post style={{ backgroundColor: "#8aa7fc" }} title="New Post">
                    {blocks}
                </Post>
                <button onClick={this.handleSubmit}>Add post</button>
                <button onClick={this.props.onClose}>Cancel</button>
            </div>
        );
    }
}

export default PostEditor;

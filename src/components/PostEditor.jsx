import React from "react";
import Block from "./Block";
import Post from "./Post";

import "./PostEditor.css";

class PostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blocks: [],
            value: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        if (e.target.value.slice(-1) === "\n") {
            const blocks = this.state.blocks;
            blocks.push(this.state.value);
            this.setState({ blocks: blocks, value: "" });
        } else {
            this.setState({ value: e.target.value });
        }
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

        console.log(wrapperHeight);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    handleKeypress(e) {
        if (e.keyCode === 8) {
            if (this.state.value === "" && this.state.blocks.length > 0) {
                const blocks = this.state.blocks;
                const value = blocks.splice(-1, 1);
                this.setState({ blocks: blocks, value: value });
                e.preventDefault();
            }
        }
        // probably could add the return key here instead of doing
        // it separately above
    }

    render() {
        const blocks = this.state.blocks.map((block) => (
            <Block key={btoa(block)} content={block} />
        ));

        return (
            <div className="post-editor">
                <Post>{blocks}</Post>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <textarea
                            type="text"
                            value={this.state.value}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeypress}
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default PostEditor;

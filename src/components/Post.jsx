import React from "react";

import "./Post.css";

function Post(props) {
	return (
		<div
			className={`post ${
				props.heightLimited ? "post-height-limited" : ""
			}`}
			style={props.style}
		>
			<h4 className="post-title">{props.title}</h4>
			{props.children}
		</div>
	);
}

export default Post;

import React from "react";
import moment from "moment";

import "./Post.css";

function Post(props) {
	const date = moment(props.time);
	const formattedDate = date.format("M/D/YY, h:mm A");

	return (
		<div
			className={`post ${
				props.heightLimited ? "post-height-limited" : ""
			}`}
			style={props.style}
		>
			<h4 className="post-title">{formattedDate}</h4>
			{props.children}
		</div>
	);
}

export default Post;

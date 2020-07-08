import React from "react";
import moment from "moment";

import "./Post.css";

function Post(props) {
	const date = moment(props.time);
	let format = "M/D/YY, h:mm A";
	if (date.isSame(new Date(), "day")) {
		format = "h:mm A";
	}
	const formattedDate = date.format(format);

	return (
		<div
			className={`post ${
				props.heightLimited ? "post-height-limited" : ""
			}`}
			style={props.style}
		>
			<h4 className="post-title">{props.author}</h4>
			<h4 className="post-subtitle">{formattedDate}</h4>
			{props.children}
		</div>
	);
}

export default Post;

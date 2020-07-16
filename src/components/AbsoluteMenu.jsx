import React from "react";
import ReactTooltip from "react-tooltip";

import "./style/AbsoluteMenu.css";

function AbsoluteMenu(props) {
	return (
		<div>
			<a
				data-tip
				data-for={props.id}
				data-event="click focus"
				className="absolute-menu-control"
			>
				▼
			</a>
			<ReactTooltip
				id={props.id}
				globalEventOff="click"
				afterShow={props.onShow || (() => {})}
				afterHide={props.onHide || (() => {})}
				place={props.position || "bottom"}
				className="absolute-menu"
			>
				{props.children}
			</ReactTooltip>
		</div>
	);
}

export default AbsoluteMenu;

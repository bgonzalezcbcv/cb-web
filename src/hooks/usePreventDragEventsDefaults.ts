import React from "react";

const { useEffect } = React;

function usePreventDragEventsDefaults(): void {
	useEffect(() => {
		window.addEventListener(
			"dragover",
			function (e) {
				e = e || event;
				e.preventDefault();
			},
			false
		);

		window.addEventListener(
			"drop",
			function (e) {
				e = e || event;
				e.preventDefault();
			},
			false
		);
	});
}

export default usePreventDragEventsDefaults;

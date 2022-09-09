import React from "react";

import { Alert } from "@mui/material";

import "./BLAlert.scss";

interface BLAlertProps {
	error: string | null;
	onClose?: () => void;
	id?: string;
}

/**
 * default timeout of 2 seconds.
 */
function BLAlert(props: BLAlertProps): JSX.Element | null {
	const { error, id, onClose } = props;

	if (!error) return null;

	return (
		<div className="bottom-left-alert-wrapper">
			<Alert
				id={id}
				severity="error"
				onClose={(): void => {
					onClose?.();
				}}>
				{error}
			</Alert>
		</div>
	);
}

export default BLAlert;

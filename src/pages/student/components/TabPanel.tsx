import * as React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

export function TabPanel(props: TabPanelProps):React.ReactElement {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}
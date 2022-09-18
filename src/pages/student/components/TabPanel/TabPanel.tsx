import * as React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
	className?: string;
}

export default function TabPanel(props: TabPanelProps): React.ReactElement {
	const { children, value, index, className, ...other } = props;

	return (
		<div style={{ height: "100%" }} role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
			{value === index && (
				<Box sx={{ p: 3 }} className={className}>
					<Typography component={"span"}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

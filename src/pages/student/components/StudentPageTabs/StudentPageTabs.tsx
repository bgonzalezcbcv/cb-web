/* eslint-disable */
import * as React from "react";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";

interface StudentPageTabsProps {
	onChange: (newValue: number) => void;
	tabLabels: string[];
	value: number;
}
export default function StudentPageTabs(props: StudentPageTabsProps): React.ReactElement {
	const { tabLabels, onChange, value } = props;

	const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
		onChange(newValue);
	};

	return (
		<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
			<Tabs
				value={value}
				onChange={handleChange}
				variant="scrollable"
				scrollButtons
				sx={{
					[`& .${tabsClasses.scrollButtons}`]: {
						"&.Mui-disabled": { opacity: 0.3 },
					},
				}}>
				{tabLabels.map((tabLabel: string) => (
					<Tab label={tabLabel} />
				))}
			</Tabs>
		</Box>
	);
}

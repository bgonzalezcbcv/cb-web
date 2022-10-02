/* eslint-disable */
import * as React from "react";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";

interface StudentPageTabsProps {
	onChange: (newValue: number) => void;
	tabData: TabData[];
	value: number;
}
export interface TabData {
	label: string;
	dataCY: string;
}
export default function StudentPageTabs(props: StudentPageTabsProps): React.ReactElement {
	const { tabData, onChange, value } = props;

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
				{tabData.map((tabData) => (
					<Tab label={tabData.label} data-cy={tabData.dataCY} />
				))}
			</Tabs>
		</Box>
	);
}

import React from "react";
import { useNavigate } from "react-router-dom";

import Drawer from "@mui/material/Drawer";
import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SidebarSection } from "../../core/interfaces";

import "./Sidebar.scss";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SvgLogo from "../../assets/logo_horizontal.svg";

export interface SidebarProps {
	sections: SidebarSection[];
}

function renderSections(sections: SidebarSection[]): React.ReactElement {
	const navigate = useNavigate();

	return (
		<div>
			{sections.map((section) => {
				return (
					<Accordion key={section.sectionTitle} className="section-container" disableGutters square>
						<AccordionSummary className="section-title" expandIcon={<ExpandMoreIcon />}>
							{section.sectionTitle}
						</AccordionSummary>

						<AccordionDetails>
							<List disablePadding>
								{section.items.map((item) => {
									const { navigationRoute, navigationParams } = item;

									return (
										<ListItem key={item.title} sx={{ paddingY: 0, color: "primary" }} divider={true}>
											<ListItemButton sx={{ color: "primary" }} onClick={(): void => navigate(navigationRoute, navigationParams)}>
												<ListItemText primary={item.title} sx={{ textAlign: "center", color: "text.secondary" }} />
											</ListItemButton>
										</ListItem>
									);
								})}
							</List>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
}

function Sidebar(props: SidebarProps): React.ReactElement {
	const { sections } = props;

	return (
		<Box sx={{ boxShadow: 8, color: "primary" }}>
			<Drawer //
				className="sidebar-container"
				variant="permanent"
				anchor="left"
				sx={{ bgcolor: "primary", "& .MuiDrawer-paper": { boxSizing: "border-box" } }}>
				<img className="logo" src={SvgLogo}></img>
				{renderSections(sections)}
			</Drawer>
		</Box>
	);
}

export default Sidebar;

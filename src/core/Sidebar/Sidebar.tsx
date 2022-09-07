import React from "react";
import Drawer from "@mui/material/Drawer";
import "./Sidebar.scss";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { NavigateOptions, useNavigate } from "react-router-dom";

interface SidebarItem {
	title: string;
	navigationRoute: string;
	navigationParams?: NavigateOptions;
}

interface SidebarSection {
	sectionTitle: string;
	items: SidebarItem[];
}

interface SidebarProps {
	sections: SidebarSection[];
}

function renderSection(section: SidebarSection): React.ReactElement {
	const navigate = useNavigate();
	return (
		<div className="section-container">
			<List className="section-header">{section.sectionTitle}</List>

			{section.items.map((item) => {
				const { navigationRoute, navigationParams } = item;
				return (
					<ListItem className="section-item" key="bb" disablePadding>
						<ListItemButton onClick={(): void => navigate(navigationRoute, navigationParams)}>
							<ListItemText primary={item.title} />
						</ListItemButton>
					</ListItem>
				);
			})}
		</div>
	);
}

function renderSections(sections: SidebarSection[]): React.ReactElement {
	return (
		<div>
			{sections.map((section) => {
				return renderSection(section);
			})}
		</div>
	);
}

function Sidebar(props: SidebarProps): React.ReactElement {
	const { sections } = props;

	return (
		<div>
			<Drawer //
				className="sidebar-container"
				variant="permanent"
				anchor="left"
				sx={{
					width: 240,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: 240,
						boxSizing: "border-box",
						position: "relative",
					},
					position: "relative",
				}}>
				<img className="logo" src={require("../../assets/logo-colegio-bilingue.png")}></img>
				{renderSections(sections)}
			</Drawer>
		</div>
	);
}

export default Sidebar;

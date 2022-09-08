import React from "react";
import { useNavigate } from "react-router-dom";

import Drawer from "@mui/material/Drawer";
import { Accordion, AccordionDetails, AccordionSummary, Box, createTheme, List, ListItem, ListItemButton, ListItemText, ThemeProvider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "./Sidebar.scss";
import { SidebarSection } from "../../core/interfaces";

export interface SidebarProps {
	sections: SidebarSection[];
}

function renderSections(sections: SidebarSection[]): React.ReactElement {
	const navigate = useNavigate();

	return (
		<div>
			{sections.map((section) => {
				return (
					<Accordion key={section.sectionTitle} className="section-container">
						<AccordionSummary className="section-title" expandIcon={<ExpandMoreIcon />}>
							{section.sectionTitle}
						</AccordionSummary>

						<AccordionDetails>
							<List disablePadding>
								{section.items.map((item) => {
									const { navigationRoute, navigationParams } = item;

									return (
										<ListItem key={item.title} className="section-item" sx={{ paddingY: 0 }} divider={true}>
											<ListItemButton onClick={(): void => navigate(navigationRoute, navigationParams)}>
												<ListItemText primary={item.title} sx={{ textAlign: "center" }} />
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

	const theme = createTheme({
		components: {
			MuiAccordion: {
				styleOverrides: {
					root: {
						marginY: 0,
					},
				},
			},
			MuiAccordionSummary: {
				styleOverrides: {
					root: {
						"& .MuiAccordionSummary-content": { justifyContent: "center" },
						borderBottom: 2,
						borderColor: "rgb(117,117,117)",
					},
				},
			},
			MuiAccordionDetails: {
				styleOverrides: {
					root: { padding: 0 },
				},
			},
			MuiDrawer: {
				styleOverrides: {
					root: {
						height: "100%",
						width: 240,
						flexShrink: 0,
						"& .MuiDrawer-paper": {
							width: 240,
							boxSizing: "border-box",
							position: "relative",
						},
						position: "relative",
					},
				},
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ boxShadow: 8 }}>
				<Drawer //
					className="sidebar-container"
					variant="permanent"
					anchor="left">
					<img className="logo" src={require("../../assets/logo-colegio-bilingue.png")}></img>
					{renderSections(sections)}
				</Drawer>
			</Box>
		</ThemeProvider>
	);
}

export default Sidebar;

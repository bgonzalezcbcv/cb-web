import { createTheme, Theme } from "@mui/material/styles";
import { esES } from "@mui/material/locale";
import { esES as esESDG } from "@mui/x-data-grid";

export const theme: Theme = createTheme(
	{
		palette: {
			secondary: {
				main: "rgb(122, 172, 157)",
				light: "#f7e1d8",
				dark: "rgb(31, 82, 62)",
			},
			primary: {
				main: "#3b6090",
				light: "rgb(219, 224, 232)",
				dark: "#042551",
			},
			text: {
				primary: "#000000",
				secondary: "rgba(0,0,0,0.7)",
				disabled: "rgba(20,17,17,0.66)",
			},
		},
		components: {
			MuiAccordionSummary: {
				styleOverrides: {
					root: {
						"& .MuiAccordionSummary-content": {
							justifyContent: "center",
						},
					},
				},
			},
			MuiAccordionDetails: {
				styleOverrides: {
					root: {
						padding: 0,
					},
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
			MuiTypography: {
				defaultProps: {
					variantMapping: {
						h1: "h2",
						h2: "h2",
						h3: "h2",
						h4: "h2",
						h5: "h2",
						h6: "h2",
						subtitle1: "h2",
						subtitle2: "h2",
						body1: "span",
						body2: "span",
					},
				},
			},
		},
	},
	esES,
	esESDG
);

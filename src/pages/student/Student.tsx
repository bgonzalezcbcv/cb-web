import * as React from "react";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { Button, Card, Typography } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { TabPanel } from "./components/TabPanel";
// import FamilyForm from "./components/family-info/FamilyForm";

export default function Student(): React.ReactElement {
	const [value, setValue] = React.useState(0);
	const [editMode, setEditMode] = React.useState(true);

	const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
		setValue(newValue);
	};

	return (
		<Card sx={{ width: "80%", height: "90%", padding: "10px" }}>
			<Box
				sx={{ borderBottom: 1, borderColor: "divider", display: "flex", flexDirection: "row", justifyContent: "space-between", paddingBottom: "10px" }}>
				<div style={{ display: "flex", flexDirection: "row", alignSelf: "center", justifySelf: "center" }}>
					<PersonAddIcon></PersonAddIcon>
					<Typography sx={{ alignSelf: "center", paddingLeft: "10px" }}>Nuevo alumno</Typography>
				</div>
				<div>
					{!editMode ? <Button startIcon={<DeleteIcon />}>Deshacer cambios</Button> : ""}
					<Button startIcon={editMode ? <EditIcon /> : <SendIcon />} onClick={(): void => setEditMode(!editMode)}>
						{editMode ? "Editar" : "Enviar"}{" "}
					</Button>
					<Button startIcon={<DeleteIcon />}>Bajar</Button>
				</div>
			</Box>

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
					<Tab label="Informacion basica" />
					<Tab label="Informacion familiar" />
					<Tab label="Informacion complementaria" />
					<Tab label="Informacion Administrativa" />
					<Tab label="Trayectoria" />
				</Tabs>
			</Box>
			<TabPanel value={value} index={3}>
				{/*<FamilyForm student={} onChange={() => {}}></FamilyForm>*/}
			</TabPanel>
		</Card>
	);
}

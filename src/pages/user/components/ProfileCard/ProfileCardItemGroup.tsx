import React from "react";

import { Grid, Typography } from "@mui/material";
import { ProfileCardItem } from "../../../../core/interfaces";

interface ProfileCardItemGroupProps {
	items: ProfileCardItem[];
}

function ProfileCardItemGroup(props: ProfileCardItemGroupProps): JSX.Element {
	const { items } = props;

	return (
		<Grid container width="fit-content" textAlign="start">
			{items.map((item) => (
				<>
					<Grid item xs={4}>
						<Typography variant="body1">{item.label}</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography variant="body1">{item.value}</Typography>
					</Grid>
				</>
			))}
		</Grid>
	);
}

export default ProfileCardItemGroup;

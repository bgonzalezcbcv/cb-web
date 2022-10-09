import _ from "lodash";
import React from "react";

import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { ProfileCardItem } from "../../../../core/interfaces";
import ProfileCardItemGroup from "./ProfileCardItemGroup";

interface ProfileCardProps {
	title: string | React.ReactElement;
	itemGroups?: {
		title?: string;
		items: ProfileCardItem[];
	}[];
	children?: React.ReactNode;
}

function ProfileCard(props: ProfileCardProps): JSX.Element {
	const { title, children, itemGroups } = props;

	return (
		<Card sx={{ width: "100%", height: "100%" }}>
			<CardContent>
				<Box display="flex" flexDirection="column" alignItems="flex-start">
					<Box display="flex" flexDirection="row" justifyContent="flex-start" width="100%">
						{_.isString(title) ? <Typography variant="h5">{title}</Typography> : title}
					</Box>

					{itemGroups?.map((itemGroup) => (
						<>
							<Box display="flex" flexDirection="column" alignItems="flex-start">
								{title && <Typography variant="h6">{itemGroup.title}</Typography>}
								<ProfileCardItemGroup items={itemGroup.items} />
							</Box>

							<Divider />
						</>
					))}

					{children}
				</Box>
			</CardContent>
		</Card>
	);
}

export default ProfileCard;

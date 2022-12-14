import React from "react";
import {User} from "../../../core/Models";
import {Box, Tooltip, Typography} from "@mui/material";
import "../Groups.scss";

type UserData = {
    name: string;
    surname: string;
};

interface UserListProps {
    users: User[];
}

export default function UserList(props: UserListProps): React.ReactElement {
    const {users} = props;

    const usersNames: UserData[] = users.map((user: User) => {
        return { name: user.name, surname: user.surname };
    }).sort((a: UserData, b: UserData) => {return (a.surname > b.surname ? 1 : b.surname > a.surname ? -1 : 0);
    });

    const usersToShow = usersNames.length > 3 ? usersNames.slice(0, 3) : usersNames;

    const tooltipText = (
        <div>
            <Box className="tooltip-text-container">
                {usersNames.map((value: { name: string; surname: string }, index: number) => {
                    return (
                        <Typography key={index} fontSize={12}>
                            {value.name + " " + value.surname}
                        </Typography>
                    );
                })}
            </Box>
        </div>
    );

    return (
        <Tooltip title={tooltipText} arrow>
            <Box className="teachers-wrapper">
                <Box className="teachers-container">
                    {usersToShow.map((value: { name: string; surname: string }, index: number) => {
                        return (
                            <Typography key={index} fontSize={14}>
                                {value.name + " " + value.surname}
                            </Typography>
                        );
                    })}
                    {usersNames.length > 3 && <Typography fontSize={12} sx={{ marginTop: "5px" }}>{`(Ver ${usersNames.length - 3} más)`}</Typography>}
                </Box>
            </Box>
        </Tooltip>
    );
}
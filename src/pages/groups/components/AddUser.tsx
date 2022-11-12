import React from "react";
import {useNavigate} from "react-router-dom";
import {IconButton} from "@mui/material";
import {GridApi, GridCellValue, GridRenderCellParams} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

interface AddUserProps {
    params: GridRenderCellParams;
    role: string;
}

export default function AddUser(props: AddUserProps): React.ReactElement {
    const {params, role} = props;
    const navigate = useNavigate();

    return (
        <IconButton
            onClick={(): void => {
                const api: GridApi = params.api;
                const thisRow: Record<string, GridCellValue> = {};

                api.getAllColumns()
                    .filter((c) => c.field !== "__check__" && !!c)
                    .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
                navigate(`/addUsers/${role}/${thisRow.id}`);
            }}>
            <AddIcon />
        </IconButton>
    );
}
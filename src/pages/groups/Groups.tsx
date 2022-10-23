/*eslint-disable*/
import React, {useCallback, useEffect, useState} from "react";
import {Group, User} from "../../core/Models";
import {Alert, Box, Button, Card, CircularProgress, Paper, Typography} from "@mui/material";
import {DataGrid, GridApi, GridCellValue, GridColDef} from "@mui/x-data-grid";
import * as APIStore from "../../core/ApiStore";
import {useNavigate} from "react-router-dom";
import Modal from "../../components/modal/Modal";
import schema from "./schema.json";
import {Translator} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import {JsonForms} from "@jsonforms/react";
import uischema from "./ui.json";
import NumericInputControl, {NumericInputControlTester} from "../../components/NumericInput/NumericInputControl";

type GroupData = {
    cycle: string;
    class: string;
    subgroup: string;
    year: number;
    teachers: User[] | [];
};

enum FetchState {
    initial = "initial",
    loading = "loading",
    failure = "failure",
}

const columns: GridColDef[] = [
    { field: "class", headerName: "Clase", disableColumnMenu: false, width: 100 },
    { field: "subgroup", headerName: "Subgrupo", disableColumnMenu: false, width: 100 },
    { field: "cycle", headerName: "Ciclo", disableColumnMenu: false, width: 150 },
    { field: "teachers", headerName: "Docentes", disableColumnMenu: true, width: 300 },
    {
        field: "seeTeachers",
        headerName: "",
        align: "center",
        sortable: false,
        disableColumnMenu: true,
        width: 150,
        renderCell: (params) => {
            const navigate = useNavigate();

            const onClick = (e: any) => {
                e.stopPropagation();

                const api: GridApi = params.api;
                const thisRow: Record<string, GridCellValue> = {};

                api.getAllColumns()
                    .filter((c) => c.field !== "__check__" && !!c)
                    .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
                navigate("/group/" + thisRow.id);
            };
            return <Button onClick={onClick}>Ver docentes</Button>; //Link component
        },
    },
    {
        field: "seeStudents",
        headerName: "Estudiantes",
        align: "center",
        sortable: false,
        disableColumnMenu: true,
        width: 150,
        renderCell: (params) => {
            const navigate = useNavigate();

            const onClick = (e: any) => {
                e.stopPropagation();

                const api: GridApi = params.api;
                const thisRow: Record<string, GridCellValue> = {};

                api.getAllColumns()
                    .filter((c) => c.field !== "__check__" && !!c)
                    .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
                navigate("/students/" + thisRow.id);
            };
            return <Button onClick={onClick}>Ver estudiantes</Button>; //Link component
        },
    }

];

interface GroupsProps {
    rows?: Group[]
}

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

export default function Groups(props: GroupsProps): React.ReactElement {
    const { rows } = props;

    const [groups, setGroups] = useState<Group[]>(rows ?? []);
    const [fetchState, setFetchState] = React.useState(FetchState.initial);
    const [createGroupModalOpen, setCreateGroupModalOpen] = React.useState(false);
    const [groupData, setGroupData] = React.useState<GroupData>();

    const translator = (id: string, defaultMessage: string): string => {
        if (id.includes("required")) return "Este campo es requerido.";
        else return defaultMessage;
    };

    const getGroups = useCallback(async (): Promise<void> => {
        if (rows) return;

        setFetchState(FetchState.loading);

        const response = await APIStore.fetchGroups();

        if (response.success && response.data) {
            setGroups(response.data);
            setFetchState(FetchState.initial);
        } else setFetchState(FetchState.failure);
    }, [rows, setFetchState, setGroups]);

    useEffect((): void => {
        getGroups();
    }, []);

    const handleCreateGroupModalOpen = useCallback(() => {
        setCreateGroupModalOpen(true);
    }, []);

    const handleCreateGroupModalClose = useCallback(() => {
        setCreateGroupModalOpen(false);
        setGroupData({} as GroupData);
    }, []);

    const printTable = useCallback((): JSX.Element | null => {
        switch (fetchState) {
            case "loading":
                return (
                    <Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                    </Box>
                );
            case "failure":
                return (
                    <Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Alert severity="error" variant="outlined">
                            Falló la carga de grupos.
                        </Alert>
                    </Box>
                );
            case "initial":
                return (
                    <DataGrid //
                        style={{ height: 380, width: "100%" }}
                        rows={groups}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                );
            default:
                return null;
        }
    }, [fetchState, groups]);

    return (
        <Card
            sx={{
                width: "90%",
                padding: "20px",
                alignSelf: "flex-start",
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}>
            <Box display="flex" justifyContent="space-between" width="100%" marginBottom="10px">
                <Typography variant="h4">Grupos</Typography>
                <Button variant={"outlined"} onClick={() => setCreateGroupModalOpen(true)}>Crear grupo</Button>
            </Box>

            <Paper>{printTable()}</Paper>

            <Modal show={createGroupModalOpen} title={"Crear grupo"} onClose={handleCreateGroupModalClose} onAccept={handleCreateGroupModalOpen}>
                <Box>
                    <JsonForms
                        i18n={{ translate: translator as Translator }}
                        schema={schema}
                        uischema={uischema}
                        data={groupData}
                        renderers={renderers}
                        onChange={({ data }): void => {
                            setGroupData(data);
                        }}
                        cells={materialCells}
                    />
                </Box>
            </Modal>
        </Card>
    );
}

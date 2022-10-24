/*eslint-disable*/
import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {JsonForms} from "@jsonforms/react";
import {Translator} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import {Alert, Box, Button, Card, CircularProgress, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import {DataGrid, GridApi, GridCellValue, GridColDef} from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Group} from "../../core/Models";
import * as APIStore from "../../core/ApiStore";
import Modal from "../../components/modal/Modal";
import NumericInputControl, {NumericInputControlTester} from "../../components/NumericInput/NumericInputControl";

import schema from "./schema.json";
import uischema from "./ui.json";

import AddIcon from '@mui/icons-material/Add';

import "./Groups.scss";

type GroupData = {
    cycle: string;
    class: string;
    subgroup: string;
    year: string;
    teachers: string[] | [];
};

enum FetchState {
    initial = "initial",
    loading = "loading",
    failure = "failure",
}

const columns: GridColDef[] = [
    { field: "class", headerName: "Clase", disableColumnMenu: false, width: 120, align: "center" },
    { field: "subgroup", headerName: "Subgrupo", disableColumnMenu: false, width: 120, align: "center" },
    { field: "cycle", headerName: "Ciclo", disableColumnMenu: false, width: 180, align: "center",
        renderCell: (params) => {
        const capitalizedCycle = params.value[0].toUpperCase() + params.value.slice(1);
            return (
                <Typography fontSize={14}>{capitalizedCycle}</Typography>
            );
        }},
    {
        field: "teachers",
        headerName: "Docentes",
        align: "center",
        sortable: false,
        disableColumnMenu: true,
        width: 250,
        renderCell: (params) => {
            const teachers = params.value.sort();
            const teachersToShow = teachers.length > 3 ? teachers.slice(0, 3) : teachers;

            const tooltipText = <div>
                <Box className="tooltip-text-container">
                    {teachers.map((value: string, index: number) => {
                        return (
                            <Typography key={index} fontSize={12}>{value}</Typography>
                        )}
                    )}
                </Box>
            </div>

            return (
                <Tooltip title={tooltipText} arrow>
                    <Box className="teachers-wrapper">
                        <Box className="teachers-container">
                            {teachersToShow.map((value: string, index: number) => {
                                return (
                                    <Typography key={index} fontSize={14}>{value}</Typography>
                                )}
                            )}
                            {teachers.length > 3 && <Typography fontSize={12} sx={{marginTop: "5px"}}>{`(Ver ${teachers.length - 3} más)`}</Typography>}
                        </Box>
                    </Box>
                </Tooltip>
            );
        },
    },
    { field: "addTeachers", headerName: "Agregar docentes", disableColumnMenu: true, width: 180, align: "center",
        renderCell: () => {
            return (
                <IconButton onClick={() => {}}><AddIcon /></IconButton>
            )
        }},
    {field: "students", headerName: "Cantidad de estudiantes", disableColumnMenu: true, align: "center", width: 200,
        renderCell: (params) => {
            const amount = params.value.length;

            return (
                <Typography fontSize={14}>{`${amount} estudiantes`}</Typography>
            )
        }},
    {
        field: "seeStudents",
        headerName: "Ver estudiantes",
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
                    .forEach((c) => (thisRow[c.field] = params.row(params.id, c.field)));
                //navigate("/students/" + thisRow.id); //TODO: use this line
                navigate("/students");
            };
            return <IconButton onClick={onClick}><VisibilityIcon /></IconButton>;
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
    const [groupData, setGroupData] = React.useState<GroupData>({} as GroupData);
    const [hasFormErrors, setHasFormErrors] = useState<boolean>(false);

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

    const handleCreateGroupModalAccept = useCallback(async () => {
        const response = await APIStore.createGroup(groupData as Group);

        response && setCreateGroupModalOpen(true);
    }, []);

    const handleCreateGroupModalClose = useCallback(() => {
        setCreateGroupModalOpen(false);
        setGroupData({} as GroupData);
    }, []);

    function setData(data: any, hasErrors: boolean): void {
        setGroupData(data);
        setHasFormErrors(hasErrors);
    }

    const printTable = useCallback((): JSX.Element | null => {
        switch (fetchState) {
            case "loading":
                return (
                    <Box className="loading-container">
                        <CircularProgress />
                    </Box>
                );
            case "failure":
                return (
                    <Box className="loading-container">
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
                        rowHeight={100}
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
            <Box display="flex" justifyContent="space-between" width="100%" marginBottom="30px">
                <Typography variant="h4">Grupos</Typography>
                <Button variant={"outlined"} onClick={() => setCreateGroupModalOpen(true)}>Crear grupo</Button>
            </Box>

            <Paper>{printTable()}</Paper>

            <Modal show={createGroupModalOpen} title={"Crear grupo"} onClose={handleCreateGroupModalClose} onAccept={handleCreateGroupModalAccept} acceptEnabled={!hasFormErrors}>
                <Box>
                    <JsonForms
                        i18n={{ translate: translator as Translator }}
                        schema={schema}
                        uischema={uischema}
                        data={groupData}
                        renderers={renderers}
                        onChange={({ data, errors }): void => {
                            setData(data, errors ? errors.length !== 0 : false);
                        }}
                        cells={materialCells}
                    />
                </Box>
            </Modal>
        </Card>
    );
}

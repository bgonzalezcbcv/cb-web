import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
// import {useNavigate} from "react-router-dom";
import {JsonForms} from "@jsonforms/react";
import {Translator} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import {
    Alert,
    Box,
    Button,
    Card,
    CircularProgress,
    // IconButton,
    InputLabel, MenuItem,
    Paper, Select,
    // Tooltip,
    Typography
} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Grade, Group} from "../../core/Models";
import * as APIStore from "../../core/ApiStore";
import Modal from "../../components/modal/Modal";
import NumericInputControl, {NumericInputControlTester} from "../../components/NumericInput/NumericInputControl";

import schema from "./schema.json";
import uischema from "./ui.json";

// import VisibilityIcon from '@mui/icons-material/Visibility';
// import AddIcon from '@mui/icons-material/Add';

import "./Groups.scss";

type GroupData = {
    gradeId: string;
    name: string;
    year: string;
};

enum FetchState {
    initial = "initial",
    loading = "loading",
    failure = "failure",
}

const columns: GridColDef[] = [
    // { field: "class", headerName: "Clase", disableColumnMenu: false, width: 130, align: "center" },
    { field: "name", headerName: "Subgrupo", disableColumnMenu: false, width: 130, align: "center" },
    { field: "year", headerName: "Año", disableColumnMenu: false, width: 130, align: "center" },
    // { field: "cycle", headerName: "Ciclo", disableColumnMenu: false, width: 150, align: "center",
    //     renderCell: (params) => {
    //     const capitalizedCycle = params.value[0].toUpperCase() + params.value.slice(1);
    //         return (
    //             <Typography fontSize={14}>{capitalizedCycle}</Typography>
    //         );
    //     }},
    // {
    //     field: "teachers",
    //     headerName: "Docentes",
    //     align: "center",
    //     sortable: false,
    //     disableColumnMenu: true,
    //     width: 250,
    //     renderCell: (params) => {
    //         const teachers: Teacher[] = params.value.map((teacher: UserData) => {return {name: teacher.name, surname: teacher.surname}}).sort((a: Teacher, b: Teacher) => (a.surname > b.surname) ? 1 : ((b.surname > a.surname) ? -1 : 0));
    //         const teachersToShow = teachers.length > 3 ? teachers.slice(0, 3) : teachers;
    //
    //         const tooltipText = <div>
    //             <Box className="tooltip-text-container">
    //                 {teachers.map((value: {name: string, surname: string}, index: number) => {
    //                     return (
    //                         <Typography key={index} fontSize={12}>{value.name + " " + value.surname}</Typography>
    //                     )}
    //                 )}
    //             </Box>
    //         </div>
    //
    //         return (
    //             <Tooltip title={tooltipText} arrow>
    //                 <Box className="teachers-wrapper">
    //                     <Box className="teachers-container">
    //                         {teachersToShow.map((value: {name: string, surname: string}, index: number) => {
    //                             return (
    //                                 <Typography key={index} fontSize={14}>{value.name + " " + value.surname}</Typography>
    //                             )}
    //                         )}
    //                         {teachers.length > 3 && <Typography fontSize={12} sx={{marginTop: "5px"}}>{`(Ver ${teachers.length - 3} más)`}</Typography>}
    //                     </Box>
    //                 </Box>
    //             </Tooltip>
    //         );
    //     },
    // },
    // { field: "addTeachers", headerName: "Agregar docentes", disableColumnMenu: true, flex: 1, align: "center",
    //     renderCell: () => {
    //         return (
    //             <IconButton onClick={() => {}}><AddIcon /></IconButton>
    //         )
    //     }},
    // {
    //     field: "seeStudents",
    //     headerName: "Ver estudiantes",
    //     align: "center",
    //     sortable: false,
    //     disableColumnMenu: true,
    //     flex: 1,
    //     renderCell: (params) => {
    //         const navigate = useNavigate();
    //
    //         const onClick = (e: any) => {
    //             e.stopPropagation();
    //
    //             const api: GridApi = params.api;
    //             const thisRow: Record<string, GridCellValue> = {};
    //
    //             api.getAllColumns()
    //                 .filter((c) => c.field !== "__check__" && !!c)
    //                 .forEach((c) => (thisRow[c.field] = params.row(params.id, c.field)));
    //             //navigate("/students/" + thisRow.id); //TODO: use this line
    //             navigate("/students");
    //         };
    //         return <IconButton onClick={onClick}><VisibilityIcon /></IconButton>;
    //     },
    // }
];

interface GroupsProps {
    rows?: Group[]
}

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

export default function Groups(props: GroupsProps): React.ReactElement {
    const { rows } = props;
    const { id } = useParams();

    const [groups, setGroups] = useState<Group[]>(rows ?? []);
    const [fetchState, setFetchState] = React.useState(FetchState.initial);
    const [createGroupModalOpen, setCreateGroupModalOpen] = React.useState(false);
    const [groupData, setGroupData] = React.useState<GroupData>({} as GroupData);
    const [hasFormErrors, setHasFormErrors] = useState<boolean>(false);
    const [grades, setGrades] = useState<Grade[] | undefined>(undefined);

    const translator = (id: string, defaultMessage: string): string => {
        if (id.includes("required")) return "Este campo es requerido.";
        else return defaultMessage;
    };

    const fetchGroups = useCallback(async () => {
        if (!id) {
            if (rows) return;

            setFetchState(FetchState.loading);

            const response = await APIStore.fetchGroups();

            if (response.success && response.data) {
                setGroups(response.data);
                setFetchState(FetchState.initial);
            } else setFetchState(FetchState.failure);
        } else {
            //TODO: Fetch groups for current user
        }
    }, [id, rows, setFetchState, setGroups]);

    useEffect((): void => {
        fetchGroups();
    }, []);

    const handleCreateGroupModalOpen = useCallback(async () => {
        const gradesResponse = await APIStore.fetchGrades();

        if (gradesResponse.success && gradesResponse.data) {
            setGrades(gradesResponse.data);
        }

        setCreateGroupModalOpen(true);
    }, []);

    const handleCreateGroupModalAccept = useCallback(async () => {
        const request = {
            gradeId: groupData.gradeId,
            groupName: groupData.name,
            groupYear: groupData.year,
        };

        const response = await APIStore.createGroup(request);

        response && setCreateGroupModalOpen(false);
    }, [groupData, grades]);

    const handleCreateGroupModalClose = useCallback(() => {
        setCreateGroupModalOpen(false);
        setGroupData({} as GroupData);
    }, []);

    function setData(data: GroupData, hasErrors: boolean): void {
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
                <Button variant={"outlined"} onClick={handleCreateGroupModalOpen}>Crear grupo</Button>
            </Box>

            <Paper>{printTable()}</Paper>

            <Modal show={createGroupModalOpen} title={"Crear grupo"} onClose={handleCreateGroupModalClose} onAccept={handleCreateGroupModalAccept} acceptEnabled={!hasFormErrors}>
                <Box>
                    <Box display="flex" flexDirection="row" marginBottom="2px">
                        {/*<Box sx={{display: "flex", flexDirection: "column", marginRight: 2}}>*/}
                        {/*    <InputLabel id="cycle">Ciclo</InputLabel>*/}
                        {/*    <Select*/}
                        {/*        labelId="cycle"*/}
                        {/*        variant="standard"*/}
                        {/*        value={groupData.cycle ?? ""}*/}
                        {/*        defaultValue={"Maternal"}*/}
                        {/*        style={{width: 218}}*/}
                        {/*        onChange={(e): void => {*/}
                        {/*            const {value} = e.target;*/}
                        {/*            const newCycle = { ...groupData, cycle: value };*/}
                        {/*            setData(newCycle, value.length === 0);*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        {cycles?.map((value, index) => {return (*/}
                        {/*            <MenuItem key={index} value={value}>{value}</MenuItem>*/}
                        {/*        )})}*/}
                        {/*        /!*<MenuItem key={"maternal"} value={Cycle.Nursery}>{"Maternal"}</MenuItem>*!/*/}
                        {/*        /!*<MenuItem key={"inicial"} value={Cycle.Preschool}>{"Inicial"}</MenuItem>*!/*/}
                        {/*        /!*<MenuItem key={"primaria"} value={Cycle.Primary}>{"Primaria"}</MenuItem>*!/*/}
                        {/*        /!*<MenuItem key={"secundaria"} value={Cycle.Secondary}>{"Secundaria"}</MenuItem>*!/*/}
                        {/*    </Select>*/}
                        {/*</Box>*/}

                        <Box display="flex" flexDirection="column">
                            <InputLabel id="grade">Clase</InputLabel>
                            <Select
                                labelId="grade"
                                variant="standard"
                                value={groupData.gradeId}
                                style={{width: 218}}
                                onChange={(e): void => {
                                    const {value} = e.target;
                                    const newGrade = { ...groupData, gradeId: value };
                                    setData(newGrade, false);
                                }}
                            >
                                {grades && grades?.map((grade) => {return <MenuItem key={grade.id} value={grade.id}>{grade.name}</MenuItem>})}
                            </Select>
                        </Box>
                    </Box>

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

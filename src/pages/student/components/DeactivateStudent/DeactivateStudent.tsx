import DatePickerToString from "../../../../components/datePicker/DatePicker";
import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";

export type DeactivationInfo = {
    lastDay: string;
    reason: string;
    description: string;
};

interface DeactivateStudentProps {
    deactivationInfo: (info: DeactivationInfo) => void;
    onError: (hasErrors: boolean) => void;
}

export default function DeactivateStudent(props: DeactivateStudentProps): React.ReactElement {
    const [info, setInfo] = useState<DeactivationInfo>({lastDay: "", reason: "", description: ""} as DeactivationInfo);
    const [reasonHasError, setReasonHasError] = useState(true);
    const [descriptionHasError, setDescriptionHasError] = useState(true);

    useEffect(() => {
        props.onError(info.description === "" || info.lastDay === "" || info.reason === "");
    }, [info]);

    return (
        <Box>
            <DatePickerToString
                date={info.lastDay}
                label={"Último día"}
                editable={true}
                required={true}
                onChange={(date: string): void => {
                    const newInfo = {...info, lastDay: date};
                    setInfo(newInfo);
                    props.deactivationInfo(newInfo);
                }}
            />

            <FormControl variant="standard" sx={{width: "100%", marginTop: "5px"}} required={true} error={reasonHasError}>
                <InputLabel id="reason-label">Motivo</InputLabel>

                <Select
                    labelId="reason-label"
                    id="reason-select"
                    value={info.reason}
                    label="Motivo"
                    error={reasonHasError}
                    onChange={(event): void => {
                        const newInfo = {...info, reason: event.target.value};
                        setInfo(newInfo);
                        setReasonHasError(event.target.value === "");
                        props.deactivationInfo(newInfo);
                    }}
                >
                    <MenuItem value={10}>Motivo 1</MenuItem>
                    <MenuItem value={20}>Motivo 2</MenuItem>
                    <MenuItem value={30}>Motivo 3</MenuItem>
                </Select>
                {reasonHasError && <FormHelperText>{"El campo motivo es requerido."}</FormHelperText>}

                <TextField
                    id="standard-multiline-static"
                    sx={{marginTop: "5px"}}
                    label="Descripción"
                    value={info.description}
                    multiline
                    rows={4}
                    variant="standard"
                    required={true}
                    error={descriptionHasError}
                    helperText={descriptionHasError && "El campo descripción es requerido."}
                    onChange={(event): void => {
                        const newInfo = {...info, description: event.target.value};
                        setInfo(newInfo);
                        setDescriptionHasError(event.target.value === "");
                        props.deactivationInfo(newInfo);
                    }}
                />
            </FormControl>
        </Box>
    )
}
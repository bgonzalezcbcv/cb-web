import React, {useState} from "react";
import {JsonForms} from "@jsonforms/react";
import {JsonSchema7} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import schema from "./schema.json";
import uiSchema from "./ui.json";
import {VisualComponent} from "../../../../core/interfaces";
import {Card, CardContent, Divider, FormControl, InputLabel, MenuItem, Select, TextField, TextFieldProps} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import "./AdministrativeInfo.scss";

const initialData = {};

export default function AdministrativeInfo(props: VisualComponent): React.ReactElement {
    const {width, height} = props;

    const [data, setData] = useState(initialData);
    const [iniValue, setIniValue] = useState<dayjs.Dayjs | null>(dayjs());
    const [finValue, setFinValue] = useState<dayjs.Dayjs | null>(dayjs());

    return (
        <div>
            <Card
                className="administrative-info"
                sx={{
                    width: width ?? "100%",
                    height: height ?? "100%",
                }}>
                <CardContent className={"form-container"}>
                    <JsonForms
                        schema={schema as JsonSchema7}
                        uischema={uiSchema}
                        data={data}
                        renderers={materialRenderers}
                        cells={materialCells}
                        onChange={({data}): void => setData(data)}
                    />
                </CardContent>

                <div className="payment-wrapper">
                    <Card className="payment-container">
                        <CardContent className="payment-content">
                            <div className="payment-header">
                                <h5>Formas de pago</h5>
                                {/*Only show if edit mode*/}
                                <div>
                                    <AddCircleOutlineIcon/>
                                </div>
                            </div>

                            <Divider/>

                            <div className="current-payment-method-container">
                                <div className="year">2022</div>

                                <FormControl variant="standard" className="payment-method-form">
                                    <InputLabel id="payment-method-label">Forma</InputLabel>

                                    <Select
                                        labelId="payment-method"
                                        id="payment-method"
                                        label="Forma"
                                    >
                                        <MenuItem value={''}>Ninguna</MenuItem>
                                        <MenuItem value={'contado'}>Contado</MenuItem>
                                        <MenuItem value={'financiacion'}>Financiación</MenuItem>
                                        <MenuItem value={'licitacion'}>Licitación</MenuItem>
                                    </Select>
                                </FormControl>

                                {/*Only show this if "Forma" is "Contado"*/}
                                {/*This is a FileUploader*/}
                                <TextField label={"Pago anualidad firmado"} variant="standard" sx={{width: 200}}/>
                            </div>

                            <Divider/>
                        </CardContent>
                    </Card>

                    <Card className="discount-container-wrapper">
                        <CardContent className="payment-content">
                            <div className="payment-header">
                                <h5>Descuentos</h5>
                                {/*Only show if edit mode*/}
                                <div>
                                    <AddCircleOutlineIcon/>
                                </div>
                            </div>

                            <Divider/>

                            <div className="discount-container">
                                <div className="current-discount-container">
                                    <TextField label={"% de descuento"} variant="standard" sx={{width: 120}}/>

                                    <FormControl variant="standard" className="discount-reason-form">
                                        <InputLabel id="discount-reason-label">Explicación</InputLabel>

                                        <Select
                                            labelId="discount-reason"
                                            id="discount-reason"
                                            label="Explicación del descuento"
                                        >
                                            <MenuItem value={''}>Ninguna</MenuItem>
                                            <MenuItem value={'hermano'}>Hermano</MenuItem>
                                            <MenuItem value={'resolucion'}>Resolución</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {/*This should be a FileUploader*/}
                                    <TextField label={"Adjunto resolución"} variant="standard" sx={{width: 140, marginLeft: 22}} />
                                </div>

                                <div className="current-discount-type-container">
                                    <FormControl variant="standard" className="discount-type-form">
                                        <InputLabel id="discount-type-label">Tipo</InputLabel>

                                        <Select
                                            labelId="discount-type"
                                            id="discount-type"
                                            label="Tipo"
                                        >
                                            <MenuItem value={''}>Ninguna</MenuItem>
                                            <MenuItem value={'direccion'}>Dirección</MenuItem>
                                            <MenuItem value={'asistente_social'}>Asistente social</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {/*This should be a FileUploader*/}
                                    <TextField label={"Adjunto informe"} variant="standard" sx={{width: 140}} />
                                </div>

                                <div className="validity-container">
                                    <span>Vigencia:</span>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Inicio"
                                            value={iniValue}
                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                            onChange={(newValue) => {
                                                return setIniValue(newValue);
                                            }}
                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} variant={"standard"}/>}
                                        />
                                    </LocalizationProvider>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Fin"
                                            value={finValue}
                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                            onChange={(newValue) => {
                                                return setFinValue(newValue);
                                            }}
                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} variant={"standard"}/>}
                                        />
                                    </LocalizationProvider>
                                </div>

                                <Divider/>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Card>
        </div>
    );
}
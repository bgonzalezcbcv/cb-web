import React, {useCallback, useState} from "react";
import {JsonForms} from "@jsonforms/react";
import {JsonSchema7} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import schema from "./schema.json";
import uiSchema from "./ui.json";
import {VisualComponent} from "../../../../core/interfaces";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import Modal from "../../../../components/modal/Modal";
import {Card, CardContent, Divider, FormControl, InputLabel, MenuItem, Select, TextField, TextFieldProps} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

import "./AdministrativeInfo.scss";

const initialData = {};

export default function AdministrativeInfo(props: VisualComponent): React.ReactElement {
    const {width, height} = props;

    const [data, setData] = useState(initialData);
    const [iniValue, setIniValue] = useState<dayjs.Dayjs | null>(dayjs());
    const [finValue, setFinValue] = useState<dayjs.Dayjs | null>(dayjs());
    const [paymentMethodModalOpen, setPaymentMethodModalOpen] = React.useState(false);
    const [discountModalOpen, setDiscountModalOpen] = React.useState(false);

    const handlePaymentMethodModalOpen = useCallback(() => {
        setPaymentMethodModalOpen(true);
    }, []);

    const handlePaymentMethodModalClose = useCallback(() => {
        setPaymentMethodModalOpen(false);
    }, []);

    const handleDiscountModalOpen = useCallback(() => {
        setDiscountModalOpen(true);
    }, []);

    const handleDiscountModalClose = useCallback(() => {
        setDiscountModalOpen(false);
    }, []);

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

                    <FileUploader label={"Compromiso de inscripción"} width={'100%'} />

                    <TextField label={"Comentarios"} multiline rows={4} variant="standard" style={{width: '100%', marginTop: 5}}/>
                </CardContent>

                <div className="payment-details-wrapper">
                    <Card className="payment-method-container">
                        <CardContent className="payment-content">
                            <div className="payment-header">
                                <h5>Formas de pago</h5>

                                <div>
                                    {/*Only show if edit mode*/}
                                    <AddCircleOutlineIcon onClick={handlePaymentMethodModalOpen}/>

                                    <Modal
                                        show={paymentMethodModalOpen}
                                        title={"Agregar una nueva forma de pago"}
                                        body={
                                            <div className="payment-method-modal-wrapper">
                                                <div className="payment-method-modal-container">
                                                    <TextField label="Año" variant="standard" sx={{width: 100}}>2022</TextField>

                                                    <FormControl variant="standard" sx={{width: 150}}>
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
                                                </div>


                                                {/*Only show this if "Forma" is "Contado"*/}
                                                <FileUploader label={"Pago anualidad firmado"} width={200} />
                                            </div>
                                        }
                                        onClose={handlePaymentMethodModalClose}
                                    />
                                </div>
                            </div>

                            <Divider/>

                        {/* Show table with history */}
                        </CardContent>
                    </Card>

                    <Card className="discount-wrapper">
                        <CardContent className="payment-content">
                            <div className="payment-header">
                                <h5>Descuentos</h5>

                                {/*Only show if edit mode*/}
                                <div>
                                    <AddCircleOutlineIcon onClick={handleDiscountModalOpen} />

                                    <Modal show={discountModalOpen} title={"Agregar un nuevo descuento"}
                                           body={
                                            <div className="discount-container-wrapper">
                                                <div className="discount-container">
                                                    {/*TODO: Add a '%' at the end of the input*/}
                                                    <TextField label={"Porcentaje"} variant="standard" sx={{width: 100}} />

                                                    <FormControl variant="standard" sx={{width: 150}}>
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

                                                    <FileUploader label={"Adjunto resolución"} width={200} />
                                                </div>

                                                <div className="discount-type-container">
                                                    <FormControl variant="standard" sx={{width: 150}}>
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

                                                    <FileUploader label={"Adjunto informe"} width={200} />
                                                </div>

                                                <div className="validity-container">
                                                    <h5>Vigencia:</h5>

                                                    <div className="validity-dates-container">
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
                                                </div>
                                            </div>
                                    } onClose={handleDiscountModalClose}
                                    />
                                </div>
                            </div>

                            <Divider/>
                        {/*Show table with history */}
                        </CardContent>
                    </Card>
                </div>
            </Card>
        </div>
    );
}
import dayjs from "dayjs";
import React, {useCallback, useState} from "react";
import {JsonForms} from "@jsonforms/react";
import {JsonSchema7} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import schema from "./schema.json";
import uiSchema from "./ui.json";
import {VisualComponent} from "../../../../core/interfaces";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import Modal from "../../../../components/modal/Modal";
import {Card, CardContent, Divider, FormControl, InputAdornment, InputLabel, MenuItem, Select, TableContainer, TableHead, TableCell, TableRow, Table, TableBody, TextField, TextFieldProps} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';

import "./AdministrativeInfo.scss";

const initialData = {};

export type AdministrativeInfoProps = {
    editable: boolean;
    onChange?: () => void;
}

export default function AdministrativeInfo(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
    const {editable, height, width} = props;

    const [data, setData] = useState(initialData);
    const [enrollmentCommitment, setEnrollmentCommitment] = useState<File>();
    const [resolutionDocument, setResolutionDocument] = useState<File>();
    const [reportDocument, setReportDocument] = useState<File>();
    const [iniValue, setIniValue] = useState<dayjs.Dayjs | null>(dayjs());
    const [finValue, setFinValue] = useState<dayjs.Dayjs | null>(dayjs());
    const [discountModalOpen, setDiscountModalOpen] = React.useState(false);

    const [paymentMethodModalOpen, setPaymentMethodModalOpen] = React.useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentMethodYear, setPaymentMethodYear] = useState("");
    const [annuityPaymentDocument, setAnnuityPaymentDocument] = useState<File>();

    //TODO: Define callback
    const handleEnrollmentCommitmentDownload = useCallback(() => {
        return undefined
    }, []);

    const handlePaymentMethodModalOpen = useCallback(() => {
        setPaymentMethodModalOpen(true);
    }, []);

    const handlePaymentMethodModalClose = useCallback(() => {
        setPaymentMethodModalOpen(false);
    }, []);

    //TODO: Define callback
    const handleAddNewPaymentMethod = useCallback( () => {
        return undefined;
    }, []);

    const handleDiscountModalOpen = useCallback(() => {
        setDiscountModalOpen(true);
    }, []);

    const handleDiscountModalClose = useCallback(() => {
        setDiscountModalOpen(false);
    }, []);

    const paymentMethodRows = [
        { year: 2022, method: "Licitación", document: "" },
        { year: 2021, method: "Contado", document: "Documento" },
        { year: 2020, method: "Financiación", document: "" },
    ];

    const discountRows = [
        { percentage: '10%', explanation: "Hermano", validityDates: "1/03/2022 15/12/2022", description: "Descripción", resolution: "Documento", type: "Dirección", report: "Documento" },
        { percentage: '10%', explanation: "Resolución", validityDates: "1/03/2022 15/12/2022", description: "Descripción", resolution: "Documento", type: "Asistente social", report: "Documento" },
        { percentage: '10%', explanation: "Hermano", validityDates: "1/05/2022 31/07/2022", description: "Descripción", resolution: "Documento", type: "Asistente social", report: "Documento" },
    ];

    return (
        <div>
            <Card
                className="administrative-info"
                sx={{
                    width: width ?? "100%",
                    height: height ?? "100%",
                }}>
                <CardContent className="form-container">
                    {/*TODO: 'Convenio' has dynamic values - check how to do that*/}
                    <JsonForms
                        schema={schema as JsonSchema7}
                        uischema={uiSchema}
                        data={data}
                        renderers={materialRenderers}
                        cells={materialCells}
                        onChange={({data}): void => setData(data)}
                        readonly={!editable}
                    />

                    {editable ?
                        <FileUploader label={"Compromiso de inscripción"} width={'100%'} uploadedFile={(file) => setEnrollmentCommitment(file)}/>
                        :
                        <div className="document-download-container">
                            <div className="document-download">Compromiso de inscripción</div>
                            {/*TODO: Define onClick function*/}
                            <DownloadIcon onClick={handleEnrollmentCommitmentDownload} />
                        </div>
                    }

                    <TextField sx={{width: "100%", marginTop: 1}} label={"Comentarios"} multiline rows={4} variant="standard" disabled={!editable} />
                </CardContent>

                <div className="payment-details-wrapper">
                    <Card className="payment-method-container">
                        <CardContent className="payment-content">
                            <div className="payment-header">
                                <h4>Formas de pago</h4>

                                <div>
                                    {editable && <AddCircleOutlineIcon onClick={handlePaymentMethodModalOpen}/>}

                                    <Modal
                                        show={paymentMethodModalOpen}
                                        title={"Agregar una nueva forma de pago"}
                                        body={
                                            <div className="payment-method-modal-wrapper">
                                                <div className="payment-method-modal-container">
                                                    <TextField label="Año" variant="standard" sx={{width: 100}} value={paymentMethodYear} onChange={(event) => setPaymentMethodYear(event.target.value)} />

                                                    <FormControl variant="standard" sx={{width: 150}}>
                                                        <InputLabel id="payment-method-label">Forma</InputLabel>

                                                        <Select
                                                            labelId="payment-method"
                                                            id="payment-method"
                                                            label="Forma"
                                                            value={paymentMethod}
                                                            onChange={(event) => setPaymentMethod(event.target.value)}
                                                        >
                                                            <MenuItem value={''}>Ninguna</MenuItem>
                                                            <MenuItem value={'contado'}>Contado</MenuItem>
                                                            <MenuItem value={'financiacion'}>Financiación</MenuItem>
                                                            <MenuItem value={'licitacion'}>Licitación</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>


                                                {/*Only show this if "Forma" is "Contado"*/}
                                                <FileUploader label={"Pago anualidad firmado"} width={200} uploadedFile={(file) => setAnnuityPaymentDocument(file)}/>
                                            </div>
                                        }
                                        onClose={handlePaymentMethodModalClose}
                                        onAccept={handleAddNewPaymentMethod}
                                    />
                                </div>
                            </div>

                            <Divider/>

                            <TableContainer style={{height: 160}}>
                                <Table sx={{width: '100%'}} stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 600}}>Año</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Forma</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Documento</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentMethodRows.map((row) => (
                                            <TableRow
                                                key={row.year}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.year}
                                                </TableCell>
                                                <TableCell>{row.method}</TableCell>
                                                <TableCell>{row.document ? <DownloadIcon style={{marginLeft: 25}} /> : ""}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card className="discount-wrapper">
                        <CardContent className="payment-content">
                            <div className="payment-header">
                                <h4>Descuentos</h4>

                                <div>
                                    {editable && <AddCircleOutlineIcon onClick={handleDiscountModalOpen} />}

                                    <Modal show={discountModalOpen} title={"Agregar un nuevo descuento"}
                                           body={
                                            <div className="discount-container-wrapper">
                                                <div className="validity-dates-container">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Inicio"
                                                            value={iniValue}
                                                            inputFormat={"dd/mm/yyyy"}
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
                                                            inputFormat={"dd/mm/yyyy"}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            onChange={(newValue) => {
                                                                return setFinValue(newValue);
                                                            }}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} variant={"standard"}/>}
                                                        />
                                                    </LocalizationProvider>
                                                </div>

                                                <div className="discount-container">
                                                    {/*TODO: Add a '%' at the end of the input*/}
                                                    <TextField label={"Porcentaje"} variant="standard" sx={{width: 100}} InputProps={{endAdornment: <InputAdornment position={'end'}>%</InputAdornment>}}/>

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

                                                    <TextField label={"Descripción"} variant="standard" />
                                                </div>

                                                <div style={{display: "flex", alignSelf: "center", paddingTop: 8}}>
                                                    <FileUploader label={"Adjunto resolución"} width={200} uploadedFile={(file) => setResolutionDocument(file)}/>
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

                                                    <FileUploader label={"Adjunto informe"} width={200} uploadedFile={(file) => setReportDocument(file)}/>
                                                </div>
                                            </div>
                                    } onClose={handleDiscountModalClose}
                                    />
                                </div>
                            </div>

                            <Divider/>

                            <TableContainer style={{height: 200}}>
                                <Table sx={{ width: '100%'}} stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 600}}>Vigencia</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Porcentaje</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Explicación</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Descripción</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Resolución</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Tipo</TableCell>
                                            <TableCell sx={{fontWeight: 600}}>Informe administrativo</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {discountRows.map((row) => (
                                            <TableRow
                                                key={row.validityDates}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.validityDates}
                                                </TableCell>
                                                <TableCell>{row.percentage}</TableCell>
                                                <TableCell>{row.explanation}</TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell>{<DownloadIcon style={{marginLeft: 25}} />}</TableCell>
                                                <TableCell>{row.type}</TableCell>
                                                <TableCell>{<DownloadIcon style={{marginLeft: 25}} />}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </div>
            </Card>
        </div>
    );
}
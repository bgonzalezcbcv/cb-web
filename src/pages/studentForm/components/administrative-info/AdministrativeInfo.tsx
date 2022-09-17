import React, {useCallback, useState} from "react";
import {JsonForms} from "@jsonforms/react";
import {JsonSchema7} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import dayjs from "dayjs";
import schema from "./schema.json";
import uiSchema from "./ui.json";
import * as Models from "../../../../core/Models";
import {VisualComponent} from "../../../../core/interfaces";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import Modal from "../../../../components/modal/Modal";
import PaymentMethodHistory from "./historyTables/PaymentMethodHistory";
import DiscountHistory from "./historyTables/DiscountHistory";
import {Card, CardContent, Divider, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, TextFieldProps} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import "./AdministrativeInfo.scss";

const paymentMethodRows : Models.PaymentMethod[] = [
    { year: 2022, method: Models.PaymentMethodOption.Bidding, yearly_payment_url: "" },
    { year: 2021, method: Models.PaymentMethodOption.Cash, yearly_payment_url: "Document" },
    { year: 2020, method: Models.PaymentMethodOption.Financing, yearly_payment_url: "" },
];

const discountRows: Models.Discount[] = [
    { percentage: 10, starting_date: new Date('01/03/2022'), ending_date: new Date('10/12/2022'), type: Models.DiscountType.Direction, resolution_url: "Documento", explanation: Models.DiscountExplanation.Sibling, report_url: "Documento", description: "Descripción"},
    { percentage: 10, starting_date: new Date('01/03/2022'), ending_date: new Date('10/12/2022'), type: Models.DiscountType.SocialAssistant, resolution_url: "Documento", explanation: Models.DiscountExplanation.Resolution, report_url: "Documento",  description: "Descripción"},
    { percentage: 10, starting_date: new Date('01/03/2022'), ending_date: new Date('10/12/2022'), type: Models.DiscountType.SocialAssistant, resolution_url: "Documento", explanation: Models.DiscountExplanation.Sibling, report_url: "Documento", description: "Descripción"},
];

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
    const [discountIniDate, setDiscountIniDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [discountFinDate, setDiscountFinDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [discountReason, setDiscountReason] = useState("");
    const [discountType, setDiscountType] = useState("");

    const [paymentMethodModalOpen, setPaymentMethodModalOpen] = React.useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentMethodYear, setPaymentMethodYear] = useState("");
    const [yearlyPaymentDocument, setYearlyPaymentDocument] = useState<File>();

    const handlePaymentMethodModalOpen = useCallback(() => {
        setPaymentMethodModalOpen(true);
    }, []);

    const handlePaymentMethodModalClose = useCallback(() => {
        setPaymentMethodModalOpen(false);
    }, []);

    //TODO: Define this callback
    const handleAddNewPaymentMethod = useCallback( () => {
        return null;
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
                        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                        <FileUploader label={"Compromiso de inscripción"} width={'100%'} uploadedFile={(file) => setEnrollmentCommitment(file)}/>
                        :
                        <div className="document-download-container">
                            <div className="document-download">Compromiso de inscripción</div>
                            {/*TODO: Set correct document src*/}
                            {/*<Link to={enrollmentCommitment} target="_blank" download><DownloadIcon style={{color: 'black'}} /></Link>*/}
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
                                                    {/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */}
                                                    <TextField label="Año" variant="standard" sx={{width: 100}} value={paymentMethodYear} onChange={(event) => setPaymentMethodYear(event.target.value)} />

                                                    <FormControl variant="standard" sx={{width: 150}}>
                                                        <InputLabel id="payment-method-label">Forma</InputLabel>

                                                        <Select
                                                            labelId="payment-method"
                                                            id="payment-method"
                                                            label="Forma"
                                                            value={paymentMethod}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            onChange={(event) => setPaymentMethod(event.target.value)}
                                                        >
                                                            <MenuItem value={'contado'}>Contado</MenuItem>
                                                            <MenuItem value={'financiacion'}>Financiación</MenuItem>
                                                            <MenuItem value={'licitacion'}>Licitación</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                {/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */}
                                                {paymentMethod === Models.PaymentMethodOption.Cash && <FileUploader label={"Pago anualidad firmado"} width={200} uploadedFile={(file) => setYearlyPaymentDocument(file)} />}
                                            </div>
                                        }
                                        onClose={handlePaymentMethodModalClose}
                                        onAccept={handleAddNewPaymentMethod}
                                    />
                                </div>
                            </div>

                            <Divider/>

                            <PaymentMethodHistory rows={paymentMethodRows} />
                        </CardContent>
                    </Card>

                    <Card className="discount-wrapper">
                        <CardContent className="payment-content">
                            <div className="payment-header">
                                <h4>Descuentos</h4>

                                <div>
                                    {editable && <AddCircleOutlineIcon onClick={handleDiscountModalOpen} />}

                                    <Modal
                                        show={discountModalOpen} title={"Agregar un nuevo descuento"}
                                        body={
                                            <div className="discount-container-wrapper">
                                                <div className="validity-dates-container">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Inicio"
                                                            value={discountIniDate}
                                                            inputFormat={"D/MM/YYYY"}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            onChange={(newValue) => {
                                                                return setDiscountIniDate(newValue);
                                                            }}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} variant={"standard"} />}
                                                        />
                                                    </LocalizationProvider>

                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Fin"
                                                            value={discountFinDate}
                                                            inputFormat={"D/MM/YYYY"}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            onChange={(newValue) => {
                                                                return setDiscountFinDate(newValue);
                                                            }}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} variant={"standard"} />}
                                                        />
                                                    </LocalizationProvider>
                                                </div>

                                                <div className="discount-container">
                                                    <TextField
                                                        label={"Porcentaje"}
                                                        value={discountPercentage}
                                                        variant="standard"
                                                        sx={{width: 100}}
                                                        InputProps={{endAdornment: <InputAdornment position={'end'}>%</InputAdornment>}}
                                                        /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                        onChange={(event) => setDiscountPercentage(event.target.value)}
                                                    />

                                                    <FormControl variant="standard" sx={{width: 150}}>
                                                        <InputLabel id="discount-reason-label">Explicación</InputLabel>

                                                        <Select
                                                            labelId="discount-reason"
                                                            id="discount-reason"
                                                            label="Explicación del descuento"
                                                            value={discountReason}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            onChange={(event) => setDiscountReason(event.target.value)}
                                                        >
                                                            <MenuItem value={'hermano'}>Hermano</MenuItem>
                                                            <MenuItem value={'resolucion'}>Resolución</MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                    <TextField label={"Descripción"} variant="standard" />
                                                </div>

                                                <div className="resolution-document">
                                                    {/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */}
                                                    <FileUploader label={"Adjunto resolución"} width={200} uploadedFile={(file) => setResolutionDocument(file)}/>
                                                </div>

                                                <div className="discount-type-container">
                                                    <FormControl variant="standard" sx={{width: 150}}>
                                                        <InputLabel id="discount-type-label">Tipo</InputLabel>

                                                        <Select
                                                            labelId="discount-type"
                                                            id="discount-type"
                                                            label="Tipo"
                                                            value={discountType}
                                                            /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                                                            onChange={(event) => setDiscountType(event.target.value)}
                                                        >
                                                            <MenuItem value={'direccion'}>Dirección</MenuItem>
                                                            <MenuItem value={'asistente_social'}>Asistente social</MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                    {/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */}
                                                    <FileUploader label={"Adjunto informe"} width={200} uploadedFile={(file) => setReportDocument(file)}/>
                                                </div>
                                            </div>
                                    } onClose={handleDiscountModalClose}
                                    />
                                </div>
                            </div>

                            <Divider/>

                            <DiscountHistory rows={discountRows} />
                        </CardContent>
                    </Card>
                </div>
            </Card>
        </div>
    );
}
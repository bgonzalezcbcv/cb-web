import React, {useEffect, useRef, useState} from "react";
import { TextField } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InputAdornment from '@mui/material/InputAdornment';

export type FileUploaderProps = {
    label: string;
    width: number | string;
    uploadedFile: (file: File) => void;
}

export default function FileUploader(props: FileUploaderProps): React.ReactElement {
    const [fileOver, setFileOver] = useState(false);
    const [fileName, setFileName] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        window.addEventListener(
            "dragover",
            function (e) {
                e = e || event;
                e.preventDefault();
            },
            false
        );

        window.addEventListener(
            "drop",
            function (e) {
                e = e || event;
                e.preventDefault();
            },
            false
        );
    });

    async function handleOnClickUpload(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        const file = event.target.files?.[0];

        if (!file) return;

        setFileName(file.name);

        props.uploadedFile(file);
    }

    async function handleOnDropUpload(event: React.DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault();
        event.stopPropagation();

        setFileOver(false);

        const file = event.dataTransfer.files?.[0];

        if (!file) return;

        setFileOver(false);
        setFileName(file.name);
    }

    return (
        <div style={{cursor: "pointer"}}>
            <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleOnClickUpload} style={{ display: "none" }}/>
            <TextField
                className="file-drop-zone"
                variant="standard"
                InputProps={{
                    endAdornment: <InputAdornment position={'end'}><FileUploadIcon /></InputAdornment>,
                }}
                label={props.label}
                value={fileName}
                onDrop={handleOnDropUpload}
                onClick={(): void => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    fileInputRef.current.click();
                }}
                onDragEnter={(): void => setFileOver(true)}
                onDragExit={(): void => setFileOver(false)}
                style={{ background: fileOver ? "rgba(130,4,4,0.21)" : "transparent", width: props.width ?? 200, cursor: 'pointer'}}>
            </TextField>
        </div>
    );
}
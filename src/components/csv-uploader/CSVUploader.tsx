import React, { useEffect, useRef, useState } from "react";

import { VisualComponent } from "../../core/interfaces";
import { processXLSXtoJSON } from "../../core/CoreHelper";
import { Card, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Alumno {
	ci: string;
	apellidos: string;
	nombre: string;
}

function CSVUploader(props: VisualComponent): React.ReactElement {
	const { width, height } = props;

	const [rows, setRows] = useState<Alumno[]>([]);
	const [fileOver, setFileOver] = useState(false);

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

	const columns: GridColDef[] = [
		{ field: "ci", headerName: "CI", width: 150 },
		{ field: "apellidos", headerName: "Apellidos", width: 150 },
		{ field: "nombres", headerName: "Nombres", width: 150 },
	];

	async function handleOnClickUpload(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
		event.preventDefault();

		const file = event.target.files?.[0];

		if (!file) return;
		else setRows(await processXLSXtoJSON<Alumno>(file));
	}

	async function handleOnDropUpload(event: React.DragEvent<HTMLDivElement>): Promise<void> {
		event.preventDefault();
		event.stopPropagation();

		setFileOver(false);

		const file = event.dataTransfer.files?.[0];

		if (!file) return;
		else setRows(await processXLSXtoJSON<Alumno>(file));
	}

	return (
		<Grid width={width ?? 450} height={height ?? 400}>
			<input type="file" ref={fileInputRef} onChange={handleOnClickUpload} style={{ display: "none" }} />

			<DataGrid columns={columns} rows={rows} getRowId={(row): number => row.ci} pageSize={5} />

			<Card
				id="file-drop-zone"
				onDrop={handleOnDropUpload}
				onClick={(): void => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					fileInputRef.current.click();
				}}
				onDragEnter={(): void => setFileOver(true)}
				onDragExit={(): void => setFileOver(false)}
				style={{ background: fileOver ? "#cdcdcd" : "transparent" }}>
				<Grid height={50}>
					<h4>{fileOver ? "Tire el archivo aqui" : "Tire el archivo o presione aqui"}</h4>
				</Grid>
			</Card>
		</Grid>
	);
}
export default CSVUploader;

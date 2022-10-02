import _ from "lodash";
import React from "react";

import { getTitleFromSchema } from "../../core/CoreHelper";
import { JsonSchema7 } from "@jsonforms/core";
import { Box, List, ListItem, Typography } from "@mui/material";

import "./ErrorList.scss";

interface ErrorRow {
	title: string;
	message: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type ErrorsEntry = Record<string, ErrorRow | ErrorsEntry>;

interface ErrorListProps {
	name?: string;
	path: string;
	value: ErrorsEntry;
	schema: JsonSchema7;
}

function ErrorList(props: ErrorListProps): JSX.Element {
	const { name, path, value, schema } = props;

	function printRow(name: string, message: string): React.ReactElement {
		return (
			<ListItem key={`error-row-${name}`}>
				<Box display="flex" flexDirection="row" gap="5px">
					<Typography fontWeight="bold" color="darkred">{`${name}: `}</Typography>
					<Typography>{`${message}`}</Typography>
				</Box>
			</ListItem>
		);
	}

	function printObject(name: string, obj: Record<string, unknown>): React.ReactElement {
		return (
			<ListItem className="error-list">
				<Box>
					{name ? (
						<Typography fontWeight="bold" color="darkred" fontSize="medium">
							{name}
						</Typography>
					) : null}

					<List>
						{Object.entries(obj).map((entry, index) => (
							<ErrorList
								key={`error-row-obj-${index}`} //
								path={path !== "" ? path + "." + entry[0] : entry[0]}
								value={entry[1]}
								schema={schema}
							/>
						))}
					</List>
				</Box>
			</ListItem>
		);
	}

	function printArray(name: string, arr: Record<string, unknown>[]): React.ReactElement {
		return (
			<ListItem>
				<Box>
					<Typography fontWeight="bold" color="darkred" fontSize="medium">
						{name}
					</Typography>

					<List>
						{arr.map((entry, index) => (
							<ErrorList
								key={`error-row-obj-${index}`} //
								path={path + `[${index}]`}
								name={`${index + 1} °`}
								value={entry}
								schema={schema}
							/>
						))}
					</List>
				</Box>
			</ListItem>
		);
	}

	if (value.message) return printRow(name ?? value.title, value.message);

	if (_.isArray(value)) return printArray(name ?? getTitleFromSchema(path, schema) ?? "", value);

	if (_.isPlainObject(value)) return printObject(name ?? getTitleFromSchema(path, schema) ?? "", value as Record<string, unknown>);

	return <></>;
}

export default ErrorList;

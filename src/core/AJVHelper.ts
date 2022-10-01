import _ from "lodash";
import Ajv, { ErrorObject } from "ajv";
import ajvErrors from "ajv-errors";
import ajvFormat from "ajv-formats";

const newAjv = new Ajv({ allErrors: true, verbose: true });

export const ajv = ajvErrors(ajvFormat(newAjv));

export function getAjvErrors(ajvValidator = ajv): ErrorObject[] | null | undefined {
	console.log(ajv.errors);
	return ajvValidator.errors;
}

// Used to fill the ErrorList component
export function getParsedErrors(ajvValidator = ajv): Record<string, unknown> {
	if (ajvValidator.errors?.length === 0) return {};

	const parsedErrors = ajvValidator.errors?.map((error) => {
		return {
			id: error.instancePath
				.replace("/", "")
				.replaceAll(/\/(\d*)\//gm, "[$1]/")
				.replaceAll("/", "."),
			title: error.parentSchema?.title,
			message: error.message,
		};
	});

	let errorObject = {};

	parsedErrors?.forEach((error) => {
		const { id, title, message } = error;

		errorObject = _.set(errorObject, id, {
			title,
			message,
		});
	});

	return errorObject;
}
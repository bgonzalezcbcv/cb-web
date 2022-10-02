import _ from "lodash";
import Ajv, { ErrorObject } from "ajv";
import ajvErrors from "ajv-errors";
import ajvFormat from "ajv-formats";

const newAjv = new Ajv({ allErrors: true, verbose: true, strictRequired: true });

export const ajv = ajvErrors(ajvFormat(newAjv));

export function getAjvErrors(ajvValidator = ajv): ErrorObject[] | null | undefined {
	console.log(ajv.errors);
	return ajvValidator.errors;
}

// Used to fill the ErrorList component
export function getParsedErrors(ajvValidator = ajv): Record<string, unknown> {
	if (ajvValidator.errors?.length === 0) return {};
	let requiredId = 0;

	const parsedErrors = ajvValidator.errors?.map((error) => {
		if (error.keyword === "required") {
			requiredId++;
			const missingPropertyName = error.params.missingProperty;
			const title = error.parentSchema?.properties[missingPropertyName].title;

			return {
				id:
					error.instancePath
						.replace("/", "")
						.replaceAll(/\/(\d*)\//gm, "[$1]/")
						.replaceAll("/", ".")
						.replaceAll(/\.(\d*)\./gm, "[$1].") +
					(error.instancePath === "" ? `` : ".") +
					`required${requiredId}`,
				title,
				message: "Campo requerido.",
			};
		}

		return {
			id: error.instancePath
				.replace("/", "")
				.replaceAll(/\/(\d*)\//gm, "[$1]/")
				.replaceAll("/", "."),
			title: error.parentSchema?.title,
			message: error.message,
		};
	});

	console.log(parsedErrors);

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

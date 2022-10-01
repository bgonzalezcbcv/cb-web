import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import ajvFormat from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
export const studentAjv = ajvErrors(ajvFormat(ajv));

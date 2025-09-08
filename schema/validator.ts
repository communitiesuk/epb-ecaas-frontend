import Ajv2020, { type ErrorObject } from "ajv/dist/2020.js";
import betterAjvErrors from "@readme/better-ajv-errors";
import addFormats from "ajv-formats";
import * as fhsSchema from "./fhs_input.schema.json";

export const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
ajv.addSchema(fhsSchema, "fhs");

export function humanReadable(errors: ErrorObject[], data: object): string {
	const betterErrors = betterAjvErrors(fhsSchema, data, errors, { format: 'js' });

	return `${betterErrors.length} error${ betterErrors.length === 1 ? '' : 's' } found in HEM/FHS request JSON:
	
	${ betterErrors.map(x => `➡ ${ x.error }`).join("\n\n") }`;
}
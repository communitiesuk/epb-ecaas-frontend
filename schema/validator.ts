import Ajv2020 from "ajv/dist/2020";
import * as fhsSchema from "./fhs_input.schema.json";

export const ajv = new Ajv2020({ strict: false });
ajv.addSchema(fhsSchema, "fhs");

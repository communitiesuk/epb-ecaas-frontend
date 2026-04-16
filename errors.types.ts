type ErrorName = "DUPLICATION_ERROR";

export class EcaasError extends Error {
	override name: ErrorName;
	override message: string;

	constructor(name: ErrorName, message?: string) {
		super();
		this.name = name;
		this.message = message ?? "";
	}
}
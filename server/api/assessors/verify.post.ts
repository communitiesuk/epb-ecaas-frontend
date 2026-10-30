import { createError, defineEventHandler, readBody } from "h3";

export const mockRegisteredAssessors = [
	{
		name: "Test Assessor",
		id: "TEST123",
		email: "test.assessor@homes.co.uk",
	},
	{
		name: "No Email Assessor",
		id: "NOEMAIL123",
		email: null,
	},
];

export function checkAssessor(name?: string, id?: string) {
	if (!name || !id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Assessor name and ID are required",
		});
	}

	const trimmedName = name.trim().toLowerCase();
	const trimmedId = id.trim().toUpperCase();

	const matched = mockRegisteredAssessors.find(
		(assessor) =>
			assessor.name.trim().toLowerCase() === trimmedName &&
            assessor.id.trim().toUpperCase() === trimmedId,
	);

	if (!matched) {
		return { isValid: false, reason: "NOT_FOUND" as const, email: null };
	}

	if (!matched.email) {
		return { isValid: false, reason: "NO_EMAIL" as const, email: null };
	}

	return { isValid: true, reason: null, email: matched.email };
}

export default defineEventHandler(async (event) => {
	const body = await readBody<{ name?: string; id?: string }>(event);
	return checkAssessor(body?.name, body?.id);
});
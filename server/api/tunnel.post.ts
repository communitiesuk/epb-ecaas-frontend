import { createError, defineEventHandler, readRawBody } from "h3";

const { public: { sentryDsn } } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
	if (!sentryDsn) {
		return;
	}

	try {
		const rawBody = await readRawBody(event, false);
		if (!rawBody) {
			throw createError({ statusCode: 400, statusMessage: "Empty envelope body" });
		}

		const envelopeBytes = new Uint8Array(rawBody);

		const envelopeText = new TextDecoder().decode(rawBody);
		const firstLine = envelopeText.split("\n")[0];
		if (!firstLine) {
			throw createError({ statusCode: 400, statusMessage: "Invalid envelope headers" });
		}

		const header = JSON.parse(firstLine);
		if (!header.dsn) {
			throw createError({ statusCode: 400, statusMessage: "Missing DSN in envelope header" });
		}

		const dsnUrl = new URL(header.dsn);
		const sentryHost = dsnUrl.hostname;
		const projectId = dsnUrl.pathname.replace("/", "");

		const upstreamUrl = `https://${sentryHost}/api/${projectId}/envelope/`;
    
		const response = await fetch(upstreamUrl, {
			method: "POST",
			body: envelopeBytes,
			headers: {
				"Content-Type": "application/x-sentry-envelope",
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw createError({ 
				statusCode: response.status, 
				statusMessage: `Upstream Sentry error: ${errorText}`, 
			});
		}

		// Return an explicit empty success response back to the client SDK
		return {};
	} catch (error: unknown) {
		// Log internally but don't expose full system stack traces to clients
		console.error("Sentry Tunneling Error:", error);

		if (typeof error === "object" && error) {
			const statusCode: number = ("statusCode" in error) ? error.statusCode as number : 500;
			const statusMessage: string = ("statusMessage" in error) ? error.statusMessage as string : "Internal server error during Sentry tunneling";

			throw createError({
				statusCode,
				statusMessage,
			});
		}
	}
});

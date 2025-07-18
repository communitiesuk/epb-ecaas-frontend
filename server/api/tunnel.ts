export default defineEventHandler(async (event) => {
	console.log('inside tunnel handler');
	try {
		console.log('inside TRY');

		const bodyBuffer = await new Promise<Buffer>((resolve, reject) => {
			const chunks: Buffer[] = [];
			event.node.req.on('data', (chunk) => chunks.push(chunk));
			event.node.req.on('end', () => resolve(Buffer.concat(chunks)));
			event.node.req.on('error', reject);
		});
		console.log('Buffer received, length:', bodyBuffer.length);
		if (!bodyBuffer || bodyBuffer.length === 0) {
			console.warn('Sentry tunnel: Empty body buffer.');
			return { status: 'ok' };
		}

		const envelopeText = new TextDecoder().decode(bodyBuffer);
		console.log('Envelope text received:', envelopeText.slice(0, 200));
		const headerLine = envelopeText.split('\n')[0];
		if (!headerLine) {
			console.warn('Sentry tunnel: Missing header line in envelope, skipping.');
			return { status: 'ok' };
		}
		const header = JSON.parse(headerLine);
		if (!header.dsn) {
			console.warn('Sentry tunnel: Missing DSN in envelope header.');
			return { status: 'ok' };
		}
		const dsnUrl = new URL(header.dsn);
		const orgId = dsnUrl.hostname.split('.')[0] ?? '';
		const projectId = dsnUrl.pathname.replace('/', '');

		if (!orgId || !projectId) {
			console.warn('Sentry tunnel: Missing orgId or projectId, skipping.');
			return { status: 'ok' };
		}

		// const dsn = process.env.SENTRY_DSN;
		// if (!dsn) {
		// 	console.warn('SENTRY_DSN is missing, skipping Sentry tunnel forwarding');
		// 	return { status: 'ok' };
		// }
        
		// const url = new URL('https://' + dsn.split('@')[1]);
		// const orgId = url.hostname.split('.')[0];
		// const projectId = url.pathname.replace(/\//g, '');
		console.log('Forwarding Sentry event');

		await $fetch(`https://${orgId}.ingest.sentry.io/api/${projectId}/envelope/`, {
			method: 'POST',
			body: bodyBuffer,
			headers: {
				'Content-Type': 'application/x-sentry-envelope',
			},
		});

		return { status: 'ok' };
	} catch (error) {
		console.error('Error tunneling to Sentry:', error);
		throw createError({ statusCode: 500, statusMessage: (error as Error).message || 'Unknown error' });
	}
});

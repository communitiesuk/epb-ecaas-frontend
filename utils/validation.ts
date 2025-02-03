// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function showErrorState(context: Record<string, any>): boolean {
	const messageKeys = Object.keys(context.messages)
		.filter(key => context.messages[key].visible);

	return context.state.invalid &&
		messageKeys.length > 0 &&
		context.messages[messageKeys[0]].visible;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(context: Record<string, any>): string | undefined {
	const messageKeys = Object.keys(context.messages)
		.filter(key => context.messages[key].visible);

	return messageKeys.length ? context.messages[messageKeys[0]].value : undefined;
}
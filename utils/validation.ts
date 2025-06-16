import type { FormKitFrameworkContext } from '@formkit/core';

export function showErrorState(context: FormKitFrameworkContext): boolean {
	return context.state.invalid && Object.values(context.messages).some(message => message.visible);
}

export function getErrorMessage(context: FormKitFrameworkContext): string | undefined {
	return Object.values(context.messages).find(message => message.visible)?.value as string;
}

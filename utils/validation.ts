import type { FormKitFrameworkContext } from "@formkit/core";

export function showErrorState(context: FormKitFrameworkContext): boolean {
	return context.state.invalid && Object.values(context.messages).some(message => message.visible);
}

export function getErrorMessage(context: FormKitFrameworkContext): string | undefined {
	const errorMessageObject = Object.values(context.messages).find(message => message.visible);
	return errorMessageObject ? errorMessageObject.value as string : undefined;
}

export function isInteger(node: FormKitNode): boolean {
	return Number.isInteger(Number(node.value));
}

export function uniqueName<T extends object>(forms: EcaasForm<T>[], opts: { id?: string; index?: number }) {
	return (node: FormKitNode) => {
		if (opts.id !== undefined) {
			return forms
				.filter(x => "id" in x.data ? x.data.id !== opts.id : false)
				.every(x => "name" in x.data ? x.data.name !== node.value : false);
		}

		if (opts.index !== undefined) {
			return forms
				.filter((_, i) => i !== opts.index)
				.every(x => "name" in x.data ? x.data.name !== node.value : false);
		}

		return true;
	};
};
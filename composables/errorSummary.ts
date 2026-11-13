import { getValidationMessages } from "@formkit/validation";

/**
 * Handles invalid form submission and populates error messages to be displayed as an error summary
 * @returns Handler for invalid form submission and the populated error messages
 */

export type ErrorSummaryItem = {
	id: string;
	text: string | undefined;
	href?: string;
	disableLink?: boolean;
};

export function useErrorSummary() {
	const errorMessages = ref<ErrorSummaryItem[]>([]);

	const addError = (error: ErrorSummaryItem) => {
		errorMessages.value.push(error);
	};

	const clearErrors = () => {
		errorMessages.value = [];
	};

	const scrollToErrors = () => {
		window.scrollTo(0, 0);
	};

	const handleInvalidSubmit = (node: FormKitNode) => {
		const validationErrors = getValidationMessages(node);

		clearErrors();

		const rawErrors: ErrorSummaryItem[] = [];

		validationErrors.forEach(messages => {
			const errors = messages.map(message => ({
				id: message.meta.i18nArgs![0].node.props.id,
				text: message.value?.toString(),
			}));

			rawErrors.push(...errors);
		});

		const uniqueErrors = rawErrors.filter((error, index, self) =>
			index === self.findIndex(e => e.text === error.text),
		);

		errorMessages.value = uniqueErrors;

		scrollToErrors();
	};

	return { handleInvalidSubmit, errorMessages, addError, clearErrors, scrollToErrors };
}
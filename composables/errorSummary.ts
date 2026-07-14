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

	const handleInvalidSubmit = (node: FormKitNode) => {
		const validationErrors = getValidationMessages(node);

		clearErrors();

		validationErrors.forEach(messages => {
			const errors = messages.map(message => ({
				id: message.meta.i18nArgs![0].node.props.id,
				text: message.value?.toString(),
			}));

			errorMessages.value = errorMessages.value.concat(errors);
		});

		window.scrollTo(0, 0);
	};

	return { handleInvalidSubmit, errorMessages, addError, clearErrors };
}
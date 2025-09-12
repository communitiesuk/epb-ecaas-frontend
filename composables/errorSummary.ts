import { getValidationMessages } from "@formkit/validation";

/**
 * Handles invalid form submission and populates error messages to be displayed as an error summary
 * @returns Handler for invalid form submission and the populated error messages
 */
export function useErrorSummary() {
	const errorMessagesValue: Array<{ id: string; text: string | undefined }> = [];
	const errorMessages = ref(errorMessagesValue);

	const handleInvalidSubmit = (node: FormKitNode) => {
		const validationErrors = getValidationMessages(node);
		errorMessages.value = [];

		validationErrors.forEach(messages => {
			const errors = messages.map(message => ({
				id: message.meta.i18nArgs![0].node.props.id,
				text: message.value?.toString(),
			}));

			errorMessages.value = errorMessages.value.concat(errors);
		});

		window.scrollTo(0, 0);
	};

	return { handleInvalidSubmit, errorMessages };
}
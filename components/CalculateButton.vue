<script setup lang="ts">
import * as Sentry from "@sentry/nuxt";
import { mapFhsInputData } from "~/mapping/fhsInputMapper";
import type { FhsComplianceResponseIncludingErrors } from "~/server/server.types";
import { hasCompleteState } from "~/stores/ecaasStore";

const { onError } = defineProps<{ onError: (errors?: CorrectedJsonApiError[] | boolean) => void; }>();

const store = useEcaasStore();
const calculatePending = ref(false);

const formIsComplete = hasCompleteState(store.$state);

const isDisabled = calculatePending.value || !formIsComplete;

const emit = defineEmits<{
	loading: [],
	stopLoading: [],
}>();

const calculate = async () => {
	calculatePending.value = true;
	let calculateError: CorrectedJsonApiError[] | boolean | undefined;

	try {
		store.$patch({
			lastResult: undefined,
		});

		const inputPayload = mapFhsInputData(resolveState(store.$state));

		const response = await $fetch<FhsComplianceResponseIncludingErrors>(
			"/api/check-compliance",
			{
				method: "POST",
				body: inputPayload,
				async onRequest() {
					emit("loading");
				},
			},
		);

		store.$patch({
			lastResult: !("errors" in response)
				? {
					resultType: "ok",
					response: response.data,
				}
				: {
					resultType: "err",
					errors: response.errors,
				},
		});

		if ("errors" in response) {
			calculateError = response.errors;
		}
	} catch (error) {
		console.error(error);
		Sentry.captureException(error);
		calculateError = true;
	} finally {
		calculatePending.value = false;
		emit("stopLoading");
	}

	if (calculateError) {
		onError(calculateError);
		return;
	}

	navigateTo("/outputs");
};

</script>

<template>
	<GovButton class="calculate-button" :disabled="isDisabled" @click="calculate">Calculate</GovButton>
</template>

<style lang="scss" scoped>
	.calculate-button {
		font-weight: bold;
	}
</style>
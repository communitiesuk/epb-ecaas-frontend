<script setup lang="ts">

// calculate button version which only performs dry run

import { mapFhsInputData, type FhsInputSchema } from "~/mapping/fhsInputMapper";
import type { CheckSchema } from "~/server/server.types";
import { reportCalculateMetric } from "~/server/services/sentryMetrics";
// import { ajv, humanReadable } from "~/schema/validator";
import { hasCompleteState } from "~/stores/ecaasStore";

const { onError } = defineProps<{ onError: (errors?: string | boolean) => void; }>();

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
	let calculateError: string | boolean | undefined;

	let inputPayload: FhsInputSchema | undefined = undefined;

	try {
		inputPayload = mapFhsInputData(resolveState(store.$state));

		console.log(JSON.stringify(inputPayload));

		const check = await $fetch<CheckSchema>("/api/check-schema", {
			method: "POST",
			body: inputPayload,
			async onRequest() {
				emit("loading");
			},
		});

		if (!check.success) {
			calculateError = check.error;
			console.log(calculateError);
		}
	} catch (error) {
		console.error(error);
		calculateError = true;
	} finally {
		calculatePending.value = false;
		emit("stopLoading");
		reportCalculateMetric(inputPayload ?? {}, !calculateError);
	}

	if (calculateError) {
		onError(calculateError);
		return;
	}

	navigateTo("/outputs-dry-run");
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
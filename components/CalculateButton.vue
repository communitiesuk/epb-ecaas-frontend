<script setup lang="ts">
import { mapFhsInputData  } from '~/mapping/fhsInputMapper';
import type {ResolvedState} from '~/mapping/fhsInputMapper';
import type { FhsComplianceResponseIncludingErrors } from '~/server/server.types';
import { hasCompleteState } from '~/stores/ecaasStore';

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

	const inputPayload = mapFhsInputData(resolveState(store) as ResolvedState);
	console.log(JSON.stringify(inputPayload));

	try {
		const response = await $fetch<FhsComplianceResponseIncludingErrors>('/api/check-compliance', {
			method: 'POST',
			body: inputPayload,
			async onRequest() {
				emit("loading");
			},
			async onResponse() {
				emit("stopLoading");
			},
			async onResponseError() {
				emit("stopLoading");
			},
			async onRequestError() {
				emit("stopLoading");
			},
		});

		// TODO: Handle success and error responses
		console.log('Compliance check response', response);
		store.$patch({
			lastResult: (!('errors' in response)) ? {
				resultType: 'ok',
				response: response.data,
			} : {
				resultType: 'err',
				errors: response.errors,
			},
		});
	} catch (error) {
		console.error(error);
	} finally {
		calculatePending.value = false;
	}

	navigateTo('/outputs');
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
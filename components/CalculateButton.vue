<script setup lang="ts">
import { mapFhsInputData, type ResolvedState } from '~/mapping/fhsInputMapper';
import type {SchemaFhsComplianceResponse} from '~/schema/api-schema.types';
import { hasCompleteState } from '~/stores/ecaasStore';

const store = useEcaasStore();
const calculatePending = ref(false);

const isAvailable = hasCompleteState(store.$state);

const isDisabled = calculatePending.value || !isAvailable;

const calculate = async () => {
	calculatePending.value = true;

	const inputPayload = mapFhsInputData(resolveState(store) as ResolvedState);
	console.log(JSON.stringify(inputPayload));

	try {
		const response = await $fetch<SchemaFhsComplianceResponse>('/api/check-compliance', {
			method: 'POST',
			body: inputPayload
		});

		// TODO: Handle success and error responses
		console.log('Compliance check response', response);
	} catch (error) {
		console.error(error);
	} finally {
		calculatePending.value = false;
	}
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
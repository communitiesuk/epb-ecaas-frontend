<script setup lang="ts">
import { mapFhsInputData } from '~/mapping/fhsInputMapper';
import type {SchemaFhsComplianceResponse} from '~/schema/api-schema.types';

const store = useEcaasStore();
const calculatePending = ref(false);

const calculate = async () => {
	calculatePending.value = true;

	try {
		const response = await $fetch<SchemaFhsComplianceResponse>('/api/check-compliance', {
			method: 'POST',
			body: mapFhsInputData(store)
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
	<GovButton class="calculate-button" :disabled="calculatePending ?? null" @click="calculate">Calculate</GovButton>
</template>

<style lang="scss" scoped>
	.calculate-button {
		font-weight: bold;
	}
</style>
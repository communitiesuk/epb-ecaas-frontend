<script setup lang="ts">
import type { CheckComplianceResponse } from '~/schema/api-schema.types';

const calculatePending = ref(false);

const calculate = async () => {
	calculatePending.value = true;

	try {
		const response = await $fetch<CheckComplianceResponse>('/api/check-compliance', {
			method: 'POST',
			body: getInputData()
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
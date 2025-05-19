<script setup lang="ts">
import type { CombustionFuelType } from '~/schema/api-schema.types';

defineProps<{
	id: string,
	name: string;
}>();

const options: Record<CombustionFuelType, string> = {
	wood: 'Wood',
	oil: 'Oil',
	gas: 'Gas',
	coal: 'Coal'
};
</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		label="Type of fuel"
		:name="name"
		validation="required"
		:options="options"
	/>
</template>
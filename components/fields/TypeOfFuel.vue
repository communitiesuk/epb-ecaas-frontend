<script setup lang="ts">
import type { CombustionFuelType } from "~/schema/aliases";

defineProps<{
	id: string,
	name: string;
}>();

const options: Record<CombustionFuelType, SnakeToSentenceCase<CombustionFuelType>> = {
	wood: "Wood",
	oil: "Oil",
	gas: "Gas",
	coal: "Coal"
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
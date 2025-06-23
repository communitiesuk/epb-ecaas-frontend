<script lang="ts" setup>
const { actual, target } = defineProps<{ actual: number, target: number }>();

const percentage = (actual - target) * 100 / target;
</script>

<template>
	<ResultComplianceBadge v-if="actual <= target" :is-compliant="true" :percentage />
	<ResultComplianceBadge v-else :is-compliant="false" :percentage />
</template>


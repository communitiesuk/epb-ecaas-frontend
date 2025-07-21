<script lang="ts" setup>
defineProps<{ isCompliant: boolean; percentage?: number }>();
</script>

<template>
	<strong v-if="isCompliant" class="govuk-tag govuk-tag--green">{{ typeof percentage !== "undefined" ? `${percentage.toFixed(2)}%` : 'Compliant' }}</strong>
	<strong v-else class="govuk-tag govuk-tag--red">{{ typeof percentage !== "undefined" ? `${(percentage > 0) && '+'}${percentage.toFixed(2)}%` : 'Not compliant' }}</strong>
</template>

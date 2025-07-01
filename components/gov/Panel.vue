<script setup lang="ts">
const { title } = defineProps<{
	title: string;
}>();
</script>

<template>
	<div class="govuk-panel govuk-panel--confirmation govuk-!-padding-3">
		<h1 class="govuk-panel__title">{{ title }}</h1>
		<div class="govuk-panel__body">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.govuk-panel__title {
	font-size: 2.5rem;
}
</style>
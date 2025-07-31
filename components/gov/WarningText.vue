<script lang="ts" setup>
defineProps<{
	classes?: string;
	iconFallbackText?: string;
}>();
</script>

<template>
	<div class="govuk-warning-text" :class="classes">
		<span class="govuk-warning-text__icon" aria-hidden="true">!</span>
		<strong class="govuk-warning-text__text">
			<span class="govuk-visually-hidden">{{ iconFallbackText ?? 'Warning' }}</span>
			<slot />
		</strong>
	</div>
</template>

<style scoped lang="scss">
	.govuk-warning-text__icon {
		margin-top: 0;
	}
</style>
<script setup lang="ts">
defineProps<{
	href?: string;
	secondary?: boolean;
	disabled?: boolean;
	click?: (event: Event) => void;
}>();
</script>

<template>
	<NuxtLink
		v-if="href && !click"
		:href="href"
		role="button"
		:class="`govuk-button ${secondary ? 'govuk-button--secondary' : ''}`"
		:disabled="disabled || undefined"
		:aria-disabled="disabled || undefined"
		data-module="govuk-button"
	>
		<slot />
	</NuxtLink>
	<button
		v-else
		:class="`govuk-button ${secondary ? 'govuk-button--secondary' : ''}`"
		:disabled="disabled || undefined"
		:aria-disabled="disabled || undefined"
		data-module="govuk-button"
		@click="click"
	>
		<slot />
	</button>
</template>
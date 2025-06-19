<script setup lang="ts">
defineProps<{
	href?: string;
	secondary?: boolean;
	disabled?: boolean;
}>();
</script>

<template>
	<NuxtLink
		v-if="href"
		:href="href"
		role="button"
		:class="`govuk-button ${secondary ? 'govuk-button--secondary' : ''}`"
		:disabled="disabled"
		:aria-disabled="disabled"
		data-module="govuk-button"
	>
		<slot />
	</NuxtLink>
	<button
		v-else
		:class="`govuk-button ${secondary ? 'govuk-button--secondary' : ''}`"
		:disabled="disabled"
		:aria-disabled="disabled"
		data-module="govuk-button"
	>
		<slot />
	</button>
</template>
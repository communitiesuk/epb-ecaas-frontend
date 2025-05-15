<script setup lang="ts">
defineProps<{
	href?: string;
	secondary?: boolean;
}>();
</script>

<template>
	<NuxtLink
		v-if="href"
		:href="href"
		role="button"
		:class="`govuk-button ${secondary ? 'govuk-button--secondary' : ''}`"
		data-module="govuk-button"
	>
		<slot />
	</NuxtLink>
	<button
		v-else
		:class="`govuk-button ${secondary ? 'govuk-button--secondary' : ''}`"
		data-module="govuk-button"
	>
		<slot />
	</button>
</template>
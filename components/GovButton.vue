<script setup lang="ts">
defineProps<{
	href: string;
	secondary?: boolean;
}>();
</script>

<template>
	<NuxtLink
		:href="href" role="button"
		:class="`govuk-button ${secondary ? 'govuk-button--secondary' : ''}`"
		data-module="govuk-button"
	>
		<slot />
	</NuxtLink>
</template>
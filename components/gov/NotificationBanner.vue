<script setup lang="ts">
defineProps<{
	successType?: boolean,
	title?: string,
	disableAutoFocus?: boolean,
	role?: string,
	titleId?: string,
	heading?: string,
}>();
</script>

<template>
	<div :class="`govuk-notification-banner${ successType ? ' govuk-notification-banner--success' : ''}`" :role="role ?? successType ? 'alert' : 'region'" :aria-labelledby="titleId || 'govuk-notification-banner-title'" :data-disable-auto-focus="disableAutoFocus">
		<div class="govuk-notification-banner__header">
			<h2 :id="titleId || 'govuk-notification-banner-title'" class="govuk-notification-banner__title">{{ title ?? successType ? "Success" : "Important" }}</h2>
		</div>
		<div class="govuk-notification-banner__content">
			<p v-if="heading" class="govuk-notification-banner__heading">{{ heading }}</p>
			<slot />
		</div>
	</div>
</template>
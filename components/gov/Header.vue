<script setup lang="ts">
defineProps<{
	serviceName?: string,
	classes?: string,
}>();
</script>

<template>
	<div :class="`govuk-header ${classes}`" data-module="govuk-header">
		<div class="govuk-header__container govuk-width-container">
			<div class="govuk-header__logo">
				<NuxtLink to="/" class="govuk-header__homepage-link" aria-label="Go to the homepage">
					<gov-logo aria-label-text="GOV.UK" classes="govuk-header__logotype" />
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
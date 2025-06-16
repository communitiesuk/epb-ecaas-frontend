<script setup lang="ts">
defineProps<{
	serviceName?: string,
	classes?: string,
	rebrand: boolean
}>();
</script>

<template>
	<header :class="`govuk-header ${classes}`" data-module="govuk-header">
		<div class="govuk-header__container govuk-width-container">
			<div class="govuk-header__logo">
				<NuxtLink to="/" class="govuk-header__link govuk-header__link--homepage" aria-label="Go to the homepage">
					<gov-logo :rebrand="rebrand" aria-label-text="GOV.UK" classes="govuk-header__logotype" />
				</NuxtLink>
			</div>
		</div>
	</header>
</template>
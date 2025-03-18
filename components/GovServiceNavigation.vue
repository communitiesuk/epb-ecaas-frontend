<script setup lang="ts">
defineProps<{
	serviceName: string
}>();
</script>

<template>
	<section
		aria-label="Service information" class="govuk-service-navigation"
		data-module="govuk-service-navigation">
		<div class="govuk-width-container">
			<div class="govuk-service-navigation__container">
				<span class="govuk-service-navigation__service-name">
					<NuxtLink to="/" class="govuk-service-navigation__link">
						{{ serviceName }}
					</NuxtLink>
				</span>
			</div>
		</div>
	</section>
</template>
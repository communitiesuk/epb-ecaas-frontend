<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const env = runtimeConfig.public.environment;
const testSiteMessage = 'This is a test site.';
</script>

<template>
	<GovCookieBanner />
	<GovHeader classes="govuk-header--full-width-border" />
	<GovServiceNavigation service-name="(Testing) Check Part L building compliance" />
	<div class="govuk-width-container">
		<GovPhaseBanner v-if="env === 'ecaas-intg'" tag="Integration" classes="govuk-tag--green">
			{{ testSiteMessage }}
		</GovPhaseBanner>
		<GovPhaseBanner v-else-if="env === 'ecaas-stag'" tag="Staging" classes="govuk-tag--green">
			{{ testSiteMessage }}
		</GovPhaseBanner>
		<GovPhaseBanner v-else tag="Beta">
			This is a new service. Help us to improve it and <NuxtLink href="/feedback" class="govuk-link">give your feedback</NuxtLink>.
		</GovPhaseBanner>

		<main class="govuk-main-wrapper govuk-!-padding-top-6">
			<div class="govuk-grid-row">
				<div class="govuk-grid-column-full">
					<GovBreadcrumbs />
				</div>
			</div>
			<div class="govuk-grid-row">
				<NuxtLayout>
					<NuxtPage />
				</NuxtLayout>
			</div>
		</main>
		<GovFeedback />
	</div>
	<GovFooter />
</template>
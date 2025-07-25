<template>
	<GovHeader classes="govuk-header--full-width-border" />
	<GovServiceNavigation service-name="Check Part L building compliance" />
	<div class="govuk-width-container">
		<GovPhaseBanner tag="Beta">
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
	</div>
	<GovFooter />
</template>
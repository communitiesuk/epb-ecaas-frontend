<template>
	<GovHeader service-name="Check dwelling compliance" />
	<div class="govuk-width-container">
		<GovPhaseBanner tag="ALPHA">
			This is a new service - your feedback will help us to improve it.
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
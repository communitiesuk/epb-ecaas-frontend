<script lang="ts" setup>
import dayjs from "dayjs";

definePageMeta({ layout: false });

const title = "Get BREL Report";

// TODO will need to dynamically add assessor email here with ***
const email = "ch***@homes.co.uk";
</script>

<template>
	<NuxtLayout name="one-column">
		<Head>
			<Title>{{ title }}</Title>
		</Head>
		<div class="govuk-grid-column-three-quarters">
			<NuxtLink href="/outputs" class="govuk-back-link" data-testid="backLink">Back to results</NuxtLink>

			<h2 class="govuk-heading-l">{{ title }}</h2>
			<GovPanel title="BREL Report sent" data-testid="getBrelEmailConfirmationPanel" class="email-confirmation-panel">
				<p>The BREL Report will be sent to {{ email }} in the next 5 minutes</p>
				<p>{{ dayjs().format("DD/MM/YYYY HH:mm") }}</p>
			</GovPanel>
			<div class="info-text">
				<p class="govuk-body-m">This is the email address associated with the registered assessor number provided. If this is incorrect, please update your email address via scheme you are registered with. This may take 48 hours to update.</p>
				<p class="govuk-body-m">If you haven't received a BREL after 5 minutes, check your spam folder or try requesting a BREL again. If this doesn't work, email 
					<a
						href="mailto:support@epb.gov.uk"
						class="govuk-link govuk-body-m"
						data-testid="supportEmailLink"
					>
						support@epb.gov.uk
					</a>.</p>
			</div>
			<GovButton href="/outputs" data-testid="returnToResultsButton" secondary>Return to results</GovButton>
		</div>
	</NuxtLayout>

</template>

<style scoped lang="scss">

.email-confirmation-panel {
    margin-bottom: 40px;
}

.info-text {
    margin-bottom: 60px;
}

.govuk-back-link {
    margin-bottom: 25px;

}
</style>
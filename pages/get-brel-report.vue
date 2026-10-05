<script setup lang="ts">
const title = "Get BREL Report";

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>

	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>

	<p class="govuk-body">
		Complete the relevant information below. This will show on the report.
	</p>

	<FormKit
		id="typeOfReport"
		type="govRadios"
		:options="reportTypes"
		label="Type of report"
		name="typeOfReport"
		validation="required"
	/>
	<FormKit
		id="plotReference"
		type="govInputText"
		label="Plot reference"
		name="plotReference"
		validation="required"
	/>
	<FormKit
		id="siteReference"
		type="govInputText"
		label="Site reference"
		name="siteReference"
		validation="required"
	/>

	<FormKit
		id="dwellingAddress"
		type="govInputText"
		label="Dwelling address"
		name="dwellingAddress"
		validation="required"
	/>

	<FormKit
		id="showDeliveredEnergyUse"
		name="showDeliveredEnergyUse"
		type="govBoolean"
		label="Show delivered energy use"
		validation="required"
	/>

	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/outputs" secondary>
			Return to results
		</GovButton>
	</div>
</template>
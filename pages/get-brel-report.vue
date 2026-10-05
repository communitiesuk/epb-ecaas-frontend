<script setup lang="ts">
const title = "Get BREL Report";

const typeOfReport = ref("");

const reportTypes: Record<string, string> = {
	design: "Design",
	build: "Build",
} as const;

const confirmationOfIdentityOptions = {
	confirmation: "I confirm that this is my name and assessor credentials, and I am not making this request on behalf of anyone else.",
};

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<NuxtLink href="/outputs" class="govuk-back-link" data-testid="backLink">Back to results</NuxtLink>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">
		Complete the relevant information below. This will show on the report.
	</p>
	<FormKit
		type="form"
		:actions="false"
		:incomplete-message="false"
	>
		<FormKit
			id="typeOfReport"
			v-model="typeOfReport"
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
			v-if="typeOfReport === 'build'"
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
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
		<fieldset class="govuk-fieldset section-spacing">
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
				<h1 class="govuk-fieldset__heading">
					Client details
				</h1>
			</legend>
			<FormKit
				id="clientName"
				type="govInputText"
				label="Client name"
				name="clientName"
				validation="required"
			/>
			<FormKit
				id="clientOrganisation"
				type="govInputText"
				label="Client organisation"
				name="clientOrganisation"
				validation="required"
			/>
			<FormKit
				id="clientAddress"
				type="govInputText"
				label="Client address"
				name="clientAddress"
				validation="required"
			/>
		</fieldset>
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
		<fieldset class="govuk-fieldset section-spacing">
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
				<h1 class="govuk-fieldset__heading">
					Assessor details
				</h1>
			</legend>
			<FormKit
				id="assessorName"
				type="govInputText"
				label="Assessor name"
				name="assessorName"
				validation="required"
			/>
			<FormKit
				id="assessorId"
				type="govInputText"
				label="Assessor ID"
				name="assessorId"
				validation="required"
			/>
			<FormKit
				id="confirmationOfIdentity"
				type="govCheckboxes"
				label="Confirmation of identity"
				:options="confirmationOfIdentityOptions"
				name="confirmationOfIdentity"
				validation="required"
				size="small"
			/>
		</fieldset>
		<GovInset>
			<p>The BREL report will be emailed to the email address associated with your assessor ID.</p>
		</GovInset>
		<div class="govuk-button-group govuk-!-margin-top-6">
			<FormKit
				type="govButton"
				label="Get BREL report"
				:ignore="true"
			/>
			<GovButton href="/outputs" secondary>
				Return to results
			</GovButton>
		</div>
	</FormKit>
</template>

<style scoped lang="scss">
.section-spacing {
	margin-top: 30px;
}

.govuk-fieldset__heading {
	margin-bottom: 20px;
}

</style>
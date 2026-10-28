<script setup lang="ts">
import type { FormKitNode } from "@formkit/core";

const title = "Get BREL Report";

const { handleInvalidSubmit, errorMessages, clearErrors } = useErrorSummary();

const typeOfReport = ref("");

const reportTypes: Record<string, string> = {
	design: "Design",
	build: "Build",
} as const;

const confirmationOfIdentityOptions = {
	confirmation:
        "I confirm that this is my name and assessor credentials, and I am not making this request on behalf of anyone else.",
};

const assessorNotRegisteredMessage =
    "The assessor name and ID provided don't match our records. You cannot download a BREL report without supplying accurate assessor details.";

const assessorNoEmailMessage =
    "We found your details on the register, but there is no email address linked to your account. Please update your email address via your scheme provider.";

const currentAssessorErrorMessage = ref(assessorNotRegisteredMessage);

interface BrelReportFormData {
	typeOfReport: string;
	plotReference: string;
	siteReference: string;
	dwellingAddress?: string;
	clientName: string;
	clientOrganisation: string;
	clientAddress: string;
	assessorName: string;
	assessorId: string;
	confirmationOfIdentity: string[];
}

const confirmedAssessorEmail = useState<string | null>("brel-assessor-email", () => null);

onMounted(() => {
	confirmedAssessorEmail.value = null;
});

const assessorIsRegistered = async (node: FormKitNode): Promise<boolean> => {
	const formData = node.at("$root")?.value as BrelReportFormData | undefined;

	if (!formData?.assessorName?.trim() || !formData?.assessorId?.trim()) {
		return true;
	}

	confirmedAssessorEmail.value = null;

	try {
		const response = await $fetch<{
			isValid: boolean;
			reason: "NOT_FOUND" | "NO_EMAIL" | null;
			email: string | null;
		}>("/api/assessors/verify", {
			method: "POST",
			body: {
				name: formData.assessorName,
				id: formData.assessorId,
			},
		});

		if (response.isValid && response.email) {
			confirmedAssessorEmail.value = response.email;
			return true;
		}

		if (response.reason === "NO_EMAIL") {
			currentAssessorErrorMessage.value = assessorNoEmailMessage;
		} else {
			currentAssessorErrorMessage.value = assessorNotRegisteredMessage;
		}

		confirmedAssessorEmail.value = null;
		return false;
	} catch {
		currentAssessorErrorMessage.value = assessorNotRegisteredMessage;
		confirmedAssessorEmail.value = null;
		return false;
	}
};

const handleSubmit = async () => {
	clearErrors();
	await navigateTo(getUrl("getBrelEmailConfirmation"));
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<NuxtLink :href="getUrl('outputs')" class="govuk-back-link govuk-!-margin-bottom-6 govuk-!-margin-top-0" data-testid="backLink">
		Back to results
	</NuxtLink>

	<GovErrorSummary
		:error-list="errorMessages"
		test-id="getBrelReportErrorSummary"
	/>

	<h1 class="govuk-heading-l">{{ title }}</h1>

	<p class="govuk-body">
		Complete the relevant information below. This will show on the report.
	</p>

	<FormKit
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="handleSubmit"
		@submit-invalid="handleInvalidSubmit"
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
			type="govInputTextArea"
			label="Dwelling address"
			name="dwellingAddress"
			validation="required"
		/>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

		<fieldset class="govuk-fieldset section-spacing">
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--l govuk-!-margin-bottom-6">
				<h2 class="govuk-fieldset__heading">Client details</h2>
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
				type="govInputTextArea"
				label="Client address"
				name="clientAddress"
				validation="required"
			/>
		</fieldset>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

		<fieldset id="assessorDetails" class="govuk-fieldset section-spacing">
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--l govuk-!-margin-bottom-6">
				<h2 class="govuk-fieldset__heading">Assessor details</h2>
			</legend>
			<FormKit
				id="assessorName"
				type="govInputText"
				label="Assessor name"
				name="assessorName"
				validation="required|assessorIsRegistered"
				validation-visibility="submit"
				:validation-rules="{ assessorIsRegistered }"
				:validation-messages="{ assessorIsRegistered: currentAssessorErrorMessage }"
			/>
			<FormKit
				id="assessorId"
				type="govInputText"
				label="Assessor ID"
				name="assessorId"
				validation="required|assessorIsRegistered"
				validation-visibility="submit"
				:validation-rules="{ assessorIsRegistered }"
				:validation-messages="{ assessorIsRegistered: currentAssessorErrorMessage }"
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
				test-id="getBrelReport"
				:ignore="true"
			/>
			<GovButton :href="getUrl('outputs')" secondary>
				Return to results
			</GovButton>
		</div>
	</FormKit>
</template>
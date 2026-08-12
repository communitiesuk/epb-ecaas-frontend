<script setup lang="ts">
import { getUrl, type AppliancesData } from "#imports";
import { appliancesDisplayTypes } from "~/utils/display";

const title = "Appliances";
const store = useEcaasStore();

const model = ref(store.dwellingDetails.appliances.data);
const { autoSaveForm } = useForm();

const saveForm = (fields: AppliancesData) => {
	store.$patch({
		dwellingDetails: {
			appliances: {
				data: {
					applianceType: fields.applianceType,
					kitchenExtractorHoodExternal: fields.kitchenExtractorHoodExternal,
				},
				complete: true,
			},
		},
	});
	navigateTo("/dwelling-details");
};

autoSaveForm(model, (state, newData) => {
	state.dwellingDetails.appliances = newData;
});

const isFridgeInChoice = (node: FormKitNode) => {
	const parent = node.at("$parent");

	if (parent && parent.value) {
		const formValue = parent.value as AppliancesData;
		const { applianceType } = formValue;
		return (applianceType && applianceType.includes("Fridge") || applianceType.includes("Fridge-Freezer"));
	} else {
		return true;
	}
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="appliancesErrorSummary"/>

		<FormKit
			id="applianceType"
			type="govCheckboxes"
			name="applianceType"
			label="Select the appliances that will be present in the dwelling"
			help="Select the appliance if it will be installed by the house builder, or there is a marked space to install one. A fridge or a fridge-freezer must be selected."
			:options="appliancesDisplayTypes"
			:validation-rules="{ isFridgeInChoice }"
			validation="required | isFridgeInChoice"
			:validation-messages="{isFridgeInChoice: 'Fridge or Fridge-freezer is required.'}"
		/> 
		<FormKit
			id="kitchenExtractorHoodExternal"	
			type="govBoolean"
			name="kitchenExtractorHoodExternal"
			label="Does the cooker have an extractor hood that extracts to the outside of the building?"
			validation="required"
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingDetails')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
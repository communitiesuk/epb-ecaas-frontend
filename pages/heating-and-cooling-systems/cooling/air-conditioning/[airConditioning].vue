<script setup lang="ts">
import { getUrl } from "#imports";

const title = "Air conditioning system";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const airConditioningData = useItemToEdit("airConditioning", store.heatingAndCoolingSystems.cooling.airConditioning?.data);
const model = ref(airConditioningData?.data);

const saveForm = (fields: AirConditioningData) => {
	store.$patch((state) => {
		const { airConditioning } = state.heatingAndCoolingSystems.cooling;
		const index = getStoreIndex(airConditioning.data);

		airConditioning.data[index] = {
			data: {
				name: fields.name,
				coolingCapacity: fields.coolingCapacity,
				seasonalEnergyEfficiencyRatio: fields.seasonalEnergyEfficiencyRatio,
				convectionFraction: fields.convectionFraction,
				energySupply: fields.energySupply,
			},
			complete: true,
		};
		store.heatingAndCoolingSystems.cooling.airConditioning.complete = false;
	},
	);

	navigateTo("/heating-and-cooling-systems/cooling");
};

autoSaveElementForm<AirConditioningData>({
	model,
	storeData: store.heatingAndCoolingSystems.cooling.airConditioning,
	defaultName: "Air conditioning system",
	onPatch: (state, newData, index) => {
		state.heatingAndCoolingSystems.cooling.airConditioning.data[index] = newData;
		state.heatingAndCoolingSystems.cooling.airConditioning.complete = false;
	},
});

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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="airConditioningErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="coolingCapacity"
			type="govInputWithSuffix"
			label="Cooling capacity"
			help="Enter the maximum cooling capacity of the system"
			name="coolingCapacity"
			validation="required | number"
			suffix-text="kW"
		/>
		<FormKit
			id="seasonalEnergyEfficiencyRatio"
			type="govInputFloat"
			label="Seasonal energy efficiency ratio"
			name="seasonalEnergyEfficiencyRatio"
			:help="false ? 'A higher seasonal efficiency ratio indicates better energy efficiency across a typical cooling season. Typical ranges are between 4.0 and 7.0.' : undefined"
			validation="required | number | between:0,25"
			suffix-text="kW"
		/>
		<FormKit
			id="convectionFraction"
			type="govInputFloat"
			label="Convection fraction"
			name="convectionFraction"
			help="Enter the proportion of cool air the air conditioning unit emits through convection. Typically this is 1 as all cooling is by convection."
			validation="required | number | between:0,1"
		/>
		<FieldsEnergySupplies
			id="energySupply"
			name="energySupply"
			label="Energy source"
			help="Select the relevant energy supply that has been added previously"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('cooling')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
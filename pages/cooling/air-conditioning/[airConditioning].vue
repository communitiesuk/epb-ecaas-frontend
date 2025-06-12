<script setup lang="ts">
const title = "Air conditioning";
const store = useEcaasStore();
const { saveToList } = useForm();

const airConditioningData = useItemToEdit('airConditioning', store.cooling.airConditioning.data);
const model: Ref<AirConditioningData> = ref(airConditioningData!);

const saveForm = (fields: AirConditioningData) => {
	store.$patch((state) => {
		const {airConditioning} = state.cooling;

		const airConditioningItem: AirConditioningData = {
			name: fields.name,
			coolingCapacity: fields.coolingCapacity,
			seasonalEnergyEfficiencyRatio: fields.seasonalEnergyEfficiencyRatio,
			convectionFraction: fields.convectionFraction
		};

		saveToList(airConditioningItem, airConditioning);
		store.cooling.airConditioning.complete = false;
	});

	navigateTo("/cooling");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
			help="Maximum cooling capacity of the system"
			name="coolingCapacity"
			validation="required | number"
			suffix-text="kW"
		/>
		<FormKit
			id="seasonalEnergyEfficiencyRatio"
			type="govInputFloat"
			label="Seasonal energy efficiency ratio"
			name="seasonalEnergyEfficiencyRatio"
			help="This value represents how efficiently the system performs across a typical cooling season. A higher SEER means better energy efficiency. Typical ranges are between 4.0 - 7.0."
			validation="required | number | between:0,25"
			suffix-text="kW"
		/>
		<FormKit
			id="convectionFraction"
			type="govInputFloat"
			label="Convection fraction"
			name="convectionFraction"
			help="This is the proportion of the system’s sensible cooling output that is delivered through air movement (convection), as opposed to radiant cooling. For most ducted or wall-mounted air conditioning systems, this value is typically 1.0, meaning all cooling is by convection."
			validation="required | number | between:0,1"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
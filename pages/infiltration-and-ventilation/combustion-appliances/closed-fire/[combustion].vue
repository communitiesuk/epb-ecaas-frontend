<script setup lang="ts">
const title = "Closed fire";
const store = useEcaasStore();
const { saveToList } = useForm();

const applianceData = useItemToEdit('combustion', store.infiltrationAndVentilation.combustionAppliances.closedFire.data);
const model: Ref<CombustionApplianceData> = ref(applianceData!);

const saveForm = (fields: CombustionApplianceData) => {
	store.$patch((state) => {
		const {closedFire} = state.infiltrationAndVentilation.combustionAppliances;

		const appliance: CombustionApplianceData = {
			name: fields.name,
			airSupplyToAppliance: fields.airSupplyToAppliance,
			exhaustMethodFromAppliance: fields.exhaustMethodFromAppliance,
			typeOfFuel: fields.typeOfFuel,
		};

		saveToList(appliance, closedFire);
		closedFire.complete = true;
	});

	navigateTo("/infiltration-and-ventilation/combustion-appliances");
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
		<GovErrorSummary :error-list="errorMessages" test-id="closedFireErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FieldsAirSupplyToAppliance id="airSupplyToAppliance" name="airSupplyToAppliance"/>
		<FieldsExhaustMethodFromAppliance id="exhaustMethodFromAppliance" name="exhaustMethodFromAppliance"/>
		<FieldsTypeOfFuel id="typeOfFuel" name="typeOfFuel"/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>

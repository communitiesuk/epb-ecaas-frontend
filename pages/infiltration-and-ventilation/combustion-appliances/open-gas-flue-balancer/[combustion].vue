<script setup lang="ts">

const title = "Open gas flue balancer";
const store = useEcaasStore();
const route = useRoute();

const applianceData = useItemToEdit('combustion', store.infiltrationAndVentilation.combustionAppliances.openGasFlueBalancer.data);
const model: Ref<CombustionApplianceData> = ref(applianceData!);

const saveForm = (fields: CombustionApplianceData) => {
	store.$patch((state) => {
		const {combustionAppliances} = state.infiltrationAndVentilation;

		if (!combustionAppliances.openGasFlueBalancer.data) {
			combustionAppliances.openGasFlueBalancer.data = [];
		}

		const appliance: CombustionApplianceData = {
			name: fields.name,
			airSupplyToAppliance: fields.airSupplyToAppliance,
			exhaustMethodFromAppliance: fields.exhaustMethodFromAppliance,
			typeOfFuel: fields.typeOfFuel,
		};

		if (route.params.combustion && route.params.combustion !== 'create') {
			const index = parseInt(route.params.combustion as string);
			combustionAppliances.openGasFlueBalancer.data[index] = appliance;
		} else {
			combustionAppliances.openGasFlueBalancer.data.push(appliance);
		}

		combustionAppliances.openGasFlueBalancer.complete = true;
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
		<GovErrorSummary :error-list="errorMessages" test-id="openGasFlueBalancerErrorSummary"/>
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

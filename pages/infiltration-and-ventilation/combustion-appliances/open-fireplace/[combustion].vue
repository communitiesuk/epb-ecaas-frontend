<script setup lang="ts">
import { CombustionApplianceType } from '~/schema/api-schema.types';

const title = "Open fireplace";
const store = useEcaasStore();
const { saveToList } = useForm();

const applianceData = useItemToEdit('combustion', store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.open_fireplace].data);
const model: Ref<CombustionApplianceData> = ref(applianceData!);

const saveForm = (fields: CombustionApplianceData) => {
	store.$patch((state) => {
		const { [CombustionApplianceType.open_fireplace]: openFireplace } = state.infiltrationAndVentilation.combustionAppliances;

		const appliance: CombustionApplianceData = {
			name: fields.name,
			airSupplyToAppliance: fields.airSupplyToAppliance,
			exhaustMethodFromAppliance: fields.exhaustMethodFromAppliance,
			typeOfFuel: fields.typeOfFuel,
		};

		saveToList(appliance, openFireplace);
		openFireplace.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="openFireplaceErrorSummary"/>
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

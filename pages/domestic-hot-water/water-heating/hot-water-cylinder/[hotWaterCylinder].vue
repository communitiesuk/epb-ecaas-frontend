<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import type { HotWaterCylinderData } from '~/stores/ecaasStore.types';

const title = "Hot water cylinder";
const store = useEcaasStore();
const { saveToList } = useForm();

const hotWaterCylinderData = useItemToEdit('hotWaterCylinder', store.domesticHotWater.waterHeating.hotWaterCylinder.data);
const model: Ref<HotWaterCylinderData> = ref(hotWaterCylinderData!);

const saveForm = (fields: HotWaterCylinderData) => {
	store.$patch((state) => {
		const {hotWaterCylinder} = state.domesticHotWater.waterHeating;

		const hotWaterCylinderItem: HotWaterCylinderData = {
			id: uuidv4(),
			name: fields.name,
			heatSource: fields.heatSource,
			tankVolume: fields.tankVolume,
			dailyEnergyLoss: fields.dailyEnergyLoss
		};

		saveToList(hotWaterCylinderItem, hotWaterCylinder);
		hotWaterCylinder.complete = false;
	});

	navigateTo("/domestic-hot-water/water-heating");
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="hotWaterCylinderErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FieldsHeatGenerators
			id="heatSource"
			name="heatSource"
			label="Heat source"
			help="Select the relevant heat source that has been added previously"
		/>
		<FormKit
			id="tankVolume"
			type="govInputWithSuffix"
			label="Tank volume"
			help="Enter the total internal capacity of the tank"
			name="tankVolume"
			validation="required | number | min:0 | max:200"
			suffix-text="m³"
		/>
		<FormKit
			id="dailyEnergyLoss"
			type="govInputWithSuffix"
			label="Daily energy loss"
			help="Enter the estimated energy lost from the tank per day"
			name="dailyEnergyLoss"
			validation="required | number | min:0 | max:200"
			suffix-text="kWh"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
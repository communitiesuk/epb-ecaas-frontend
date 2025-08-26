<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { litre, type Volume } from '~/utils/units/volume';
import type { HotWaterCylinderData } from '~/stores/ecaasStore.types';
import { unitValue } from '~/utils/units/types';

const title = "Hot water cylinder";
const store = useEcaasStore();
const { saveToList } = useForm();

const hotWaterCylinderData = useItemToEdit('hotWaterCylinder', store.domesticHotWater.waterHeating.hotWaterCylinder.data);

if (typeof hotWaterCylinderData?.storageCylinderVolume === 'number') {
	hotWaterCylinderData.storageCylinderVolume = unitValue(hotWaterCylinderData.storageCylinderVolume, litre);
}

const model: Ref<HotWaterCylinderData> = ref(hotWaterCylinderData!);

const saveForm = (fields: HotWaterCylinderData) => {
	store.$patch((state) => {
		const {hotWaterCylinder} = state.domesticHotWater.waterHeating;

		const hotWaterCylinderItem: HotWaterCylinderData = {
			id: uuidv4(),
			name: fields.name,
			heatSource: fields.heatSource,
			storageCylinderVolume: fields.storageCylinderVolume,
			dailyEnergyLoss: fields.dailyEnergyLoss
		};

		saveToList(hotWaterCylinderItem, hotWaterCylinder);
		hotWaterCylinder.complete = false;
	});

	navigateTo("/domestic-hot-water/water-heating");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();

const withinMinAndMax = (node: FormKitNode, min: number, max: number) => {
	const value = node.value as Volume;
	return value.amount >= min && value.amount <= max;
};
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
			id="storageCylinderVolume"
			name="storageCylinderVolume"
			label="Storage cylinder volume"
			help="Enter the total internal capacity of the tank"
			type="govInputWithUnit"
			:unit="litre"
			:validation-rules="{ withinMinAndMax }"
			validation="required | withinMinAndMax:0,200000"
			:validation-messages="{
				withinMinAndMax: `Storage cylinder volume must be at least 0 and no more than 200,000 ${litre.name}.`,
			}"
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
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
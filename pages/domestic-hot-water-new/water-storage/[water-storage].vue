<script setup lang="ts">
import { litre, type Volume } from "~/utils/units/volume";
import type { HotWaterCylinderData, WaterStorageData } from "~/stores/ecaasStore.schema";
import { getUrl } from "~/utils/page";

const title = "Water storage";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const waterStorageStoreData = store.domesticHotWaterNew.waterStorage.data;
const index = getStoreIndex(waterStorageStoreData);
const waterStorageData = waterStorageStoreData[index] as EcaasForm<WaterStorageData>;
const model = ref(waterStorageData?.data as WaterStorageData);

if (waterStorageData !== undefined
    && waterStorageData.data !== undefined
    && waterStorageData.data.typeOfWaterStorage === "hotWaterCylinder"
    && typeof waterStorageData.data.storageCylinderVolume === "number"
) {
    if (typeof waterStorageData?.data?.storageCylinderVolume === "number") {
        waterStorageData.data.storageCylinderVolume = unitValue(
            waterStorageData.data.storageCylinderVolume,
            litre,
        );
    }
}

const saveForm = (fields: HotWaterCylinderData) => {
	store.$patch({
		domesticHotWaterNew: {
			waterStorage: {
                data: [],
            }
		},
	});
	navigateTo("/domestic-hot-water-new");
};
			
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const withinMinAndMaxVolume = (node: FormKitNode, min: number, max: number) => {
	const value = node.value as Volume;
	return value.amount >= min && value.amount <= max;
};

const waterStorages = [
    ["hotWaterCylinder", "Hot water cylinder"],
    ["smartHotWaterTank", "Smart hot water cylinder"],
] as [string, string][]

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
		<GovErrorSummary :error-list="errorMessages" test-id="waterStorageErrorSummary"/>
        <FormKit
			id="typeOfWaterStorage"
			type="govRadios"
			:options="new Map(waterStorages)"
			label="Type of water storage"
			validation="required"
		>
		</FormKit>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="storageCylinderVolume"
			name="storageCylinderVolume"
			label="Storage cylinder volume"
			help="Enter the total internal capacity of the tank"
			type="govInputWithUnit"
			:unit="litre"
			:validation-rules="{ withinMinAndMaxVolume }"
			validation="required | withinMinAndMax:0,200000"
			:validation-messages="{
				withinMinAndMax: `Storage cylinder volume must be at least 0 and no more than 200,000 ${litre.name}.`,
			}"
			data-field="HotWaterSource['hw cylinder'].volume"
		/>
		<FormKit
			id="dailyEnergyLoss"
			type="govInputWithSuffix"
			label="Daily energy loss"
			help="Enter the estimated energy lost from the tank per day"
			name="dailyEnergyLoss"
			validation="required | number | min:0 | max:200"
			suffix-text="kWh"
			data-field="HotWaterSource['hw cylinder'].daily_losses"
		/>
        <FieldsHeatGenerators
			id="heatSource"
			name="heatSource"
			label="Heat source"
			help="Select the relevant heat source that has been added previously"
		/>
        <FormKit
			id="areaOfHeatExchanger"
			type="govInputWithSuffix"
			label="Area of heat exchanger installed"
		    suffix-text="m²"
			name="areaOfHeatExchanger"
			validation="required | number"
		/>
        <FormKit
			id="heaterPosition"
			type="govInputFloat"
			label="Heater position in the cylinder"
			name="heaterPosition"
			validation="required | number | min:0 | max:1"
			help="Enter a number between 0 and 1. 0 is at the bottom and 1 is at the top."
		/>
        <FormKit
            id="thermostatPosition"
            type="govInputFloat"
            label="Thermostat position in the cylinder"
            name="thermostatPosition"
            validation="required | number | min:0 | max:1"
            help="Enter a number between 0 and 1. 0 is at the bottom and 1 is at the top."
         />   
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('domesticHotWaterNew')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
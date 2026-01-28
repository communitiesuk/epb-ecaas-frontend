<script setup lang="ts">
import { litre, type Volume } from "~/utils/units/volume";
import type { WaterStorageData } from "~/stores/ecaasStore.schema";
import { getUrl } from "~/utils/page";
import { v4 as uuidv4 } from "uuid";
import { FieldsHeatSources } from "#components";

const title = "Water storage";
const store = useEcaasStore();
const route = useRoute();

const { autoSaveElementForm, getStoreIndex } = useForm();

const waterStorageStoreData = store.domesticHotWaterNew.waterStorage.data;
const index = getStoreIndex(waterStorageStoreData);
const waterStorageData = waterStorageStoreData[index] as EcaasForm<WaterStorageData>;
const model = ref(waterStorageData?.data);
const id = waterStorageData?.data.id ?? uuidv4();

if (waterStorageData?.data?.typeOfWaterStorage === "hotWaterCylinder"
    && typeof waterStorageData.data.storageCylinderVolume === "number"
) {
	waterStorageData.data.storageCylinderVolume = unitValue(
		waterStorageData.data.storageCylinderVolume,
		litre,
	);
}

const saveForm = (fields: WaterStorageData) => {
	store.$patch((state) => {
		const { waterStorage } = state.domesticHotWaterNew;

		const commonFields = {
			name: fields.name,
			id,
			heatSource: fields.heatSource,	
			heaterPosition: fields.heaterPosition,
		};

		let waterStorageItem: EcaasForm<WaterStorageData>;

		if (fields.typeOfWaterStorage === "hotWaterCylinder") {
			waterStorageItem = {
				data: {
					...commonFields,
					typeOfWaterStorage: fields.typeOfWaterStorage,
					storageCylinderVolume: fields.storageCylinderVolume,
					initialTemperature: fields.initialTemperature,
					dailyEnergyLoss: fields.dailyEnergyLoss,
					areaOfHeatExchanger: fields.areaOfHeatExchanger,
					thermostatPosition: fields.thermostatPosition,
				},
				complete: true,
			};
		} else if (fields.typeOfWaterStorage === "smartHotWaterTank") {
			waterStorageItem = {
				data: {
					...commonFields,
					typeOfWaterStorage: fields.typeOfWaterStorage,
					productReference: fields.productReference,
				},
				complete: true,
			};
		} else {
			throw new Error("Invalid water storage type");
		}

		waterStorage.data[index] = waterStorageItem;
		waterStorage.complete = false;
	});
	navigateTo("/domestic-hot-water-new");
};
			
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const withinMinAndMaxVolume = (node: FormKitNode, min: number, max: number) => {
	const value = node.value as Volume;
	return value.amount >= min && value.amount <= max;
};

autoSaveElementForm<WaterStorageData>({
	model,
	storeData: store.domesticHotWaterNew.waterStorage,
	defaultName: "Water storage",
	onPatch: (state, newData, index) => {
		state.domesticHotWaterNew.waterStorage.data[index] = newData;
		state.domesticHotWaterNew.waterStorage.complete = false;
	},
});

const isProductSelected = () => {
	if (waterStorageData.data.typeOfWaterStorage !== "smartHotWaterTank") {
		return false;
	}
	return waterStorageData?.data.productReference ? true : false;
};

const waterStorages = [
	["hotWaterCylinder", "Hot water cylinder"],
	["smartHotWaterTank", "Smart hot water cylinder"],
] as [string, string][];

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
			name="typeOfWaterStorage"
			type="govRadios"
			:options="new Map(waterStorages)"
			label="Type of water storage"
			validation="required"
		/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			v-if="model.typeOfWaterStorage === 'smartHotWaterTank'"	
			id="selectSmartHotWaterTank"
			type="govPcdbProduct"
			label="Select a smart hot water tank"
			name="productReference"
			:validation-rules="{ isProductSelected }"
			validation="required | isProductSelected"
			help="Select the smart hot water tank from the PCDB using the button below."
			:selected-product-reference="model.productReference"
			:selected-product-type="model.typeOfWaterStorage"
			:page-url="route.fullPath"
			:page-index="index"
		/>
		<FormKit
			v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
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
			v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
			id="initialTemperature"
			type="govInputWithSuffix"
			label="Initial temperature"
			name="initialTemperature"
			validation="required | number"
			suffix-text="°C"
		/>
		<FormKit
			v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
			id="dailyEnergyLoss"
			type="govInputWithSuffix"
			label="Daily energy loss"
			help="Enter the estimated energy lost from the tank per day"
			name="dailyEnergyLoss"
			validation="required | number | min:0 | max:200"
			suffix-text="kWh"
			data-field="HotWaterSource['hw cylinder'].daily_losses"
		/>
		<FieldsHeatSources
			id="heatSource"
			name="heatSource"
			label="Heat source"
			help="Select the relevant heat source that has been added previously"
		/>
		<FormKit
			v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
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
			v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
			id="thermostatPosition"
			type="govInputFloat"
			label="Thermostat position in the cylinder"
			name="thermostatPosition"
			validation="required | number | min:0 | max:1"
			help="Enter a number between 0 and 1. 0 is at the bottom and 1 is at the top."
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('domesticHotWaterNew')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
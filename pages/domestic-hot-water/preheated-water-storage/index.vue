<script setup lang="ts">
import { litre, type Volume } from "~/utils/units/volume";
import type { PreheatedWaterStorageData } from "~/stores/ecaasStore.schema";
import { getUrl } from "~/utils/page";
import { v4 as uuidv4 } from "uuid";
import { hasPackagedProduct } from "#imports";

const title = "Preheated water cylinder";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

const { mounted } = useMounted();

const preheatedStoreData = store.domesticHotWater.preheatedWaterStorage.data;
const preheatedData = preheatedStoreData[0] as EcaasForm<PreheatedWaterStorageData>;
const model = ref<PreheatedWaterStorageData>({
	...preheatedData?.data,
	typeOfWaterStorage: "hotWaterCylinder",
	name: preheatedData?.data.name ?? waterStorageTypes.hotWaterCylinder,

} as PreheatedWaterStorageData);

const id = preheatedData?.data.id ?? uuidv4();

const saveForm = (fields: PreheatedWaterStorageData) => {
	store.$patch((state) => {
		const { preheatedWaterStorage } = state.domesticHotWater;

		const commonFields = {
			name: fields.name,
			id,
			heaterPosition: fields.heaterPosition,
			coldWaterSource: fields.coldWaterSource,
		};

		let waterStorageItem: EcaasForm<PreheatedWaterStorageData>;

		if (fields.typeOfWaterStorage === "hotWaterCylinder") {
			waterStorageItem = {
				data: {
					...commonFields,
					typeOfWaterStorage: fields.typeOfWaterStorage,
					storageCylinderVolume: fields.storageCylinderVolume,
					dailyEnergyLoss: fields.dailyEnergyLoss,
					packagedProductReference: fields.packagedProductReference,
					heatSourceId: fields.heatSourceId,
				},
				complete: true,
			};
		} else {
			throw new Error("Invalid water storage type");
		}

		preheatedWaterStorage.data[0] = waterStorageItem;
		preheatedWaterStorage.complete = false;
	});
	navigateTo(getUrl("domesticHotWater"));
};
			
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const withinMinAndMaxVolume = (node: FormKitNode, min: number, max: number) => {
	const value = node.value as Volume;
	return value.amount >= min && value.amount <= max;
};

autoSaveForm<PreheatedWaterStorageData>(model, (state, newData) => {
	const storageType = newData.data.typeOfWaterStorage;
	newData.data.id ??= id;
	newData.data.name ??= waterStorageTypes[storageType];
	state.domesticHotWater.preheatedWaterStorage.data = [newData];
});

const waterStorageOptions: Record<Exclude<WaterStorageType, "smartHotWaterTank">, string> = {
	"hotWaterCylinder": "Standard water cylinder",
};

const wwhrs = store.domesticHotWater.wwhrs.data
	.filter(x => x.data.wwhrsType === "System A" || x.data.wwhrsType === "System C")
	.map(mapOption("WWHRS"));

const coldWaterSourcesMap = new Map(Object.entries(coldWaterSourceOptions));
const wwhrsMap = new Map(wwhrs);
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
		<template v-if="mounted">
			<FormKit
				id="typeOfWaterStorage"
				name="typeOfWaterStorage"
				type="govRadios"
				:options="waterStorageOptions"
				label="Type of pre-heated water cylinder"
				validation="required"
				:disabled="hasPackagedProduct(model)"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage !== undefined"
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				validation="required"
			/>
			<template v-if="model.typeOfWaterStorage === 'hotWaterCylinder'">
				<FormKit
					id="storageCylinderVolume"
					name="storageCylinderVolume"
					label="Storage cylinder volume"
					help="Enter the total internal capacity of the tank"
					type="govInputWithUnit"
					:unit="litre"
					:validation-rules="{ withinMinAndMaxVolume }"
					validation="required | withinMinAndMaxVolume:1,1000"
					:validation-messages="{
						withinMinAndMaxVolume: `Storage cylinder volume must be at least 0 and no more than 200,000 ${litre.name}.`,
					}"
					data-field="PreHeatedWaterSource['preheated tank'].volume"
					:disabled="hasPackagedProduct(model)"
				/>
				<FormKit
					id="dailyEnergyLoss"
					type="govInputWithSuffix"
					label="Daily standing loss"
					help="Enter the estimated energy lost from the tank per day"
					name="dailyEnergyLoss"
					validation="required | number | min:0 | max:200"
					suffix-text="kWh/day"
					data-field="PreHeatedWaterSource['preheated tank'].daily_losses"
					:disabled="hasPackagedProduct(model)"
				/>
			</template>
			<FormKit
				v-if="model.typeOfWaterStorage !== undefined"
				id="heaterPosition"
				type="govInputFloat"
				label="Heater position in the cylinder"
				name="heaterPosition"
				validation="required | number | min:0 | max:1"
				help="Enter a number between 0 and 1, rounded to one decimal place. 0 is at the bottom, 1 is at the top."
			/>
			<FieldsHotWaterHeatSources
				id="heatSourceId"
				name="heatSourceId"
				label="Heat source"
				help="Select the relevant heat source that has been added previously"
				validation="required"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage !== undefined"
				id="coldWaterSource"
				type="govRadios"
				label="Cold water source"
				:options="new Map([...wwhrsMap, ...coldWaterSourcesMap])"
				name="coldWaterSource"
				validation="required"
			/>
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
				<GovButton :href="getUrl('domesticHotWater')" secondary>Save progress</GovButton>
			</div>
		</template>
	</FormKit>
</template>
<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, type HeatSourceData } from "#imports";
import { heatSourceTypes } from "../../../../utils/display";

const title = "Heat source";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);
const heatSourceData = useItemToEdit("heatSource", heatSourceStoreData);
const model = ref(heatSourceData?.data as HeatSourceData);
const id =  heatSourceData?.data.id ?? uuidv4();

export type heatPumpModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatPump" }>;
export type boilerModelType = Extract<HeatSourceData, { typeOfHeatSource: "boiler" }>;
export type heatBatteryModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatBattery" }>;
export type solarThermalModelType = Extract<HeatSourceData, { typeOfHeatSource: "solarThermalSystem" }>;

const saveForm = (fields: HeatSourceData) => {
	store.$patch((state) => {
		const { heatSource } = state.spaceHeatingNew;

		const commonFields = {
			id,
			name: fields.name,
		};

		let heatSourceItem: EcaasForm<HeatSourceData>;

		if (fields.typeOfHeatSource === "heatPump") {
			heatSourceItem = {
				data: {
					...commonFields,
					typeOfHeatSource: fields.typeOfHeatSource,
					typeOfHeatPump: fields.typeOfHeatPump,
					productReference: fields.productReference,
				},
				complete: true,
			};
		} else if (fields.typeOfHeatSource === "boiler") {
			heatSourceItem = {
				data: {
					...commonFields,
					typeOfHeatSource: fields.typeOfHeatSource,
					typeOfBoiler: fields.typeOfBoiler,
					productReference: fields.productReference,
					locationOfBoiler: fields.locationOfBoiler,
				},
				complete: true,
			};
		} else if (fields.typeOfHeatSource === "heatBattery") {
			heatSourceItem = {
				data: {
					...commonFields,
					typeOfHeatSource: fields.typeOfHeatSource,
					typeOfHeatBattery: fields.typeOfHeatBattery,
					productReference: fields.productReference,
					numberOfUnits: fields.numberOfUnits,
					energySupply: fields.energySupply,
				},
				complete: true,
			};
		} else if (fields.typeOfHeatSource === "solarThermalSystem") {
			heatSourceItem = {
				data: {
					...commonFields,
					typeOfHeatSource: fields.typeOfHeatSource,
					locationOfCollectorLoopPiping: fields.locationOfCollectorLoopPiping,
					collectorModuleArea: fields.collectorModuleArea,
					numberOfCollectorModules: fields.numberOfCollectorModules,
					peakCollectorEfficiency: fields.peakCollectorEfficiency,
					incidenceAngleModifier: fields.incidenceAngleModifier,
					firstOrderHeatLossCoefficient: fields.firstOrderHeatLossCoefficient,
					secondOrderHeatLossCoefficient: fields.secondOrderHeatLossCoefficient,
					heatLossCoefficientOfSolarLoopPipe: fields.heatLossCoefficientOfSolarLoopPipe,
					collectorMassFlowRate: fields.collectorMassFlowRate,
					powerOfCollectorPump: fields.powerOfCollectorPump,
					powerOfCollectorPumpController: fields.powerOfCollectorPumpController,
					pitch: fields.pitch,
					orientation: fields.orientation,
				},
				complete: true,
			};
		} else {
			throw new Error("Invalid heat source type");
		}

		heatSource.data[index] = heatSourceItem;
		heatSource.complete = false;
	});
	
	navigateTo("/space-heating-new");
};

autoSaveElementForm<HeatSourceData>({
	model,
	storeData: store.spaceHeatingNew.heatSource,
	defaultName: "Heat source",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.spaceHeatingNew.heatSource.data[index] = newData;
		state.spaceHeatingNew.heatSource.complete = false;
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary"/>
		<FormKit
			id="typeOfHeatSource"
			type="govRadios"
			label="Type of heat source"
			:options="heatSourceTypes"
			name="typeOfHeatSource"
			validation="required"
		/>
		<HeatPumpSection
			v-if="model?.typeOfHeatSource === 'heatPump'"
			:model="model as heatPumpModelType"/>
		<BoilerSection
			v-if="model?.typeOfHeatSource === 'boiler'"
			:model="model as boilerModelType"/>
		<HeatBatterySection
			v-if="model?.typeOfHeatSource === 'heatBattery'"
			:model="model as heatBatteryModelType"/>
		<SolarThermalSystemSection
			v-if="model?.typeOfHeatSource === 'solarThermalSystem'"
			:model="model as solarThermalModelType"/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('spaceHeatingNew')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, HeatSourceType, type HeatSourceData } from "#imports";
import { heatSourceTypes } from "../../../../utils/display";

const title = "Heat source";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);
const heatSourceData = useItemToEdit("heatSource", heatSourceStoreData);
const model = ref(heatSourceData?.data as HeatSourceData);
const id = heatSourceData?.data.id ?? uuidv4();

type HeatPumpModelType = Extract<HeatSourceData, { typeOfHeatSource: HeatSourceType.heatPump }>;
type BoilerModelType = Extract<HeatSourceData, { typeOfHeatSource: HeatSourceType.boiler }>;
type HeatNetworkModelType = Extract<HeatSourceData, { typeOfHeatSource: HeatSourceType.heatNetwork }>;
type HeatBatteryModelType = Extract<HeatSourceData, { typeOfHeatSource: HeatSourceType.heatBattery }>;
type SolarThermalModelType = Extract<HeatSourceData, { typeOfHeatSource: HeatSourceType.solarThermalSystem }>;

const saveForm = (fields: HeatSourceData) => {
	store.$patch((state) => {
		const { heatSource } = state.spaceHeatingNew;

		const commonFields = {
			id,
			name: fields.name,
		};

		let heatSourceItem: EcaasForm<HeatSourceData>;

		if (fields.typeOfHeatSource ===  HeatSourceType.heatPump) {
			heatSourceItem = {
				data: {
					...commonFields,
					typeOfHeatSource: fields.typeOfHeatSource,
					typeOfHeatPump: fields.typeOfHeatPump,
					productReference: fields.productReference,
				},
				complete: true,
			};
		} else if (fields.typeOfHeatSource === HeatSourceType.boiler) {
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
		} else if (fields.typeOfHeatSource === HeatSourceType.heatNetwork) {
			heatSourceItem = {
				data: {
					...commonFields,
					typeOfHeatSource: fields.typeOfHeatSource,
					typeOfHeatNetwork: fields.typeOfHeatNetwork,
					...(fields.isHeatNetworkInPcdb === true ? {
						isHeatNetworkInPcdb: fields.isHeatNetworkInPcdb,
						productReference: fields.productReference,
						energySupply: fields.energySupply,
					} : {
						isHeatNetworkInPcdb: fields.isHeatNetworkInPcdb,
						emissionsFactor: fields.emissionsFactor,
						outOfScopeEmissionsFactor: fields.outOfScopeEmissionsFactor,
						primaryEnergyFactor: fields.primaryEnergyFactor,
						canEnergyBeExported: fields.canEnergyBeExported,
					}),
					...(fields.usesHeatInterfaceUnits === true ? {
						usesHeatInterfaceUnits: fields.usesHeatInterfaceUnits,
						heatInterfaceUnitProductReference: fields.heatInterfaceUnitProductReference,
					} : {
						usesHeatInterfaceUnits: fields.usesHeatInterfaceUnits,
					}),
				},
				complete: true,
			};
		} else if (fields.typeOfHeatSource === HeatSourceType.heatBattery) {
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
		} else if (fields.typeOfHeatSource === HeatSourceType.solarThermalSystem) {
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

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

watch(
	() => model.value,
	(newData, initialData) => {
		if (!newData?.typeOfHeatSource) return;

		if (
			initialData?.typeOfHeatSource &&
			initialData.typeOfHeatSource !== newData.typeOfHeatSource
		) {
			errorMessages.value = [];
			const validKeys = ["id", "typeOfHeatSource"];
			Object.keys(model.value).forEach((key) => validKeys.includes(key) || delete model.value[key as keyof HeatSourceData]);
			model.value.typeOfHeatSource = newData.typeOfHeatSource;
		}
		if (model.value && !model.value.name) {
			model.value.name = getHeatSourceDefaultName(model.value);
		}
	},
);


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


function updateHeatSource(type: string) {
	watch(() => model.value[`${type}` as keyof HeatSourceData], (newHeatSourceSubtype, initialHeatSourceSubtype) => {
		if (newHeatSourceSubtype !== initialHeatSourceSubtype) {
			if ("productReference" in model.value) {
				model.value.productReference = "";
			}
			const defaultName = getHeatSourceDefaultName(model.value);
			model.value.name = defaultName;
			store.spaceHeatingNew.heatSource.data[index]!.data.name = defaultName;
		}
	},
	);
}
</script>


<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<FormKit
			id="typeOfHeatSource" type="govRadios" label="Type of heat source" :options="heatSourceTypes"
			name="typeOfHeatSource" validation="required" />
		<HeatPumpSection
			v-if="model?.typeOfHeatSource === HeatSourceType.heatPump" :model="model as HeatPumpModelType"
			@update-heat-pump-model="updateHeatSource" />
		<BoilerSection
			v-if="model?.typeOfHeatSource === HeatSourceType.boiler" :model="model as BoilerModelType"
			@update-boiler-model="updateHeatSource" />
		<HeatNetworkSection
			v-if="model?.typeOfHeatSource === HeatSourceType.heatNetwork" :model="model as HeatNetworkModelType"
			@update-heat-network-model="updateHeatSource" />
		<HeatBatterySection
			v-if="model?.typeOfHeatSource === HeatSourceType.heatBattery" :model="model as HeatBatteryModelType"
			@update-heat-battery-model="updateHeatSource" />
		<SolarThermalSystemSection
			v-if="model?.typeOfHeatSource === HeatSourceType.solarThermalSystem"
			:model="model as SolarThermalModelType" />
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('spaceHeatingNew')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
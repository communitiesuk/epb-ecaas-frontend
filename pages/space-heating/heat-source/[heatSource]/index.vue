<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, type HeatSourceData } from "#imports";
import type { RadioOption } from "~/components/form-kit/Radios.vue";

const title = "Heat source";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const heatSourceStoreData = store.spaceHeating.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);
const heatSourceData = useItemToEdit("heatSource", heatSourceStoreData);
const model = ref(heatSourceData?.data as HeatSourceData);
const id = heatSourceData?.data.id ?? uuidv4();
export type HeatPumpModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatPump" }>;
export type BoilerModelType = Extract<HeatSourceData, { typeOfHeatSource: "boiler" }>;
export type HeatNetworkModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
export type HeatBatteryModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatBattery" }>;
export type SolarThermalModelType = Extract<HeatSourceData, { typeOfHeatSource: "solarThermalSystem" }>;

const heatSourceOptions = {
	"heatPump": "Heat pump",
	"boiler": "Boiler",
	"heatNetwork": {
		label: "Heat network",
		disabled: true,
	},
	"heatBattery": "Heat battery",
	"solarThermalSystem": "Solar thermal system",
} as const satisfies Record<HeatSourceType, string | RadioOption>;

const saveForm = (fields: HeatSourceData) => {
	store.$patch((state) => {
		const { heatSource } = state.spaceHeating;

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
		} else if (fields.typeOfHeatSource === "heatNetwork") {
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

	navigateTo("/space-heating");
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
			model.value = { typeOfHeatSource: newData.typeOfHeatSource, id: initialData.id } as HeatSourceData;
		}
		if (model.value && !model.value.name) {
			model.value.name = getHeatSourceDefaultName(model.value);
		}
	},
);


autoSaveElementForm<HeatSourceData>({
	model,
	storeData: store.spaceHeating.heatSource,
	defaultName: "Heat source",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.spaceHeating.heatSource.data[index] = newData;
		state.spaceHeating.heatSource.complete = false;
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
			store.spaceHeating.heatSource.data[index]!.data.name = defaultName;
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
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<FormKit
			id="typeOfHeatSource"
			type="govRadios"
			label="Type of heat source"
			:options="heatSourceOptions"
			name="typeOfHeatSource"
			validation="required" />
		<HeatPumpSection
			v-if="model?.typeOfHeatSource === 'heatPump'"
			:model="model as HeatPumpModelType"
			:index="index"
			@update-heat-pump-model="updateHeatSource" />
		<BoilerSection
			v-if="model?.typeOfHeatSource === 'boiler'"
			:model="model as BoilerModelType"
			:index="index"
			@update-boiler-model="updateHeatSource" />
		<HeatNetworkSection
			v-if="model?.typeOfHeatSource === 'heatNetwork'"
			:model="model as HeatNetworkModelType"
			:index="index"
			@update-heat-network-model="updateHeatSource" />
		<HeatBatterySection
			v-if="model?.typeOfHeatSource === 'heatBattery'"
			:model="model as HeatBatteryModelType"
			:index="index"
			@update-heat-battery-model="updateHeatSource" />
		<SolarThermalSystemSection
			v-if="model?.typeOfHeatSource === 'solarThermalSystem'"
			:model="model as SolarThermalModelType" 
			:index="index" />
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('spaceHeating')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
<script>

</script>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import ElectricStorageHeaterSection from "~/components/ElectricStorageHeaterSection.vue";
import { heatEmitterTypes } from "../../../../utils/display";
import { getHeatEmitterDefaultName, type HeatEmitterFormData } from "../../../../utils/getHeatEmitterDefaultName";
import { getUrl, typeOfHeatEmitter, type WetDistributionSystemData } from "#imports";

export type WetDistributionSystemModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "wetDistributionSystem" }>;
export type RadiatorModelType = Extract<WetDistributionSystemModelType["emitters"][number], { "typeOfHeatEmitter": "radiator" }>;
export type UnderfloorHeatingModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "underfloorHeating" }>;
export type FanCoilModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "fanCoil" }>;
export type WarmAirHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "warmAirHeater" }>;
export type InstantElectricHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "instantElectricHeater" }>;
export type ElectricStorageHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "electricStorageHeater" }>;


const title = "Heat emitters";
const store = useEcaasStore();

const { autoSaveElementForm, getStoreIndex } = useForm();


const heatEmitterStoreData = store.spaceHeating.heatEmitters.data;
const index = getStoreIndex(heatEmitterStoreData);

const heatEmitterData = useItemToEdit("heatEmitter", heatEmitterStoreData);
const model = ref(heatEmitterData?.data);
const id = heatEmitterData?.data?.id ?? uuidv4();



const saveForm = () => {
	store.$patch((state) => {
		const { heatEmitters } = state.spaceHeating;
		const emitter = heatEmitters.data[index];
		if (!emitter) {
			throw new Error("No heat emitter found to save");
		}
		emitter.complete = true;
		heatEmitters.complete = false;
	});
	navigateTo("/space-heating");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

watch(
	() => model.value,
	(newData, initialData) => {
		if (!newData?.typeOfHeatEmitter) return;
		
		if (
			initialData?.typeOfHeatEmitter &&
			initialData.typeOfHeatEmitter !== newData.typeOfHeatEmitter
		) {
			errorMessages.value = [];
			const resetData: Record<string, unknown> = { typeOfHeatEmitter: newData.typeOfHeatEmitter, id: initialData.id };
			if (newData.typeOfHeatEmitter === "wetDistributionSystem") {
				resetData.emitters = [];
			}
			model.value = resetData as HeatEmittingData;
			
		}

		const heatSources = store.spaceHeating.heatSource.data;
		if (heatSources.length === 1 && model.value) {
			const heatSourceId = heatSources[0]?.data.id;
			if ("heatSource" in model.value && heatSourceId) {
				model.value.heatSource = heatSourceId;
			}
		}
		if (model.value && !model.value.name) {
			model.value.name = getHeatEmitterDefaultName(model.value as HeatEmitterFormData);
		}	
	},
	{ deep: true },
);

autoSaveElementForm<HeatEmittingData>({
	model,
	storeData: store.spaceHeating.heatEmitters,
	defaultName: "Heat emitter",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		const existing = state.spaceHeating.heatEmitters.data[index];
		if (existing && "emitters" in existing.data) {
			(newData.data as Record<string, unknown>).emitters = (existing.data as Record<string, unknown>).emitters;
		} else if (newData.data.typeOfHeatEmitter === "wetDistributionSystem" && !("emitters" in newData.data)) {
			(newData.data as Record<string, unknown>).emitters = [];
		}
		if (existing && "complete" in existing) {
			newData.complete = existing.complete;
		}


		state.spaceHeating.heatEmitters.data[index] = newData;
		state.spaceHeating.heatEmitters.complete = false;
	},
});
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovErrorSummary :error-list="errorMessages" test-id="heatEmitterErrorSummary" />
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<FormKit
			id="typeOfHeatEmitter"
			type="govRadios"
			label="Type of heat emitter"
			:options="heatEmitterTypes"
			name="typeOfHeatEmitter"
			validation="required" />
		<WetDistributionSection
			v-if="model?.typeOfHeatEmitter === 'wetDistributionSystem'"
			:model="(model as WetDistributionSystemData)"
			:index="index" />
		<InstantElectricHeaterSection
			v-if="model?.typeOfHeatEmitter === 'instantElectricHeater'"
			:model="(model as InstantElectricHeaterModelType)"
			:index="index" />
		<ElectricStorageHeaterSection
			v-if="model?.typeOfHeatEmitter === typeOfHeatEmitter.electricStorageHeater"
			:model="(model as ElectricStorageHeaterModelType)" 
			:index="index"/>
		<WarmAirHeaterSection
			v-if="model?.typeOfHeatEmitter === 'warmAirHeater'"
			:model="(model as WarmAirHeaterModelType)" />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('spaceHeating')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>

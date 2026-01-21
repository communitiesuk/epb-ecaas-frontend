<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import ElectricStorageHeaterSection from "~/components/ElectricStorageHeaterSection.vue";
import { heatEmitterTypes } from "../../../../utils/display";
import { getHeatEmitterDefaultName, type HeatEmitterFormData } from "../../../../utils/getHeatEmitterDefaultName";
import { getUrl } from "#imports";


export type RadiatorModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "radiator" }>;
export type UnderfloorHeatingModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "underfloorHeating" }>;
export type FanCoilModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "fanCoil" }>;
export type WarmAirHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "warmAirHeater" }>;
export type InstantElectricHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "instantElectricHeater" }>;
export type ElectricStorageHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "electricStorageHeater" }>;


const title = "Heat emitters";
const store = useEcaasStore();

const { autoSaveElementForm, getStoreIndex } = useForm();


const heatEmitterStoreData = store.spaceHeatingNew.heatEmitters.data;
const index = getStoreIndex(heatEmitterStoreData);

const heatEmitterData = useItemToEdit("heatEmitter", heatEmitterStoreData);
const model = ref(heatEmitterData?.data);
const id = heatEmitterData?.data?.id ?? uuidv4();

const saveForm = () => {
	store.$patch((state) => {
		const { heatEmitters } = state.spaceHeatingNew;
		const emitter = heatEmitters.data[index];
		if (!emitter) {
			throw new Error("No heat emitter found to save");
		}
		emitter.complete = true;
		heatEmitters.complete = false;
	});
	navigateTo("/space-heating-new");
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
			model.value = { typeOfHeatEmitter: newData.typeOfHeatEmitter, id: initialData.id } as HeatEmittingData;
			
		}

		const heatSources = store.spaceHeatingNew.heatSource.data;
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
);
autoSaveElementForm<HeatEmittingData>({
	model,
	storeData: store.spaceHeatingNew.heatEmitters,
	defaultName: "Heat emitter",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.spaceHeatingNew.heatEmitters.data[index] = newData;
		state.spaceHeatingNew.heatEmitters.complete = false;
	},
});
function updateHeatEmitter(type: string) {
	watch(() => model.value?.[`${type}` as keyof typeof model.value], (newHeatEmitterSubtype, initialHeatEmitterSubtype) => {
		if (newHeatEmitterSubtype !== initialHeatEmitterSubtype) {
			const defaultName = getHeatEmitterDefaultName(model.value as HeatEmitterFormData);
			if (model.value) {
				model.value.name = defaultName;
				if (store.spaceHeatingNew.heatEmitters.data[index]) {
					store.spaceHeatingNew.heatEmitters.data[index].data.name = defaultName;
				}
			}
		}
	},
	);
}	;
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
		<RadiatorSection
			v-if="model?.typeOfHeatEmitter === 'radiator'"
			:model="model as RadiatorModelType"
			:index="index"
			@update-radiator-model="updateHeatEmitter" />
		<UnderfloorHeatingSection
			v-if="model?.typeOfHeatEmitter === 'underfloorHeating'"
			:model="model as UnderfloorHeatingModelType"
			:index="index" />
		<FanCoilSection
			v-if="model?.typeOfHeatEmitter === 'fanCoil'" 
			:model="model as FanCoilModelType"
			:index="index" />
		<InstantElectricHeaterSection
			v-if="model?.typeOfHeatEmitter === 'instantElectricHeater'"
			:model="model as InstantElectricHeaterModelType" />
		<ElectricStorageHeaterSection
			v-if="model?.typeOfHeatEmitter === 'electricStorageHeater'"
			:model="model as ElectricStorageHeaterModelType" 
			:index="index"/>
		<WarmAirHeaterSection
			v-if="model?.typeOfHeatEmitter === 'warmAirHeater'"
			:model="model as WarmAirHeaterModelType" />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('spaceHeatingNew')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>

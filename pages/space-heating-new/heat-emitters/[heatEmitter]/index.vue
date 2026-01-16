<script setup lang="ts">
import ElectricStorageHeaterSection from "~/components/ElectricStorageHeaterSection.vue";
import { heatEmitterTypes } from "../../../../utils/display";

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
const saveForm = () => {

	store.$patch((state) => {
		const { heatEmitters } = state.spaceHeatingNew;

		heatEmitters.data[index]!.complete = true;
	});

};
const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
		<RadiatorSection v-if="model?.typeOfHeatEmitter === 'radiator'" :model="model as RadiatorModelType" />
		<UnderfloorHeatingSection
			v-if="model?.typeOfHeatEmitter === 'underfloorHeating'"
			:model="model as UnderfloorHeatingModelType" />
		<FanCoilSection v-if="model?.typeOfHeatEmitter === 'fanCoil'" :model="model as FanCoilModelType" />
		<InstantElectricHeaterSection
			v-if="model?.typeOfHeatEmitter === 'instantElectricHeater'"
			:model="model as InstantElectricHeaterModelType" />
		<ElectricStorageHeaterSection
			v-if="model?.typeOfHeatEmitter === 'electricStorageHeater'"
			:model="model as ElectricStorageHeaterModelType" />
		<WarmAirHeaterSection
			v-if="model?.typeOfHeatEmitter === 'warmAirHeater'"
			:model="model as WarmAirHeaterModelType" />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<!-- <GovButton :href="getUrl('spaceHeatingNew')" secondary test-id="saveProgress">Save progress</GovButton> -->
		</div>
	</FormKit>
</template>

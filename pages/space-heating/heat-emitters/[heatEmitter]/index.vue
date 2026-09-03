<script setup lang="ts">
import { getUrl, typeOfHeatEmitter, type WetDistributionSystemData } from "#imports";
import { v4 as uuidv4 } from "uuid";
import ElectricStorageHeaterSection from "~/components/ElectricStorageHeaterSection.vue";
import { heatEmitterTypes } from "../../../../utils/display";
import { getHeatEmitterDefaultName, type HeatEmitterFormData } from "../../../../utils/getHeatEmitterDefaultName";

export type WetDistributionSystemModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "wetDistributionSystem" }>;
export type RadiatorModelType = Extract<WetDistributionSystemModelType["emitters"][number], { "typeOfHeatEmitter": "radiator" }>;
export type UnderFloorHeatingModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "underFloorHeating" }>;
export type FanCoilModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "fanCoil" }>;
export type WarmAirHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "warmAirHeater" }>;
export type InstantElectricHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "instantElectricHeater" }>;
export type ElectricStorageHeaterModelType = Extract<HeatEmittingData, { "typeOfHeatEmitter": "electricStorageHeater" }>;

const title = "Heat emitters";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();
const { handleInvalidSubmit, errorMessages, addError, clearErrors } = useErrorSummary();

const { mounted } = useMounted();

const heatEmitterStoreData = store.spaceHeating.heatEmitters.data;
const index = getStoreIndex(heatEmitterStoreData);

const heatEmitterData = useItemToEdit("heatEmitter", heatEmitterStoreData);
const model = ref(heatEmitterData?.data);
const id = heatEmitterData?.data?.id ?? uuidv4();

const incompatibleEnergySource = ref(false);
const incompatibleEnergySourceFuel = ref<string | undefined>();
const emittersValid = ref(false);
const brokenEmitterIndex = ref<number | null>(null);

function resetAllHeatEmitterRankings(state: EcaasState) {
	state.spaceHeating.heatEmitters.data.forEach((heatEmitter) => {
		const data = heatEmitter.data as { heatingRank?: number };
		data.heatingRank = undefined;
	});
}

function markHeatingControlsAsInProgress(state: EcaasState) {
	state.spaceHeating.heatingControls.complete = false;
	state.spaceHeating.heatingControls.data.forEach((heatingControl) => {
		heatingControl.complete = false;
	});
}

const saveForm = () => {
	clearErrors();

	if (incompatibleEnergySource.value) {
		addIncompatibleEnergySourceError();
	}

	addEmittersError();

	if (!wetDistributionEmittersValid.value || incompatibleEnergySource.value) {
		window.scrollTo(0, 0);
		return;
	}

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
		markHeatingControlsAsInProgress(state);
		resetAllHeatEmitterRankings(state);
	},
});

const addIncompatibleEnergySourceError = () => {
	if (!incompatibleEnergySource.value) return;

	addError({
		id: "emittersSection",
		text: `This product uses ${incompatibleEnergySourceFuel.value} which hasn't been added as an energy source for this dwelling. To change this go to General details.`,       
	});
};

const addEmittersError = () => {
	if (!wetDistributionEmittersValid.value) {
		addError({
			id: "emittersSection",
			text: "Complete all fields in the Emitters section before marking the heat emitters section as complete.",
		});
	}
};

const wetDistributionEmittersValid = computed(() => {
	if (model.value?.typeOfHeatEmitter !== "wetDistributionSystem") {
		return true;
	}

	return emittersValid.value;
});

const handleSubmitInvalid = (node: FormKitNode) => {
	handleInvalidSubmit(node);
	addEmittersError();
	addIncompatibleEnergySourceError();

	window.scrollTo(0, 0);
};

function handleIncompatibleEnergySource(value: boolean, fuel?: string, emitterIndex?: number) {
	incompatibleEnergySource.value = value;
	incompatibleEnergySourceFuel.value = fuel;
    
	if (value && emitterIndex !== undefined) {
		brokenEmitterIndex.value = emitterIndex;
	} else if (!value) {
		brokenEmitterIndex.value = null;
	}
}

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
		@submit-invalid="handleSubmitInvalid">
		<FormKit
			id="typeOfHeatEmitter"
			type="govRadios"
			label="Type of heat emitter"
			:options="heatEmitterTypes"
			name="typeOfHeatEmitter"
			validation="required" />
		<template v-if="mounted">
			<WetDistributionSection
				v-if="model?.typeOfHeatEmitter === 'wetDistributionSystem'"
				:model="(model as WetDistributionSystemData)"
				:index="index"
				:auto-open-index="brokenEmitterIndex"
				:on-incompatible-energy-source="handleIncompatibleEnergySource"
				@emitters-validity-change="emittersValid = $event"
			/>
			<InstantElectricHeaterSection
				v-if="model?.typeOfHeatEmitter === 'instantElectricHeater'"
				:model="(model as InstantElectricHeaterModelType)"
				:index="index" />
			<ElectricStorageHeaterSection
				v-if="model?.typeOfHeatEmitter === typeOfHeatEmitter.electricStorageHeater"
				:model="(model as ElectricStorageHeaterModelType)" 
				:index="index"
				:on-incompatible-energy-source="handleIncompatibleEnergySource"
			/>
			<WarmAirHeaterSection
				v-if="model?.typeOfHeatEmitter === 'warmAirHeater'"
				:model="(model as WarmAirHeaterModelType)" />
		</template>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('spaceHeating')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>

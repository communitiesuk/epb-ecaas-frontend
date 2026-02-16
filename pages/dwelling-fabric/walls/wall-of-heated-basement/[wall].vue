<script setup lang="ts">
import { NuxtLink } from "#components";
import { getUrl, uniqueName } from "#imports";
import { v4 as uuidv4 } from "uuid";
import type { WallOfHeatedBasementData } from "~/stores/ecaasStore.schema";

const title = "Wall of heated basement";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const wallOfHeatedBasementData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallOfHeatedBasement?.data;
const index = getStoreIndex(wallOfHeatedBasementData);
const wallData = useItemToEdit("wall", wallOfHeatedBasementData);
const wallId = wallData?.data.id ?? uuidv4();
const model = ref(wallData?.data);

const saveForm = (fields: WallOfHeatedBasementData) => {
	store.$patch((state) => {
		const { dwellingSpaceWallOfHeatedBasement } = state.dwellingFabric.dwellingSpaceWalls;

		const wall: WallOfHeatedBasementData = {
			id: wallId,
			name: fields.name,
			netSurfaceArea: fields.netSurfaceArea,
			uValue: fields.uValue,
			thermalResistance: fields.thermalResistance,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			associatedBasementFloorId: fields.associatedBasementFloorId,
		};

		dwellingSpaceWallOfHeatedBasement.data[index] = { data: wall, complete: true };
		dwellingSpaceWallOfHeatedBasement.complete = false;
	});
	navigateTo("/dwelling-fabric/walls");
};

autoSaveElementForm<WallOfHeatedBasementData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallOfHeatedBasement,
	defaultName: "Wall of heated basement",
	onPatch: (state, newData, index) => {
		newData.data.id ??= wallId;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallOfHeatedBasement.data[index] = newData;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallOfHeatedBasement.complete = false;
	},
});


watch(
	() => [model.value, store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement.data.length] as const,
	() => {
		const basementFloors = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement.data;
		if (basementFloors.length === 1 && model.value) {
			const basementFloorId = basementFloors[0]?.data.id;
			if (basementFloorId && "associatedBasementFloorId" in model.value) {
				model.value.associatedBasementFloorId = basementFloorId;
			}
		}
	},
);
const { dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
const basementFloorOptions = 
	new Map(
		dwellingSpaceFloorOfHeatedBasement.data
			.filter((e) => e?.data?.id != null)
			.map((e) => [e.data.id!, e.data.name]),
	);


const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="wallOfHeatedBasementErrorSummary" />
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(wallOfHeatedBasementData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="netSurfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Enter the net surface area of the entire element"
			name="netSurfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FieldsUValue id="uValue" name="uValue" />
		<FormKit
			id="thermalResistance"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance"
			help="Enter the thermal resistance of all layers in the floor construction"
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50"

		><GovDetails summary-text="Help with this input">
			<p>Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer.
			</p>
		</GovDetails>
		</FormKit>
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity" />
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass" />
		<FormKit
			id="associatedBasementFloorId"
			:key="basementFloorOptions.size"
			name="associatedBasementFloorId"
			type="govRadios"
			label="Associated basement floor"
			help="Select the basement floor this wall connects to"
			validation="required"
			:options="basementFloorOptions"
		>
			<div
				v-if="!basementFloorOptions.size"
				data-testid="noBasementFloor"
			>
				<p class="govuk-error-message">No basement floors added.</p>
				<NuxtLink :to="getUrl('dwellingSpaceFloorOfHeatedBasementCreate')" class="govuk-link gov-radios-add-link">
					Click here to add a basement floor
				</NuxtLink>
			</div>
		</FormKit>
		<div class="govuk-button-group govuk-!-margin-top-6">
			<GovLLMWarning />
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
				<GovButton :href="getUrl('dwellingSpaceWalls')" test-id="saveProgress" secondary>Save progress</GovButton>
			</div>
		</div>
	</FormKit>
</template>

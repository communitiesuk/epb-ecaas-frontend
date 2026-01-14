<script setup lang="ts">
import { AdjacentSpaceType } from "~/stores/ecaasStore.schema";
import { getUrl, uniqueName } from "#imports";

const title = "Internal floor";
const store = useEcaasStore();
const { getStoreIndex, autoSaveElementForm } = useForm();

const internalFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor?.data;
const index = getStoreIndex(internalFloorData);
const floorData = useItemToEdit("floor", internalFloorData);
const model = ref(floorData?.data);

const typeOfInternalFloorOptions = adjacentSpaceTypeOptions("Internal floor");

const saveForm = (fields: InternalFloorData) => {
	store.$patch((state) => {
		const { dwellingSpaceFloors } = state.dwellingFabric;

		const commonFields = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
		};

		let floor: InternalFloorData;

		if (fields.typeOfInternalFloor === "unheatedSpace") {
			floor = {
				...commonFields,
				typeOfInternalFloor: fields.typeOfInternalFloor,
				thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,

			};
		} else if (fields.typeOfInternalFloor === "heatedSpace") {
			floor = {
				...commonFields,
				typeOfInternalFloor: fields.typeOfInternalFloor,
			};
		} else {
			throw new Error("Invalid floor type");
		}

		dwellingSpaceFloors.dwellingSpaceInternalFloor.data[index] = { data: floor, complete: true };
		dwellingSpaceFloors.dwellingSpaceInternalFloor.complete = false;
	});
	navigateTo("/dwelling-fabric/floors");
};

autoSaveElementForm<InternalFloorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor,
	defaultName: "Internal floor",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="internalFloorErrorSummary" />
		<FormKit id="typeOfInternalFloor" type="govRadios" :options="typeOfInternalFloorOptions"
			label="Type of internal floor" help="This affects the additional inputs needed" name="typeOfInternalFloor"
			validation="required" />
		<template v-if="!!model?.typeOfInternalFloor">
			<FormKit id="name" type="govInputText" label="Name"
				help="Provide a name for this element so that it can be identified later" name="name"
				:validation-rules="{ uniqueName: uniqueName(internalFloorData, { index }) }" validation="required | uniqueName"
				:validation-messages="{
					uniqueName: 'An element with this name already exists. Please enter a unique name.'
				}" />
			<FormKit id="surfaceAreaOfElement" type="govInputWithSuffix" label="Net surface area of the floor"
				name="surfaceAreaOfElement" validation="required | number | min:0 | max:10000" suffix-text="m²"
				data-field="Zone.BuildingElement.*.area" />
			<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity" />
			<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass" />
		</template>
		<FormKit v-if="model?.typeOfInternalFloor === " unheatedSpace"" id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix" suffix-text="(m²·K)/W" label="Thermal resistance of adjacent unheated space"
			help="Enter the effective thermal resistance of the unheated space"
			name="thermalResistanceOfAdjacentUnheatedSpace" validation="required | number | min:0 | max:3"
			data-field="Zone.BuildingElement.*.thermal_resistance_unconditioned_space">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<p>For example values please refer to the technical paper S11P-028. The maximum value in this paper is 2.5
					(m²·K)/W
					for when the facing wall is not exposed.</p>
				<p class="govuk-body">
					<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">
						Guidance on thermal resistance of unheated spaces (opens in another window)
					</a>
				</p>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
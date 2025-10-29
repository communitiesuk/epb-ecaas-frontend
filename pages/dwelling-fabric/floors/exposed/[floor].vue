<script setup lang="ts">
import { getUrl } from "#imports";
import type { SchemaColour } from "~/schema/aliases";
const title = "Exposed floor";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const floorData = useItemToEdit("floor", store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor?.data);
const model = ref(floorData?.data);

const colourOptions = {
	"Light": "Light",
	"Intermediate": "Intermediate",
	"Dark": "Dark",
} as const satisfies Record<SchemaColour, SchemaColour>;

const saveForm = (fields: ExposedFloorData) => {	
	store.$patch((state) => {
		const { dwellingSpaceFloors } = state.dwellingFabric;

		const floor: ExposedFloorData = {
			name: fields.name,
			pitch: 180,
			orientation: 0,
			length: fields.length,
			width: fields.width,
			elevationalHeight: fields.elevationalHeight,
			surfaceArea: fields.surfaceArea,
			uValue: fields.uValue,
			colour: fields.colour,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
		};
		
		const index = getStoreIndex(dwellingSpaceFloors.dwellingSpaceExposedFloor.data);
		dwellingSpaceFloors.dwellingSpaceExposedFloor.data[index] =  { data: floor, complete: true };
		dwellingSpaceFloors.dwellingSpaceExposedFloor.complete = false;
	}); 
	navigateTo("/dwelling-fabric/floors");
};

autoSaveElementForm<ExposedFloorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor,
	defaultName: "Exposed floor",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor.complete = false;
	},
});

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
		<GovErrorSummary :error-list="errorMessages" test-id="exposedFloorErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Length"
			help="Enter the length of the building element"
			name="length"
			validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.height"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="Enter the width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.width"
		/>
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Enter the net area of the building element"
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FieldsUValue id="uValue" name="uValue" />
		<FormKit
			id="colour"
			type="govRadios"
			label="Colour of external surface"
			name="colour"
			:options="colourOptions"
			validation="required"
			data-field="Zone.BuildingElement.*.colour"
		/>
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save an mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
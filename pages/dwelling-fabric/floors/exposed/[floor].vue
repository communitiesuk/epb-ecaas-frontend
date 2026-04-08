<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";
import { heightOpaqueZod, widthOpaqueZod, surfaceAreaOpaqueZod } from "~/stores/ecaasStore.schema";

const title = "Exposed floor";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const exposedFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor?.data;
const index = getStoreIndex(exposedFloorData);
const floorData = useItemToEdit("floor", exposedFloorData);
const model = ref(floorData?.data);

const saveForm = (fields: ExposedFloorData) => {	
	store.$patch((state) => {
		const { dwellingSpaceExposedFloor } = state.dwellingFabric.dwellingSpaceFloors;

		const floor: ExposedFloorData = {
			name: fields.name,
			pitch: 180,
			length: fields.length,
			width: fields.width,
			elevationalHeight: fields.elevationalHeight,
			surfaceArea: fields.surfaceArea,
			uValue: fields.uValue,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
		};
		
		dwellingSpaceExposedFloor.data[index] = { data: floor, complete: true };
		dwellingSpaceExposedFloor.complete = false;
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
		<GovInset>It is assumed that the pitch of the floor is 180°. If this is not the case, enter the element as an external wall.</GovInset>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(exposedFloorData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Length"
			help="Enter the length of the building element"
			name="length"
			:validation="zodTypeAsFormKitValidation(heightOpaqueZod)"
			data-field="Zone.BuildingElement.*.height"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="Enter the width of the building element"
			name="width"
			:validation="zodTypeAsFormKitValidation(widthOpaqueZod)"
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
			:validation="zodTypeAsFormKitValidation(surfaceAreaOpaqueZod)"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FieldsUValue help="Enter the U-value of the full thickness of the floor build-up" />
		<FieldsArealHeatCapacity
			id="arealHeatCapacity"
			name="arealHeatCapacity"
			help="This is the sum of the heat capacities of the full thickness of the floor build-up"
		/>
		<FieldsMassDistributionClass
			id="massDistributionClass"
			name="massDistributionClass"
			help="This is the distribution of mass in the full thickness of the floor build up"
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save an mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
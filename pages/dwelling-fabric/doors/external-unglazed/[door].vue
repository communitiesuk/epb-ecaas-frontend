<script setup lang="ts">
import { standardPitchOptions, getUrl } from "#imports";

const title = "External unglazed door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const doorData = useItemToEdit("door", store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor?.data);
const model = ref(doorData?.data);

const saveForm = (fields: ExternalUnglazedDoorData) => {
	store.$patch((state) => {
		const { dwellingSpaceExternalUnglazedDoor } = state.dwellingFabric.dwellingSpaceDoors;
		const index = getStoreIndex(dwellingSpaceExternalUnglazedDoor.data);

		dwellingSpaceExternalUnglazedDoor.data[index] = {
			data: {
				name: fields.name,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "90" ? 90 : fields.pitch,
				orientation: fields.orientation,
				height: fields.height,
				width: fields.width,
				elevationalHeight: fields.elevationalHeight,
				surfaceArea: fields.surfaceArea,
				solarAbsorption: fields.solarAbsorption,
				uValue: fields.uValue,
				arealHeatCapacity: fields.arealHeatCapacity,
				massDistributionClass: fields.massDistributionClass,
			},
			complete: true,
		};
		dwellingSpaceExternalUnglazedDoor.complete = false;
	});
	navigateTo("/dwelling-fabric/doors");
};

autoSaveElementForm<ExternalUnglazedDoorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor,
	defaultName: "External unglazed door",
	onPatch: (state, newData, index) => {
		const { pitchOption, pitch } = newData.data;
		newData.data.pitch = pitchOption === "90" ? 90 : pitch;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="externalUnglazedDoorErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FieldsPitch
			:pitch-option="model?.pitchOption"
			:options="standardPitchOptions()"
			data-field="Zone.BuildingElement.*.pitch"
		/>
		<FieldsOrientation dataField="Zone.BuildingElement.*.orientation" />
		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height"
			help="Enter the length of the building element"
			name="height"
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
			label="Net surface area of element"
			help="Enter the net area of the building element. The area of all windows should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorption" name="solarAbsorption"/>
		<FieldsUValue id="uValue" name="uValue" />
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceDoors')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
<script setup lang="ts">
import { standardPitchOptions, getUrl } from "#imports";
import { v4 as uuidv4 } from "uuid";

const title = "Internal wall";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const wallData = useItemToEdit("wall", store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall?.data);
const wallId = wallData?.data.id ?? uuidv4();
const model: Ref<InternalWallData | undefined> = ref(wallData?.data);

const saveForm = (fields: InternalWallData) => {
	store.$patch((state) => {
		const { dwellingSpaceWalls } = state.dwellingFabric;
		const index = getStoreIndex(dwellingSpaceWalls.dwellingSpaceExternalWall.data);
		const currentId = wallData?.data.id;


		dwellingSpaceWalls.dwellingSpaceInternalWall.data[index] = {
			data: {
				id: currentId || uuidv4(),
				name: fields.name,
				surfaceAreaOfElement: fields.surfaceAreaOfElement,
				kappaValue: fields.kappaValue,
				massDistributionClass: fields.massDistributionClass,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "90" ? 90 : fields.pitch,
			},
			complete: true,
		};

		dwellingSpaceWalls.dwellingSpaceInternalWall.complete = false;
	});

	navigateTo("/dwelling-fabric/walls");
};

autoSaveElementForm({
	model,
	storeData: store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall,
	defaultName: "Internal wall",
	onPatch: (state, newData, index) => {
		newData.data.id ??= wallId;
		const { pitchOption, pitch } = newData.data;
		newData.data.pitch = pitchOption === "90" ? 90 : pitch;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall.data[index] = newData;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
		<GovErrorSummary :error-list="errorMessages" test-id="internalWallErrorSummary"/>
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
		<FormKit
			id="surfaceAreaOfElement"
			type="govInputWithSuffix"
			label="Gross surface area"
			help="Enter the gross area of the building element. If the element is not square or rectangular the area might not be equal to width multiplied by height, hence the need to ask for area in addition to width and height."
			name="surfaceAreaOfElement"
			validation="required | number | min:0 | max:10000"
			suffix-text="m²"
			data-field="Zone.BuildingElement.*.area">
		</FormKit>
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceWalls')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
<script setup lang="ts">
import { standardPitchOptions, getUrl } from "#imports";
import { v4 as uuidv4 } from "uuid";

const title = "External wall";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const wallData = useItemToEdit("wall", store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall?.data);
const wallId = wallData?.data.id ?? uuidv4();
const model: Ref<ExternalWallData | undefined> = ref(wallData?.data);

const saveForm = (fields: ExternalWallData) => {
	store.$patch((state) => {
		const { dwellingSpaceWalls } = state.dwellingFabric;
		const index = getStoreIndex(dwellingSpaceWalls.dwellingSpaceExternalWall.data);
		const currentId = wallData?.data.id;

		dwellingSpaceWalls.dwellingSpaceExternalWall.data[index] = {
			data: {
				id: currentId || uuidv4(),
				name: fields.name,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "90" ? 90 : fields.pitch,
				orientation: fields.orientation,
				height: fields.height,
				length: fields.length,
				elevationalHeight: fields.elevationalHeight,
				surfaceArea: fields.surfaceArea,
				solarAbsorption: fields.solarAbsorption,
				uValue: fields.uValue,
				kappaValue: fields.kappaValue,
				massDistributionClass: fields.massDistributionClass,
			},
			complete: true,
		};

		dwellingSpaceWalls.dwellingSpaceExternalWall.complete = false;
	});

	navigateTo("/dwelling-fabric/walls");
};

autoSaveElementForm({
	model,
	storeData: store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall,
	defaultName: "External wall",
	onPatch: (state, newData, index) => {
		newData.data.id ??= wallId;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall.data[index] = newData;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall.complete = false;
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
		v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="externalWallErrorSummary" />
		<FormKit
			id="name" type="govInputText" label="Name"
			help="Provide a name for this element so that it can be identified later" name="name" validation="required" />
		<FieldsPitch :pitch-option="model?.pitchOption" :options="standardPitchOptions()" />
		<FormKit
			id="orientation"
			type="govInputWithSuffix"
			suffix-text="°"
			label="Orientation"
			name="orientation"
			validation="required | number | min:0 | max:360"
			data-field="Zone.BuildingElement.*.orientation">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<img src="/img/orientation-measurement.png" alt="Orientation measurement">
				<p class="govuk-hint">To define an object's orientation, measure the angle of its outside face clockwise from
					true North, accurate to the nearest degree.</p>
				<p class="govuk-hint">If a wall has multiple orientations (i.e a hexagonal wall) each different orientation
					needs to be modelled separately</p>
			</GovDetails>
		</FormKit>

		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height"
			help="Enter the height of the building element"
			name="height"
			validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.height">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<p class="govuk-hint">Enter the height of the wall up to where the insulation stops.</p>
				<p class="govuk-hint">If you have a non-rectangular wall (for example a gable end) and the insulation spans the
					entire wall then enter the height of the wall from the base to the very top.</p>
				<p class="govuk-hint">If you have a non-rectangular wall (for example a gable end) and the insulation does not
					go all the way to the top, enter the maximum height of the part of the wall that has insulation.</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Length"
			help="Enter the length of the building element"
			name="length"
			validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.width"
		/>
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Enter the net area of the building element. The area of all windows or doors should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorption" name="solarAbsorption"/>
		<FieldsUValue id="uValue" name="uValue" />
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue" />
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass" />
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceWalls')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
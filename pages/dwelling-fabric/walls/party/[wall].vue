<script setup lang="ts">
import { standardPitchOptions, getUrl, uniqueName } from "#imports";

const title = "Party wall";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const partyWallData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall?.data
const index = getStoreIndex(partyWallData);
const wallData = useItemToEdit("wall", partyWallData);
const model: Ref<PartyWallData | undefined> = ref(wallData?.data);

const saveForm = (fields: PartyWallData) => {
	store.$patch((state) => {
		const { dwellingSpaceWalls } = state.dwellingFabric;

		dwellingSpaceWalls.dwellingSpacePartyWall.data[index] = {
			data: {
				name: fields.name,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "90" ? 90 : fields.pitch,
				surfaceArea: fields.surfaceArea,
				uValue: fields.uValue,
				arealHeatCapacity: fields.arealHeatCapacity,
				massDistributionClass: fields.massDistributionClass,
			},
			complete: true,
		};

		dwellingSpaceWalls.dwellingSpacePartyWall.complete = false;
	});

	navigateTo("/dwelling-fabric/walls");
};

autoSaveElementForm({
	model,
	storeData: store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall,
	defaultName: "Party wall",
	onPatch: (state, newData, index) => {
		const { pitchOption, pitch } = newData.data;
		newData.data.pitch = pitchOption === "90" ? 90 : pitch;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall.data[index] = newData;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="partyWallErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(partyWallData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FieldsPitch
			:pitch-option="model?.pitchOption"
			:options="standardPitchOptions()"
			data-field="Zone.BuildingElement.*.pitch"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area of element"
			help="Enter the net area of the building element. The area of all windows or doors should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m²·K)"
			label="U-value"
			help="This is the steady thermal transmittance of the materials that make up the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
			data-field="Zone.BuildingElement.*.u_value">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">
					For the U-value of party walls, put the actual U-value of the materials of the wall. This helps determine the behaviour of the wall releasing heat back into the room.
				</p>
			</GovDetails>
		</FormKit>
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceWalls')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
<script setup lang="ts">
import { NotificationsDoorBanner } from "#components";
import { getUrl, standardPitchOptions, uniqueName } from "#imports";
import { isFlatRoofItem } from "../../../../utils/isFlatRoofItem";

const title = "External unglazed door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const externalUnglazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor?.data;
const index = getStoreIndex(externalUnglazedDoorData);
const doorData = useItemToEdit("door", externalUnglazedDoorData);
const model = ref(doorData?.data);

const saveForm = () => {
	store.$patch((state) => {
		const { dwellingSpaceExternalUnglazedDoor: doors } = state.dwellingFabric.dwellingSpaceDoors;
		const currentDoor = doors.data[index];
		if (!currentDoor) {
			throw new Error("No unglazed door found to save");
		}
		currentDoor.complete = true;
		doors.complete = false;
	});
	navigateTo("/dwelling-fabric/doors");
};

const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

const tagOptions = [
	...dwellingSpaceExternalWall.data.map(x => [x.data.id, x.data.name] as [string, string]),
	...dwellingSpaceRoofs.data.map(x => [x.data.id, x.data.name] as [string, string]),
].filter(x => x[0] !== undefined);

if (model.value && model.value.associatedItemId === undefined) {
	model.value.associatedItemId = "none";
}

autoSaveElementForm<ExternalUnglazedDoorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor,
	defaultName: "External unglazed door",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.complete = false;
	},
});
function canBeFrontDoor(node: FormKitNode) {
	if (node.value === true) {
		const unglazedDoorsExcludingCurrent = externalUnglazedDoorData.toSpliced(index, 1);
		const { dwellingSpaceExternalGlazedDoor, dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
		const doors = [...unglazedDoorsExcludingCurrent, dwellingSpaceExternalGlazedDoor.data, dwellingSpaceInternalDoor.data].flat();
		for (const door of doors) {
			return !door.data.isTheFrontDoor;			
		}
	} return true;
}


const tagHasValidPitch = computed(() => {
	const taggedItem = store.getTaggedItem(
		[dwellingSpaceExternalWall, dwellingSpaceRoofs],
		model.value?.associatedItemId,
	);

	return taggedItem?.pitch !== 0 && taggedItem?.pitch !== 180;
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
		<NotificationsDoorBanner/>
		<GovErrorSummary :error-list="errorMessages" test-id="externalUnglazedDoorErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(externalUnglazedDoorData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FieldsAssociatedWallRoof
			id="associatedItemId"
			name="associatedItemId"
			label="Associated wall or roof"
			help="Select the wall or roof that this door is in. It should have the same orientation and pitch as the door."
		/>
		<template v-if="model && (model.associatedItemId === 'none' || tagOptions.length === 0)">
			<FieldsPitch
				:pitch-option="model?.pitchOption"
				:options='standardPitchOptions()'
				data-field="Zone.BuildingElement.*.pitch"
				:suppress-standard-guidance="true"
			/>
			<FieldsOrientation
				v-if="(model.pitchOption === '90' || model.pitch != null && model.pitch !== 0 && model.pitch !== 180)"
				id="orientation"
				name="orientation"
				data-field="Zone.BuildingElement.*.orientation360"
			/>
		</template>
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
		<FieldsElevationalHeight
			help="Enter the distance between the ground and the bottom of the door"
		/>
		<FieldsUValue
			help="Enter the u-value of the full thickness of the door build up"
		/>
		<FieldsColourOfExternalSurface v-if="!(model?.pitch && model.pitch > 120)" />
		<FieldsArealHeatCapacity
			id="arealHeatCapacity"
			name="arealHeatCapacity"
			help="This is the sum of the heat capacities of all the construction layers"
		/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			v-if="tagHasValidPitch &&
				(!isFlatRoofItem(model?.associatedItemId!) ||
					!model?.associatedItemId ||
					model.associatedItemId === 'none') && (model?.pitch !== 0 && model?.pitch !== 180)"
			id="isTheFrontDoor"
			type="govBoolean"
			label="Is this the front door?"
			name="isTheFrontDoor"
			:validation-rules="{ canBeFrontDoor }"
			validation="required | canBeFrontDoor" 
			:validation-messages="{
				canBeFrontDoor: 'Another door has already been marked as the front door. Please change that entry if you wish to mark this door as the front door instead.'
			}"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceDoors')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
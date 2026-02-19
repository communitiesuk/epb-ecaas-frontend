<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";

const title = "External unglazed door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const externalUnglazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor?.data;
const index = getStoreIndex(externalUnglazedDoorData);
const doorData = useItemToEdit("door", externalUnglazedDoorData);
const model = ref(doorData?.data);

const colourOptions = colourOptionsMap;

const saveForm = (fields: ExternalUnglazedDoorData) => {
	store.$patch((state) => {
		const { dwellingSpaceExternalUnglazedDoor } = state.dwellingFabric.dwellingSpaceDoors;

		const shouldSavePitchOrientation = tagOptions.length === 0 || fields.associatedItemId === "none";

		dwellingSpaceExternalUnglazedDoor.data[index] = {
			data: {
				name: fields.name,
				height: fields.height,
				width: fields.width,
				elevationalHeight: fields.elevationalHeight,
				arealHeatCapacity: fields.arealHeatCapacity,
				massDistributionClass: fields.massDistributionClass,
				colour: fields.colour,
				associatedItemId: shouldSavePitchOrientation ? undefined : fields.associatedItemId,
				pitch: shouldSavePitchOrientation ? fields.pitch : undefined,
				orientation: shouldSavePitchOrientation ? fields.orientation : undefined,
				thermalResistance: fields.thermalResistance,
			},
			complete: true,
		};
		dwellingSpaceExternalUnglazedDoor.complete = false;
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
				id="pitch"
				name="pitch"
				data-field="Zone.BuildingElement.*.pitch"
			/>
			<FieldsOrientation
				v-if="model.pitch != null && model.pitch !== 0 && model.pitch !== 180"
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
		<FieldsElevationalHeight />
		<FormKit
			id="thermalResistance"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance"
			help="Enter the thermal resistance of all layers in the door construction"
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50"
		><GovDetails summary-text="Help with this input">
			<p>Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer.
			</p>
		</GovDetails>
		</FormKit>
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
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceDoors')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
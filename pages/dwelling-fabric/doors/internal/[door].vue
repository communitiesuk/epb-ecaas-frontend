<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";

const title = "Internal door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const internalDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor?.data;
const index = getStoreIndex(internalDoorData);
const doorData = useItemToEdit("door", internalDoorData);
const model = ref(doorData?.data);

const typeOfInternalDoorOptions = adjacentSpaceTypeOptions("Internal door");

const saveForm = (fields: InternalDoorData) => {
	store.$patch((state) => {
		const { dwellingSpaceInternalDoor } = state.dwellingFabric.dwellingSpaceDoors;

		const commonFields = {
			isTheFrontDoor: fields.isTheFrontDoor,
			associatedItemId: fields.associatedItemId,
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
		};

		let door: EcaasForm<InternalDoorData>;

		if (fields.typeOfInternalDoor === "unheatedSpace") {
			door = {
				data: {
					...commonFields,
					typeOfInternalDoor: fields.typeOfInternalDoor,
					uValue: fields.uValue,
					thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
				},
				complete: true,
			};
		} else if (fields.typeOfInternalDoor === "heatedSpace") {
			door = {
				data: {
					...commonFields,
					typeOfInternalDoor: fields.typeOfInternalDoor,
				},
				complete: true,
			};
		} else {
			throw new Error("Invalid type of door");
		}
		dwellingSpaceInternalDoor.data[index] = door;
		store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.complete = false;
	});
	navigateTo("/dwelling-fabric/doors");
};

autoSaveElementForm<InternalDoorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor,
	defaultName: "Internal door",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.complete = false;
	},
});

function canBeFrontDoor(node: FormKitNode) {
	if (node.value === true) {
		const internalDoorsExcludingCurrent = internalDoorData.toSpliced(index, 1);
		const { dwellingSpaceExternalUnglazedDoor, dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
		const doors = [...internalDoorsExcludingCurrent, dwellingSpaceExternalUnglazedDoor.data, dwellingSpaceInternalDoor.data].flat();
		for (const door of doors) {
			return !door.data.isTheFrontDoor;			
		}
	} return true;
}

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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="internalDoorErrorSummary" />
		<FormKit
			id="typeOfInternalDoor"
			type="govRadios"
			:options="typeOfInternalDoorOptions"
			label="Type"
			help="This affects which inputs are necessary."
			name="typeOfInternalDoor"
			validation="required" />
		<template v-if="!!model?.typeOfInternalDoor">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				:validation-rules="{ uniqueName: uniqueName(internalDoorData, { index }) }"
				validation="required | uniqueName"
				:validation-messages="{
					uniqueName: 'An element with this name already exists. Please enter a unique name.'
				}" />
			<FieldsAssociatedElements
				v-if="model.typeOfInternalDoor === 'heatedSpace'"
				id="associatedItemId"
				name="associatedItemId"
				label="Associated wall or ceiling"
				help="Select the wall or ceiling that this door is in. It should have the same pitch as the door."
				adjacent-space-type="heatedSpace" />
			<FieldsAssociatedElements
				v-if="model.typeOfInternalDoor === 'unheatedSpace'"
				id="associatedItemId"
				name="associatedItemId"
				label="Associated wall or ceiling"
				help="Select the wall or ceiling that this door is in. It should have the same pitch as the door."
				adjacent-space-type="unheatedSpace" />
			<FormKit
				id="surfaceArea"
				type="govInputWithSuffix"
				label="Net surface area of element"
				help="Enter the net area of the building element. The area of all windows should be subtracted before entry."
				name="surfaceArea"
				validation="required | number | min:0 | max:10000"
				suffix-text="m²"
				data-field="Zone.BuildingElement.*.area" />
			<FieldsUValue v-if="model.typeOfInternalDoor === 'unheatedSpace'" id="uValue" name="uValue" />
			<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity" />
			<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass" />
		</template>
		<FormKit
			v-if="model?.typeOfInternalDoor === 'unheatedSpace'"
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of adjacent unheated space"
			help="Enter the effective thermal resistance of the unheated space"
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
			data-field="Zone.BuildingElement.*.thermal_resistance_unconditioned_space">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">
					For example values please refer to the technical paper S11P-028. The maximum value in this paper is 2.5
					(m²·K)/W
					for when the facing wall is not exposed.
				</p>
				<p class="govuk-body">
					<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">
						Guidance on thermal resistance of unheated spaces (opens in another window)
					</a>
				</p>
			</GovDetails>
		</FormKit>
		<FormKit
			v-if="model?.typeOfInternalDoor && store.dwellingDetails.generalSpecifications.data.typeOfDwelling === 'flat'"
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
<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";
import { surfaceAreaAdjacentSpaceZod } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";

const title = "Internal door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const internalDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor?.data;
const index = getStoreIndex(internalDoorData);
const doorData = useItemToEdit("door", internalDoorData);
const model = ref(doorData?.data);
const { dwellingSpaceInternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceWallToUnheatedSpace } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpacePartyWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceCeilings } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

const typeOfInternalDoorOptions = adjacentSpaceTypeOptions("Internal door");

const saveForm = () => {
	store.$patch((state) => {
		const { dwellingSpaceInternalDoor: doors } = state.dwellingFabric.dwellingSpaceDoors;
		const currentDoor = doors.data[index];
		if (!currentDoor) {
			throw new Error("No internal door found to save");
		}
		currentDoor.complete = true;
		doors.complete = false;
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

const taggedWithCeiling = computed(() => {
	return store.getTaggedItem(
		[dwellingSpaceCeilings],
		model.value?.associatedItemId,
	) ? true : false;
});

const tagHasValidPitch = computed(() => {
	const taggedItem = store.getTaggedItem(
		[dwellingSpaceInternalWall, dwellingSpaceWallToUnheatedSpace, dwellingSpacePartyWall],
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
	<div class="govuk-inset-text">
		<p class="govuk-body">Only add internal doors at the edge of the thermal envelope, not within the dwelling. This would likely only ever be a door to an unheated space or, in a flat, a front door to a heated corridor.</p>
	</div>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<NotificationsDoorBanner/>
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
				help="Enter the area of the hole in the wall for this door and its frame"
				name="surfaceArea"
				:validation="zodTypeAsFormKitValidation(surfaceAreaAdjacentSpaceZod)"
				suffix-text="m²"
				data-field="Zone.BuildingElement.*.area" />
			<FieldsUValue v-if="model.typeOfInternalDoor === 'unheatedSpace'" help="Enter the U-value of the full thickness of the door build up" />
			<FieldsUValue v-else help="Enter the U-value of half the thickness of the door build up" />
			<FieldsArealHeatCapacity v-if="model.typeOfInternalDoor === 'unheatedSpace'" help="This is the sum of the heat capacities of the full thickness of the door build up" />
			<FieldsArealHeatCapacity v-else help="This is the sum of the heat capacities of half the thickness of the door build up" />
			<FieldsMassDistributionClass v-if="model.typeOfInternalDoor === 'unheatedSpace'" help="This is the distribution of mass in the full thickness of the door build up" />
			<FieldsMassDistributionClass v-else help="This is the distribution of mass in half the thickness of the door build up" />
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
					The thermal resistance of unheated space is a measure of the degree of shelter that the unheated space provides to the building element. It is calculated as the thickness of the material divided by its thermal conductivity. A higher thermal resistance reduces heat transfer. The U-value is the inverse of the total thermal resistance of a building element.
				</p>
				<p class="govuk-hint">
					See the technical paper HEM-TP-05, in which Annex A includes a general way to calculate this and also some suggested default values for common scenarios.
				</p>
				<p class="govuk-hint">
					The maximum thermal resistance of an unheated space is 2.5
					(m²·K)/W. This is when the facing wall is not exposed.
				</p>
				<p class="govuk-body">
					<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">
						Guidance on thermal resistance of unheated spaces (opens in another window)
					</a>
				</p>
			</GovDetails>
		</FormKit>
		<FieldsFrontDoor
			v-if="model?.typeOfInternalDoor && store.dwellingDetails.generalSpecifications.data.typeOfDwelling === 'flat' &&
				(taggedWithCeiling === false && tagHasValidPitch || !model?.associatedItemId)"
			:index="index"
			door-type="Internal"
		/>
		<FieldsOrientation
			v-if="model?.isTheFrontDoor && store.dwellingDetails.generalSpecifications.data.typeOfDwelling === 'flat' && model.isTheFrontDoor"
			id="orientation"
			name="orientation"
			data-field="Zone.BuildingElement.*.orientation360"
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceDoors')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
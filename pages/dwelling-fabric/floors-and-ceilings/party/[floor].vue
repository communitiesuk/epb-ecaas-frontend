<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";
import { v4 as uuidv4 } from "uuid";
import { surfaceAreaOpaqueZod, type PartyFloorData } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";

const title = "Party floor / ceiling";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const partyFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpacePartyFloor?.data;
const index = getStoreIndex(partyFloorData);
const floorData = useItemToEdit("floor", partyFloorData);
const model = ref(floorData?.data);

const saveForm = (fields: PartyFloorData) => {	
	store.$patch((state) => {
		const { dwellingSpacePartyFloor } = state.dwellingFabric.dwellingSpaceFloors;

		const floor: PartyFloorData = {
			id: uuidv4(),
			name: fields.name,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === "0" ? 0 : fields.pitch,
			surfaceArea: fields.surfaceArea,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			uValue: fields.uValue,
		};
		
		dwellingSpacePartyFloor.data[index] = { data: floor, complete: true };
		dwellingSpacePartyFloor.complete = false;
	});

	navigateTo(getUrl("dwellingSpaceFloors"));
};

autoSaveElementForm<PartyFloorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceFloors.dwellingSpacePartyFloor,
	defaultName: "Party floor / ceiling",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpacePartyFloor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpacePartyFloor.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="partyFloorErrorSummary"/>
		<GovInset>It is assumed that the pitch of the floor is 180°. If this is not the case, enter the element as an external wall.</GovInset>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(partyFloorData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FieldsPitch
			:pitch-option="model?.pitchOption"
			:options="zeroPitchOptions()"
			data-field="Zone.BuildingElement.*.pitch"
			:suppress-standard-guidance="true"
		/>
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
		<FieldsArealHeatCapacity
			id="arealHeatCapacity"
			name="arealHeatCapacity"
			help="This is the sum of the heat capacities of the full thickness of the floor build-up"
			:show-floor-guidance="true"
		/>
		<FieldsMassDistributionClass
			id="massDistributionClass"
			name="massDistributionClass"
			help="This is the distribution of mass in the full thickness of the floor build up"
		/>
		<FieldsUValue help="Enter the U-value of the full thickness of the floor build-up" />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save an mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
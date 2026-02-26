<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { standardPitchOptions, getUrl, uniqueName, type SnakeToSentenceCase } from "#imports";
import type { SchemaPartyWallCavityType, SchemaPartyWallLiningType } from "~/schema/api-schema.types";
import { thermalResistanceCavityZod } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "#imports";

const title = "Party wall";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const partyWallData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall?.data;
const wallData = useItemToEdit("wall", partyWallData);
const wallId = wallData?.data.id ?? uuidv4();
const index = getStoreIndex(partyWallData);
const model: Ref<PartyWallData | undefined> = ref(wallData?.data);

const partyWallCavityTypeOptions = {
	unfilled_unsealed: "Unfilled and unsealed",
	unfilled_sealed: "Unfilled and sealed",
	filled_sealed: "Filled and sealed",
	filled_unsealed: "Filled and unsealed",
	defined_resistance: "Defined resistance",
	solid: "Solid",
} as const satisfies Record<SchemaPartyWallCavityType, string>;
const partyWallLiningTypeOptions = {
	wet_plaster: "Wet plaster",
	dry_lined: "Dry lined",
} as const satisfies Record<SchemaPartyWallLiningType, SnakeToSentenceCase<SchemaPartyWallLiningType>>;

const saveForm = (fields: PartyWallData) => {
	store.$patch((state) => {
		const { dwellingSpaceWalls } = state.dwellingFabric;
		const index = getStoreIndex(dwellingSpaceWalls.dwellingSpacePartyWall.data);
		const currentId = wallData?.data.id;

		dwellingSpaceWalls.dwellingSpacePartyWall.data[index] = {
			data: {
				id: currentId || uuidv4(),
				name: fields.name,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "90" ? 90 : fields.pitch,
				surfaceArea: fields.surfaceArea,
				arealHeatCapacity: fields.arealHeatCapacity,
				massDistributionClass: fields.massDistributionClass,
				partyWallCavityType: fields.partyWallCavityType,
				partyWallLiningType: fields.partyWallLiningType,
				thermalResistanceCavity: fields.thermalResistanceCavity,
				uValue: fields.uValue,
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
		newData.data.id ??= wallId;
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
		<FieldsUValue id="uValue" name="uValue" />
		<FieldsPitch
			:pitch-option="model?.pitchOption"
			:options="standardPitchOptions()"
			help="Tilt angle of the surface from horizontal, between 60 and 120 degrees (wall range), where 90 means vertical"
			:suppress-standard-guidance="true"
			:custom-pitch-range="[60, 120]"
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
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			id="partyWallCavityType"
			name="partyWallCavityType"
			type="govRadios"
			label="Type of party wall cavity construction"
			help="Select the type of party wall cavity construction. This affects heat loss through air movement."
			:options="partyWallCavityTypeOptions"
			validation="required"
			data-field="Zone.BuildingElement.*.party_wall_cavity_type"
		/>
		<FormKit
			v-if="['filled_unsealed', 'filled_sealed', 'unfilled_sealed', 'unfilled_unsealed'].includes(model?.partyWallCavityType!)"
			id="partyWallLiningType"
			name="partyWallLiningType"
			type="govRadios"
			label="Type of party wall lining"
			help="Select the type of party wall lining"
			:options="partyWallLiningTypeOptions"
			validation="required"
			data-field="Zone.BuildingElement.*.party_wall_lining_type"
		/>
		<FormKit
			v-if="model?.partyWallCavityType === 'defined_resistance'"
			id="thermalResistanceCavity"
			name="thermalResistanceCavity"
			type="govInputWithUnit"
			unit="square metre kelvin per watt"
			label="Thermal resistance of the party wall cavity"
			:validation="`required | ${ zodTypeAsFormKitValidation(thermalResistanceCavityZod) }`"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceWalls')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
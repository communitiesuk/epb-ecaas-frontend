<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";
import { surfaceAreaAdjacentSpaceZod } from "~/stores/ecaasStore.schema";

const title = "Internal floor";
const store = useEcaasStore();
const { getStoreIndex, autoSaveElementForm } = useForm();

const { mounted } = useMounted();

const internalFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor?.data;
const index = getStoreIndex(internalFloorData);
const floorData = useItemToEdit("floor", internalFloorData);
const model = ref(floorData?.data);

const typeOfInternalFloorOptions = adjacentSpaceTypeOptions("Internal floor");

const saveForm = (fields: InternalFloorData) => {
	store.$patch((state) => {
		const { dwellingSpaceFloors } = state.dwellingFabric;

		const commonFields = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			uValue: fields.uValue,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === "180" ? 180 : fields.pitch,
		};

		let floor: InternalFloorData;

		if (fields.typeOfInternalFloor === "unheatedSpace") {
			floor = {
				...commonFields,
				typeOfInternalFloor: fields.typeOfInternalFloor,
				thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,

			};
		} else if (fields.typeOfInternalFloor === "heatedSpace") {
			floor = {
				...commonFields,
				typeOfInternalFloor: fields.typeOfInternalFloor,
			};
		} else {
			throw new Error("Invalid floor type");
		}

		dwellingSpaceFloors.dwellingSpaceInternalFloor.data[index] = { data: floor, complete: true };
		dwellingSpaceFloors.dwellingSpaceInternalFloor.complete = false;
	});
	navigateTo("/dwelling-fabric/floors");
};

autoSaveElementForm<InternalFloorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor,
	defaultName: "Internal floor",
	onPatch: (state, newData, index) => {
		const { pitchOption, pitch } = newData.data;

		newData.data.pitch = pitchOption === "180" ? 180 : pitch;

		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.complete = false;
	},
});
const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovInset>
		Enter any ceilings adjacent to roofs in the <NuxtLink :href="getUrl('dwellingSpaceRoofsAll')">Roof</NuxtLink> section. This includes ceilings to unheated loft spaces.
	</GovInset>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="internalFloorErrorSummary" />
		<FormKit
			id="typeOfInternalFloor"
			type="govRadios"
			:options="typeOfInternalFloorOptions"
			label="Type of internal floor / ceiling"
			help="This affects the additional inputs needed"
			name="typeOfInternalFloor"
			validation="required" />
		<template v-if="mounted && !!model?.typeOfInternalFloor">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				:validation-rules="{ uniqueName: uniqueName(internalFloorData, { index }) }"
				validation="required | uniqueName"
				:validation-messages="{
					uniqueName: 'An element with this name already exists. Please enter a unique name.'
				}"
			/>
			<FieldsPitch
				:options="{
					'180': '180°',
					'custom': 'Custom'
				}"
				:pitch-option="model.pitchOption"
				help="Enter the tilt angle of the lower surface. 180° is horizontal."
				suppress-standard-guidance
			/>
			<FieldsSurfaceArea
				v-if="model?.typeOfInternalFloor === 'heatedSpace'"
				label="Net surface area of the floor"
				help="The area of all large openings should be subtracted before entry, apart from any openings for doors or staircases"
				:zod="surfaceAreaAdjacentSpaceZod"
			/>
			<FieldsSurfaceArea
				v-else-if="model?.typeOfInternalFloor === 'unheatedSpace'"
				label="Net surface area of the floor"
				help="Enter the net area of the building element, subtracting any doors or windows."
				:zod="surfaceAreaAdjacentSpaceZod"
			/>
			<FieldsArealHeatCapacity show-construction-build-up-guidance help="Typically very light for internal floors / ceilings" />
			<FieldsMassDistributionClass help="This is the mass distribution class of the full construction build up" />
			<FieldsUValue help="Enter the U-value of the full construction build up" />
		</template>
		<FormKit
			v-if="mounted && model?.typeOfInternalFloor === 'unheatedSpace'"
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of adjacent unheated space"
			help="Enter the effective thermal resistance of the unheated space"
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
			data-field="Zone.BuildingElement.*.thermal_resistance_unconditioned_space">
			<GovDetails summary-text="Help with this input">
				<p>For example values please refer to the technical paper S11P-028. The maximum value in this paper is 2.5
					(m²·K)/W
					for when the facing wall is not exposed.
				</p>
			</GovDetails>
		</FormKit>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
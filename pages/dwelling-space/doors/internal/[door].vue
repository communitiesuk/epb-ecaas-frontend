<script setup lang="ts">
import { standardPitchOptions } from '#imports';

const title = "Internal door";
const store = useEcaasStore();
const { saveToList } = useForm();

const doorData = useItemToEdit('door', store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor?.data);
const model: Ref<InternalDoorData> = ref(doorData!);

const typeOfInternalDoorOptions = adjacentSpaceTypeOptions('Internal door');

const saveForm = (fields: InternalDoorData) => {
	store.$patch((state) => {
		const {dwellingSpaceInternalDoor} = state.dwellingFabric.dwellingSpaceDoors;

		const commonFields = {
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
		};

		let door: InternalDoorData;
		if (fields.typeOfInternalDoor === AdjacentSpaceType.unheatedSpace) {
			door = {
				...commonFields,
				typeOfInternalDoor: fields.typeOfInternalDoor,
				thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
			};
		} else if (fields.typeOfInternalDoor === AdjacentSpaceType.heatedSpace) {
			door = {
				...commonFields,
				typeOfInternalDoor: fields.typeOfInternalDoor,
			};
		} else {
			throw new Error("Invalid type of ceiling");
		}

		saveToList(door, dwellingSpaceInternalDoor);
	});
	store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.complete = false;
	navigateTo("/dwelling-space/doors");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
		<GovErrorSummary :error-list="errorMessages" test-id="internalDoorErrorSummary"/>
		<FormKit
			id="typeOfInternalDoor"
			type="govRadios"
			:options="typeOfInternalDoorOptions"
			label="Type"
			help="This affects which inputs are necessary."
			name="typeOfInternalDoor"
			validation="required"
		/>
		<template v-if="!!model.typeOfInternalDoor">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				validation="required"
			/>
			<FieldsPitch
				:pitch-option="model.pitchOption"
				:options="standardPitchOptions()"
			/>
			<FormKit
				id="surfaceArea"
				type="govInputWithSuffix"
				label="Net surface area of element"
				help="Enter the net area of the building element. The area of all windows should be subtracted before entry."
				name="surfaceArea"
				validation="required | number | min:0 | max:10000"
				suffix-text="m²"
			/>
			<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
			<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		</template>
		<FormKit
			v-if="model.typeOfInternalDoor === 'unheatedSpace'"
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of adjacent unheated space"
			help="Enter the effective thermal resistance of the unheated space"
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
		>
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">
					For example values please refer to the technical paper S11P-028. The maximum value in this paper is 2.5 (m²·K)/W for when the facing wall is not exposed.
				</p>
				<p class="govuk-body">
					<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">
						Guidance on thermal resistance of unheated spaces (opens in another window)
					</a>
				</p>
			</GovDetails>
		</FormKit>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
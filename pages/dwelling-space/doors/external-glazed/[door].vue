<script setup lang="ts">
import { standardPitchOptions } from '#imports';

const title = "External glazed door";
const store = useEcaasStore();
const { saveToList } = useForm();

const doorData = useItemToEdit('door', store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor?.data);
const model: Ref<ExternalGlazedDoorData> = ref(doorData!);

const saveForm = (fields: ExternalGlazedDoorData) => {
	store.$patch((state) => {
		const {dwellingSpaceExternalGlazedDoor} = state.dwellingFabric.dwellingSpaceDoors;

		const commonFields = {
			name: fields.name,
			orientation: fields.orientation,
			surfaceArea: fields.surfaceArea,
			height: fields.height,
			width: fields.width,
			uValue: fields.uValue,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			solarTransmittance: fields.solarTransmittance,
			elevationalHeight: fields.elevationalHeight,
			midHeight: fields.midHeight,
			openingToFrameRatio: fields.openingToFrameRatio
		};

		const door: ExternalGlazedDoorData = {
			...commonFields,
			numberOpenableParts: "1",
			maximumOpenableArea: fields.surfaceArea,
			heightOpenableArea: fields.height,
			midHeightOpenablePart1: fields.midHeight,
		};

		dwellingSpaceExternalGlazedDoor.complete = false;
		saveToList(door, dwellingSpaceExternalGlazedDoor);
	});
	
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
		<GovErrorSummary :error-list="errorMessages" test-id="externalGlazedDoorErrorSummary"/>
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
		<FieldsOrientation />
		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height"
			help="Enter the height of the building element"
			name="height"
			validation="required | number | min:0.001 | max:50"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="Enter the width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
		/>
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area of element"
			help="Enter the net area of the building element. The area of all windows should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FieldsUValue id="uValue" name="uValue" />
		<FormKit
			id="solarTransmittance"
			type="govInputFloat"
			label="Transmittance of solar energy "
			help="Enter the total solar energy transmittance or G value, or the transparent part of the window. It should be a decimal between 0 and 1."
			name="solarTransmittance"
			validation="required | number | min:0.01 | max:1"
		/>
		<FormKit
			id="midHeight"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Mid height"
			help="Enter the height from the ground to the midpoint of the window"
			name="midHeight"
			validation="required | number | min:0 | max:100"
		/>
		<FormKit
			id="openingToFrameRatio"
			type="govInputFloat"
			label="Window to frame ratio"
			help="Enter the proportion of the door taken up by the window. It should be a decimal between 0 and 1."
			name="openingToFrameRatio"
			validation="required | number | min:0 | max:1"
		/>
		<GovLLMWarning />
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
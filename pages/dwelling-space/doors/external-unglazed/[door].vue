<script setup lang="ts">
import { pitchOptions } from '#imports';

const title = "External unglazed door";
const store = useEcaasStore();
const { saveToList } = useForm();

const doorData = useItemToEdit('door', store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor?.data);
const model: Ref<ExternalUnglazedDoorData> = ref(doorData!);

const saveForm = (fields: ExternalUnglazedDoorData) => {
	store.$patch((state) => {
		const {dwellingSpaceExternalUnglazedDoor} = state.dwellingFabric.dwellingSpaceDoors;

		const door: ExternalUnglazedDoorData = {
			name: fields.name,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			orientation: fields.orientation,
			height: fields.height,
			width: fields.width,
			elevationalHeight: fields.elevationalHeight,
			surfaceArea: fields.surfaceArea,
			solarAbsorption: fields.solarAbsorption,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass
		};

		saveToList(door, dwellingSpaceExternalUnglazedDoor);
	});
	store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="externalUnglazedDoorErrorSummary"/>
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
			:options="pitchOptions()"
		/>
		<FieldsOrientation />
		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height"
			help="The height of the building element"
			name="height"
			validation="required | number | min:0.001 | max:50"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="The width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
		/>
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Net area of the building element"
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorption" name="solarAbsorption"/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m²·K)"
			label="U-value"
			help="Steady-state thermal transmittance of the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
		/>
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
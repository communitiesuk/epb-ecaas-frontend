<script setup lang="ts">
const title = "External unglazed door";
const store = useEcaasStore();
const { saveToList } = useForm();

const doorData = useItemToEdit('door', store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalUnglazedDoor?.data);
const model: Ref<ExternalUnglazedDoorData> = ref(doorData!);

const saveForm = (fields: ExternalUnglazedDoorData) => {
	store.$patch((state) => {
		const {livingSpaceExternalUnglazedDoor} = state.livingSpaceFabric.livingSpaceDoors;

		const door: ExternalUnglazedDoorData = {
			name: fields.name,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			orientation: fields.orientation,
			height: fields.height,
			width: fields.width,
			elevationalHeight: fields.elevationalHeight,
			surfaceArea: fields.surfaceArea,
			solarAbsorbtion: fields.solarAbsorbtion,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass
		};

		saveToList(door, livingSpaceExternalUnglazedDoor);
	});

	navigateTo("/living-space/doors");
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
		<FormKit
			id="pitchOption"
			type="govRadios"
			:options="{
				'90': '90',
				custom: 'Custom'
			}"
			label="Pitch"
			help="Tilt angle of the surface from horizontal, between 0 and 180, where 0 means the external surface is facing up, 90 means the external surface is vertical and 180 means the external surface is facing down"
			name="pitchOption"
			validation="required"
		/>
		<FormKit
			v-if="model.pitchOption === 'custom'"
			id="pitch"
			type="govInputWithSuffix"
			suffix-text="degrees"
			name="pitch"
			validation="required | number | min:0 | max:180"
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
		<FormKit
			id="elevationalHeight"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Elevational height of building element at its base"
			help="The distance between the ground and the lowest edge of the element"
			name="elevationalHeight"
			validation="required | number | min:0 | max:500"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m2"
			label="Surface area"
			help="Net area of the opaque building element (i.e. minus any windows / doors / etc.) If the element is not square or rectangular the area might not be equal to width x height, hence the need to ask for this in addition to width and height"
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorbtion" name="solarAbsorbtion"/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m2.K)"
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
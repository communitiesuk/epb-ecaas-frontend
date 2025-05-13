<script setup lang="ts">
const title = "Roof";
const store = useEcaasStore();
const { saveToList } = useForm();

const roofData = useItemToEdit('roof', store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceRoofs?.data);
const model: Ref<RoofData> = ref(roofData!);

const saveForm = (fields: RoofData) => {
	store.$patch((state) => {
		const {livingSpaceRoofs} = state.livingSpaceFabric.livingSpaceCeilingsAndRoofs;

		const roof: RoofData = {
			name: fields.name,
			typeOfRoof: fields.typeOfRoof,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '0' ? 0 : fields.pitch,
			orientation: fields.orientation,
			length: fields.length,
			width: fields.width,
			elevationalHeightOfElement: fields.elevationalHeightOfElement,
			surfaceArea: fields.surfaceArea,
			solarAbsorptionCoefficient: fields.solarAbsorptionCoefficient,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass
		};
		livingSpaceRoofs.complete = false;
		saveToList(roof, livingSpaceRoofs);
	});

	navigateTo("/living-space/ceilings-and-roofs");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="roofErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="typeOfRoof"
			type="govRadios"
			:options="{
				flat: 'Flat roof',
				pitchedInsulatedAtRoof: 'Pitched roof insulated at roof or rafter',
				pitchedInsulatedAtCeiling: 'Pitched roof insulated at ceiling or joist'
			}"
			label="Type of roof"
			name="typeOfRoof"
			validation="required"
		/>
		<FieldsPitch
			v-if="model.typeOfRoof === 'flat'"
			:pitch-option="model.pitchOption"
			:options="{
				'0': '0',
				custom: 'Custom'
			}"
		/>
		<template v-if="['pitchedInsulatedAtRoof', 'pitchedInsulatedAtCeiling'].includes(model.typeOfRoof)">
			<FieldsPitch />
			<FieldsOrientation />
			<div v-if="!!model.orientation" class="govuk-error-summary">
				<div role="alert" class="govuk-hint govuk-!-margin-bottom-0">
					If the pitched roof has multiple orientations (e.g., a gable or hip roof), each orientation must be modelled as a separate roof element.
				</div>
			</div>
		</template>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length"
			help="The length of the building element."
			name="length"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			label="Width"
			help="The width of the building element."
			name="width"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FormKit
			id="elevationalHeightOfElement"
			type="govInputWithSuffix"
			label="Elevational height of building element at its base"
			help="The distance between the ground and the lowest edge of the element."
			name="elevationalHeightOfElement"
			validation="required | number | min:0 | max:500"
			suffix-text="m"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			label="Surface area"
			help="Net area of the opaque building element (i.e. area of all windows / doors should be subtracted before entry). If the element is not square or rectangular the area might not be equal to width x height, hence the need to ask for area in addition to width and height."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			suffix-text="m2"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorptionCoefficient" name="solarAbsorptionCoefficient"/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			label="U-value"
			help="Steady-state thermal transmittance of the building element."
			name="uValue"
			validation="required | number | min:0.01 | max:10"
			suffix-text="W/(m2.K)"
		/>
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
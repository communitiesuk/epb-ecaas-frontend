<script setup lang="ts">
const title = "Unheated pitched roof";
const store = useEcaasStore();
const { saveToList } = useForm();

const roofData = useItemToEdit('roof', store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceUnheatedPitchedRoofs?.data);
const model: Ref<RoofData> = ref(roofData!);

const saveForm = (fields: RoofData) => {
	store.$patch((state) => {
		const {livingSpaceUnheatedPitchedRoofs} = state.livingSpaceFabric.livingSpaceCeilingsAndRoofs;

		const roof: RoofData = {
			name: fields.name,
			typeOfRoof: 'unheatedPitched',
			pitch: fields.pitch,
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
		livingSpaceUnheatedPitchedRoofs.complete = false;
		saveToList(roof, livingSpaceUnheatedPitchedRoofs);
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
		<div class="govuk-error-summary govuk-!-margin-bottom-6">
			<div role="alert" class="govuk-hint govuk-!-margin-bottom-0">
				For an unheated pitched roof the ceiling and roof details should both be inputted on this page.
			</div>
		</div>
		<GovErrorSummary :error-list="errorMessages" test-id="roofErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this unheated pitched roof so it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			label="Net surface area of ceiling"
			help="Net area of the opaque building element. For an unheated pitched roof this input must be for the ceiling."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			suffix-text="m2"
		/>
		<FieldsPitch label="Pitch of roof" />
		<FieldsOrientation label="Orientation of roof" />
		<div v-if="!!model.orientation" class="govuk-error-summary">
			<div role="alert" class="govuk-hint govuk-!-margin-bottom-0">
				If the pitched roof has multiple orientations (e.g., a gable or hip roof), each orientation must be modelled as a separate roof element.
			</div>
		</div>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length of roof"
			help="For unheated pitched roof, model the length of the roof"
			name="length"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			label="Width of roof"
			help="For unheated pitched roof, model the width of the roof."
			name="width"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FieldsElevationalHeight field="elevationalHeightOfElement" />
		<FieldsSolarAbsorptionCoefficient
			id="solarAbsorptionCoefficient"
			name="solarAbsorptionCoefficient"
			label="Solar absorption coefficient of roof"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			label="U-value of roof and ceiling"
			help="For an unheated pitched roof, input the combined value of the ceiling and roof"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
			suffix-text="W/(m2.K)"
		/>
		<FieldsArealHeatCapacity 
			id="kappaValue"
			name="kappaValue"
			label="Areal heat capacity of roof and ceiling"
			help="For an unheated pitched roof, input the combined value of the ceiling and roof"
		/>
		<FieldsMassDistributionClass
			id="massDistributionClass"
			name="massDistributionClass"
			label="Mass distribution class of roof and ceiling"
			help="For an unheated pitched roof, input the combined value of the ceiling and roof"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
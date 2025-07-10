<script setup lang="ts">
import { zeroPitchOptions } from '#imports';

const title = "Roof";
const store = useEcaasStore();
const { saveToList } = useForm();

const roofData = useItemToEdit('roof', store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs?.data);
const model: Ref<RoofData> = ref(roofData!);

const roofTypeOptions: Record<Exclude<RoofType, 'unheatedPitched'>, string> = {
	flat: 'Flat roof',
	pitchedInsulatedAtRoof: 'Pitched roof insulated at roof or rafter',
	pitchedInsulatedAtCeiling: 'Pitched roof insulated at ceiling or joist'
};

const saveForm = (fields: RoofData) => {
	store.$patch((state) => {
		const {dwellingSpaceRoofs} = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

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
		dwellingSpaceRoofs.complete = false;
		saveToList(roof, dwellingSpaceRoofs);
	});

	navigateTo("/dwelling-space/ceilings-and-roofs");
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
			:options="roofTypeOptions"
			label="Type of roof"
			name="typeOfRoof"
			validation="required"
		/>
		<FieldsPitch
			v-if="model.typeOfRoof === 'flat'"
			:pitch-option="model.pitchOption"
			:options="zeroPitchOptions()"
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
			help="Enter the length of the building element"
			name="length"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			label="Width"
			help="Enter the width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FieldsElevationalHeight field="elevationalHeightOfElement" />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			label="Net surface area of element"
			help="Enter the net area of the building element. The area of all windows or doors should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			suffix-text="m²"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorptionCoefficient" name="solarAbsorptionCoefficient"/>
		<FieldsUValue id="uValue" name="uValue" />
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
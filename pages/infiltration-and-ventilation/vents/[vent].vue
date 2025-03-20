<script setup lang="ts">
const title = "Vent";
const store = useEcaasStore();
const { saveToList } = useForm();

const ventData = useItemToEdit('vent', store.infiltrationAndVentilation.vents.data);
const model: Ref<VentData> = ref(ventData!);

const saveForm = (fields: VentData) => {
	store.$patch((state) => {
		const {vents} = state.infiltrationAndVentilation;

		const vent: VentData = {
			name: fields.name,
			typeOfVent: fields.typeOfVent,
			effectiveVentilationArea: fields.effectiveVentilationArea,
			openingRatio: fields.openingRatio,
			airFlowAtMidHeightLevel: fields.airFlowAtMidHeightLevel,
			pressureDifference: fields.pressureDifference,
			orientation: fields.orientation,
			pitch: fields.pitch
		};

		saveToList(vent, vents);
	});

	navigateTo("/infiltration-and-ventilation/vents");
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="ventErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="typeOfVent"
			type="govRadios"
			:options="{
				trickle: 'Trickle',
				airBrick: 'Air brick'
			}"
			label="Type of vent"
			name="typeOfVent"
			validation="required"
		/>
		<FormKit
			id="effectiveVentilationArea"
			type="govInputWithSuffix"
			label="Effective ventilation area"
			help="Effective area of vent opening"
			name="effectiveVentilationArea"
			validation="required | number | min:1 | max:999999"
			suffix-text="cm2"
		/>
		<FormKit
			id="openingRatio"
			type="govInputFloat"
			label="Vent opening ratio"
			help="Amount the vent is open. 0 = fully closed, 1 = fully open"
			name="openingRatio"
			validation="required | number | min:0 | max:1"
		/>
		<FormKit
			id="airFlowAtMidHeightLevel"
			type="govInputWithSuffix"
			label="Air flow at mid height level"
			help="The mid height of the zone that the extract vent serves"
			name="airFlowAtMidHeightLevel"
			validation="required | number | min:1 | max:60"
			suffix-text="m"
		/>
		<FormKit
			id="pressureDifference"
			type="govInputWithSuffix"
			label="Pressure difference"
			help="Reference pressure difference for vent"
			name="pressureDifference"
			validation="required | number"
			suffix-text="pa"
		/>
		<FormKit
			id="orientation"
			type="govInputWithSuffix"
			label="Orientation"
			help="Is the orientation angle of the inclined surface, expressed as the geographical azimuth angle of the horizontal projection of the inclined  surface normal, 0 to 360. 0 = north, 90 = east, 180 = south, 270 = west."
			name="orientation"
			validation="required | number | min:0 | max:360"
			suffix-text="degrees"
		/>
		<FormKit
			id="pitch"
			type="govInputWithSuffix"
			label="Pitch"
			help="The tilt angle of the surface from horizontal, in degrees between 0 and 180 (0 means external surface is facing up, 90 means external surface is vertical and 180 means external surface is facing down)"
			name="pitch"
			validation="required | number | min:0 | max:180"
			suffix-text="degrees"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
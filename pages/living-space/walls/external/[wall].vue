<script setup lang="ts">
const title = "External wall";
const store = useEcaasStore();
const { saveToList } = useForm();

const wallData = useItemToEdit('wall', store.livingSpaceFabric.livingSpaceWalls.livingSpaceExternalWall?.data);
const model: Ref<ExternalWallData> = ref(wallData!);

const saveForm = (fields: ExternalWallData) => {
	store.$patch((state) => {
		const {livingSpaceWalls} = state.livingSpaceFabric;

		const wall: ExternalWallData = {
			name: fields.name,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			orientation: fields.orientation,
			height: fields.height,
			length: fields.length,
			elevationalHeight: fields.elevationalHeight,
			surfaceArea: fields.surfaceArea,
			solarAbsorption: fields.solarAbsorption,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass
		};

		if (!livingSpaceWalls.livingSpaceExternalWall) {
			livingSpaceWalls.livingSpaceExternalWall = { data: [] };
		}
		livingSpaceWalls.livingSpaceExternalWall.complete = false;
		saveToList(wall, livingSpaceWalls.livingSpaceExternalWall);
	});

	navigateTo("/living-space/walls");
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
		<GovErrorSummary :error-list="errorMessages" test-id="externalWallErrorSummary"/>
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
			:options="{
				'90': '90',
				custom: 'Custom'
			}"
		/>
		<FormKit
			id="orientation"
			type="govInputWithSuffix"
			suffix-text="degrees"
			label="Orientation"
			name="orientation"
			validation="required | number | min:0 | max:360">
			<GovDetails summary-text="Help with this input">
				<img src="/img/orientation-measurement.png" alt="Orientation measurement">
				<p class="govuk-hint">To define an object's orientation, measure the angle of its outside face clockwise from true North, accurate to the nearest degree.</p>
				<p class="govuk-hint">If a wall has multiple orientations (i.e a hexagonal wall) each different orientation needs to be modelled separately</p>
			</GovDetails>
		</FormKit>
		
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
			id="length"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Length"
			help="The length of the building element"
			name="length"
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
			help="Net area of the opaque building element (i.e. area of all windows / doors should be subtracted before entry). If the element is not square or rectangular the area might not be equal to width x height, hence the need to ask for area in addition to width and height."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorption" name="solarAbsorption"/>
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
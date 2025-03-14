<script setup lang="ts">

const title = "Exposed floor";
const store = useEcaasStore();
const route = useRoute();

const floorData = useItemToEdit('floor', store.livingSpaceFabric.livingSpaceFloors.livingSpaceExposedFloor?.data);
const model: Ref<ExposedFloorData> = ref(floorData!);

const saveForm = (fields: ExposedFloorData) => {
	store.$patch((state) => {
		const {livingSpaceFloors} = state.livingSpaceFabric;

		if (!livingSpaceFloors.livingSpaceExposedFloor?.data) {
			livingSpaceFloors.livingSpaceExposedFloor = {data: []};
		}

		const floor: ExposedFloorData = {
			name: fields.name,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '180' ? 180 : fields.pitch,
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

		if (route.params.floor && route.params.floor !== 'create') {
			const index = parseInt(route.params.floor as string);
			livingSpaceFloors.livingSpaceExposedFloor.data[index] = floor;
		} else {
			livingSpaceFloors.livingSpaceExposedFloor.data.push(floor);
		}

		livingSpaceFloors.livingSpaceExposedFloor.complete = true;
	});

	navigateTo("/living-space/floors");
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
		<GovErrorSummary :error-list="errorMessages" test-id="exposedFloorErrorSummary"/>
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
				'180': '180',
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
		<FormKit
			id="orientation"
			type="govInputWithSuffix"
			suffix-text="degrees"
			label="Orientation"
			help="The orientation angle of the inclined surface, expressed as the geographical azimuth angle of the horizontal projection of the inclined surface normal, 0 to 360"
			name="orientation"
			validation="required | number | min:0 | max:360"
		/>
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
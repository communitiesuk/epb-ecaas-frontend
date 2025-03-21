<script setup lang="ts">
const title = "Wall to unheated space";
const store = useEcaasStore();
const { saveToList } = useForm();

const wallData = useItemToEdit('wall', store.livingSpaceFabric.livingSpaceWalls.livingSpaceWallToUnheatedSpace?.data);
const model: Ref<WallsToUnheatedSpaceData> = ref(wallData!);

const saveForm = (fields: WallsToUnheatedSpaceData) => {
	store.$patch((state) => {
		const {livingSpaceWalls} = state.livingSpaceFabric;

		const wall: WallsToUnheatedSpaceData = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			uValue: fields.uValue,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace
		};

		if (!livingSpaceWalls.livingSpaceWallToUnheatedSpace) {
			livingSpaceWalls.livingSpaceWallToUnheatedSpace = { data: [] };
		}

		saveToList(wall, livingSpaceWalls.livingSpaceWallToUnheatedSpace);
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
		<GovErrorSummary :error-list="errorMessages" test-id="wallToUnheatedSpaceErrorSummary"/>
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
				custom : 'Custom'
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
			id="surfaceAreaOfElement"
			type="govInputWithSuffix"
			suffix-text="m2"
			label="Surface area of element"
			help="Net area of the opaque building element (i.e. area of all windows / doors should be subtracted before entry). If the element is not square or rectangular the area might not be equal to width x height, hence the need to ask for area in addition to width and height."
			name="surfaceAreaOfElement"
			validation="required | number | min:0 | max:10000"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m2.K)"
			label="U-value"
			help="Steady-state thermal transmittance of the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
		/>
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="m2.K/W"
			label="Thermal resistance of adjacent unheated space"
			help="The effective thermal resistance of the unheated space. For example values, please refer to technical paper S11P-028. Max value in the paper is: Facing wall not exposed, 2.5 (m^2.K) / W"
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
		/>

		<FormKit
			type="govButton"
			label="Save and continue"
		/>

	</FormKit>

</template>
<script setup lang="ts">
const title = "Wall to unheated space";
const store = useEcaasStore();
const route = useRoute();
 
const wallData = useItemToEdit('wall', store.livingSpaceFabric.livingSpaceWalls.livingSpaceWallToUnheatedSpace?.data);
const model: Ref<WallsToUnheatedSpaceData> = ref(wallData!);

const saveForm = (fields: WallsToUnheatedSpaceData) => {
	store.$patch((state) => {
		const {livingSpaceWalls} = state.livingSpaceFabric;

		if (!livingSpaceWalls.livingSpaceWallToUnheatedSpace?.data) {
			livingSpaceWalls.livingSpaceWallToUnheatedSpace = { data: [] };
		}

		const wall: WallsToUnheatedSpaceData = {
			name:fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			uValue: fields.uValue,
			arealHeatCapacity : fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace
		};


		if (route.params.wall && route.params.wall !== 'create') {
			const index = parseInt(route.params.wall as string);
			livingSpaceWalls.livingSpaceWallToUnheatedSpace.data[index] = wall;
		} else {
			livingSpaceWalls.livingSpaceWallToUnheatedSpace.data.push(wall);
		}

		livingSpaceWalls.livingSpaceWallToUnheatedSpace.complete = true;
	});

	navigateTo("/living-space/walls");
};


const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
			help="Give this element a name so it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="surfaceAreaOfElement"
			type="govInputWithSuffix"
			suffix-text="m2"
			label="Surface area of element"
			help="Net area of the building element"
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
		<FormKit
			id="arealHeatCapacity"
			type="govInputWithSuffix"
			suffix-text="J/m2.K"
			label="Areal heat capacity"
			help="Effective areal heat capacity or kappa value. This is the total heat capacity of all the construction layers, that is, the sum of the heat capacities of each individual layers. 
    (Note that this is different to the effectiveness thickness definition of areal heat capacity used in SAP10 and in other monthly models.)"
			name="arealHeatCapacity"
			validation="required | number | min:100 | max:5000000"
		/>
		<FormKit
			id="massDistributionClass"
			type="govRadios"
			:options="{
				internal: 'Mass distributed on internal side',
				external: 'Mass concentrated on external side',
				divided: 'Mass divided over internal and external side',
				equally: 'Mass equally distributed',
				inside: 'Mass concentrated inside',
			}"
			label="Mass distribution class"
			help="Distribution of mass in building element"
			name="massDistributionClass"
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
<script setup lang="ts">
const title = "Internal wall";
const store = useEcaasStore();
const route = useRoute();

const wallData = useItemToEdit('wall', store.livingSpaceFabric.livingSpaceWalls.livingSpaceInternalWall.data);
const model: Ref<InternalWallData> = ref(wallData!);

const saveForm = (fields: InternalWallData) => {
	store.$patch((state) => {
		const { livingSpaceWalls } = state.livingSpaceFabric;
		
		if (!livingSpaceWalls.livingSpaceInternalWall.data) {
			livingSpaceWalls.livingSpaceInternalWall = { data: [] };
		}

		const wall: InternalWallData = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '0' ? 0 : fields.pitch
		};

		if (route.params.wall && route.params.wall !== 'create') {
			const index = parseInt(route.params.wall as string);
			livingSpaceWalls.livingSpaceInternalWall.data[index] = wall;
		} else {
			livingSpaceWalls.livingSpaceInternalWall.data.push(wall);
		}

		livingSpaceWalls.livingSpaceInternalWall.complete = true;
	});

	navigateTo("/living-space/walls");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
		<GovErrorSummary :error-list="errorMessages" test-id="internalWallErrorSummary"/>
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
			label="Surface area of element"
			help="Net area of the building element"
			name="surfaceAreaOfElement"
			validation="required | number | min:0 | max:10000"
			suffix-text="m2"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			label="U-value"
			help="Steady-state thermal transmittance of the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
			suffix-text="W/(m2.K)"
		/>
		<FormKit
			id="kappaValue"
			type="govInputWithSuffix"
			suffix-text="J/m2.K"
			label="Areal heat capacity"
			help="Effective areal heat capacity or kappa value. This is the total heat capacity of all the construction layers, that is, the sum of the heat capacities of each individual layers. The mass distribution class is used to determine which layers of the construction are relevant to thermal mass heat storage in the model. (Note that this is different to the effectiveness thickness definition of areal heat capacity used in SAP10 and in other monthly models.)"
			name="kappaValue"
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
			help="Distribution of mass in building element."
			name="massDistributionClass"
			validation="required"
		/>
		<FormKit
			id="pitchOption"
			type="govRadios"
			:options="{
				'0': '0',
				custom: 'Custom'
			}"
			label="Pitch"
			help="Tilt angle of the surface from horizontal, between 0 and 180, where 0 means the external surface is facing up, 90 means the external surface is vertical and 180 means the external surface is facing down."
			name="pitchOption"
			validation="required"
		/>
		<FormKit
			v-if="model.pitchOption === 'custom'"
			id="pitch"
			type="govInputWithSuffix"
			suffix-text="degrees"
			name="pitch"
			validation="required | number"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
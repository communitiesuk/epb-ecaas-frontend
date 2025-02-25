<script setup lang="ts">
const title = "Internal door";
const store = useEcaasStore();
const route = useRoute();

const doorData = useItemToEdit('door', store.livingSpaceFabric.livingSpaceDoors.livingSpaceInternalDoor?.data);
const model: Ref<InternalDoorData> = ref(doorData!);

const saveForm = (fields: InternalDoorData) => {
	store.$patch((state) => {
		const { livingSpaceDoors } = state.livingSpaceFabric;

		if (!livingSpaceDoors.livingSpaceInternalDoor?.data) {
			livingSpaceDoors.livingSpaceInternalDoor = { data: [] };
		}

		const door: InternalDoorData = {
			typeOfCeiling: fields.typeOfCeiling,
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
		};

		if (route.params.door && route.params.door !== 'create') {
			const index = parseInt(route.params.door as string);
			livingSpaceDoors.livingSpaceInternalDoor.data[index] = door;
		} else {
			livingSpaceDoors.livingSpaceInternalDoor.data.push(door);
		}

		livingSpaceDoors.livingSpaceInternalDoor.complete = true;
	});

	navigateTo("/living-space/doors");
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
		<GovErrorSummary :error-list="errorMessages" test-id="internalDoorErrorSummary"/>
		<FormKit
			id="typeOfCeiling"
			type="govRadios"
			:options="{
				heatedSpace: 'Internal door to heated space',
				unheatedSpace: 'Internal door to unheated space'
			}"
			label="Type"
			help="Selecting the type of ceiling affects what inputs are necessary."
			name="typeOfCeiling"
			validation="required"
		/>
		<template v-if="!!model.typeOfCeiling">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Give this element a name so it can be identified later."
				name="name"
				validation="required"
			/>
			<FormKit
				id="surfaceArea"
				type="govInputWithSuffix"
				label="Surface area of element"
				help="Net area of the building element"
				name="surfaceArea"
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
				help="Effective areal heat capacity or kappa value. This is the total heat capacity of all the construction layers, that is, the sum of the heat capacities of each individual layers. (Note that this is different to the effectiveness thickness definition of areal heat capacity used in SAP10 and in other monthly models.)"
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
					'90': '90',
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
		</template>
		<FormKit
			v-if="model.typeOfCeiling === 'unheatedSpace'"
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="m2·K/W"
			label="Thermal resistance of adjacent unheated space"
			help="The effective thermal resistance of the unheated space. For example values, please refer to technical paper S11P-028. Max value in the paper is: Facing wall not exposed, 2.5 (m^2.K) / W."
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
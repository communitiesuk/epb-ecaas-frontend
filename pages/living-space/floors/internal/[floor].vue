<script setup lang="ts">
import MassDistributionClass from "~/components/fields/MassDistributionClass.vue";

const title = "Internal floor";
const store = useEcaasStore();
const route = useRoute();

const floorData = useItemToEdit('floor', store.livingSpaceFabric.livingSpaceFloors.livingSpaceInternalFloor?.data);
const model: Ref<InternalFloorData> = ref(floorData!);

const saveForm = (fields: InternalFloorData) => {
	store.$patch((state) => {
		const { livingSpaceFloors } = state.livingSpaceFabric;
		
		if (!livingSpaceFloors.livingSpaceInternalFloor?.data) {
			livingSpaceFloors.livingSpaceInternalFloor = { data: [] };
		}

		const floor: InternalFloorData = {
			name: fields.name,
			typeOfInternalFloor: fields.typeOfInternalFloor,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '0' ? 0 : fields.pitch,
			thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace
		};

		if (route.params.floor && route.params.floor !== 'create') {
			const index = parseInt(route.params.floor as string);
			livingSpaceFloors.livingSpaceInternalFloor.data[index] = floor;
		} else {
			livingSpaceFloors.livingSpaceInternalFloor.data.push(floor);
		}

		livingSpaceFloors.livingSpaceInternalFloor.complete = true;
	});

	navigateTo("/living-space/floors");
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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="internalFloorErrorSummary"/>
		<FormKit
			id="typeOfInternalFloor"
			type="govRadios"
			:options="{
				heatedSpace: 'Internal floor to heated space',
				unheatedSpace: 'Internal floor to unheated space'
			}"
			label="Type of internal floor"
			help="This affects what inputs are necessary."
			name="typeOfInternalFloor"
			validation="required"
		/>
		<template v-if="!!model.typeOfInternalFloor">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Give this element a name so it can be identified later."
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
			<FieldsArealHeatCapacity id="kappaValue" name="kappaValue" />
      <MassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
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
		</template>
		<FormKit
			v-if="model.typeOfInternalFloor === 'unheatedSpace'"
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
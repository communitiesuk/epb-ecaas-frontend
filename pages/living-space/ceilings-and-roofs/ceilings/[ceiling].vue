<script setup lang="ts">
const title = "Ceiling";
const store = useEcaasStore();
const route = useRoute();

const ceilingData = useItemToEdit('ceiling', store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceCeilings?.data);
const model: Ref<CeilingData> = ref(ceilingData!);

const saveForm = (fields: CeilingData) => {
	store.$patch((state) => {
		const { livingSpaceCeilingsAndRoofs } = state.livingSpaceFabric;

		if (!livingSpaceCeilingsAndRoofs.livingSpaceCeilings?.data) {
			livingSpaceCeilingsAndRoofs.livingSpaceCeilings = { data: [] };
		}

		const ceiling: CeilingData = {
			type: fields.type,
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '180' ? 180 : fields.pitch,
			thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
		};

		if (route.params.ceiling && route.params.ceiling !== 'create') {
			const index = parseInt(route.params.ceiling as string);
			livingSpaceCeilingsAndRoofs.livingSpaceCeilings.data[index] = ceiling;
		} else {
			livingSpaceCeilingsAndRoofs.livingSpaceCeilings.data.push(ceiling);
		}

		livingSpaceCeilingsAndRoofs.livingSpaceCeilings.complete = true;
	});

	navigateTo("/living-space/ceilings-and-roofs");
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
		<GovErrorSummary :error-list="errorMessages" test-id="ceilingErrorSummary"/>

		<FormKit
			id="type"
			type="govRadios"
			:options="{
				heated: 'Ceiling to heated space ',
				unheated: 'Ceiling to unheated space',
			}"
			label="Type of ceiling"
			help="This affects what inputs are necessary"
			name="type"
			validation="required"
		/>
		<template v-if="!!model.type">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Give this element a name so it can be identified later "
				name="name"
				validation="required"
			/>
			<FormKit
				id="surfaceArea"
				type="govInputWithSuffix"
				suffix-text="m2"
				label="Surface area"
				help="Net area of the building element"
				name="surfaceArea"
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
			<FieldsArealHeatCapacity id="kappaValue" name="kappaValue" />
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
		</template>
		<FormKit
			v-if="model.type === 'unheated'"
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
<script setup lang="ts">
import type { ZeroPitchOption } from '~/stores/ecaasStore.types';

const title = "Ceiling";
const store = useEcaasStore();
const { saveToList } = useForm();

const ceilingData = useItemToEdit('ceiling', store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings?.data);
const model: Ref<CeilingData> = ref(ceilingData!);

const ceilingPitchOptions: Record<ZeroPitchOption, Capitalize<ZeroPitchOption>> = {
	'0': '0',
	custom: 'Custom'
};

const typeOfCeilingOptions = adjacentSpaceTypeOptions('Ceiling');

const saveForm = (fields: CeilingData) => {
	store.$patch((state) => {
		const {dwellingSpaceCeilings} = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

		const commonFields = {
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '0' ? 0 : fields.pitch,
		};

		let ceiling: CeilingData;

		if (fields.type === 'unheatedSpace') {
			ceiling = {
				...commonFields,
				type: fields.type,
				uValue: fields.uValue,
				thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
			};
		} else if (fields.type === 'heatedSpace') {
			ceiling = {
				...commonFields,
				type: fields.type,
			};
		} else {
			throw new Error("Invalid ceiling type");
		}

		dwellingSpaceCeilings.complete = false;
		saveToList(ceiling, dwellingSpaceCeilings);
	});

	navigateTo("/dwelling-space/ceilings-and-roofs");
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
		<GovErrorSummary :error-list="errorMessages" test-id="ceilingErrorSummary"/>

		<FormKit
			id="type"
			type="govRadios"
			:options="typeOfCeilingOptions"
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
				help="Provide a name for this element so that it can be identified later"
				name="name"
				validation="required"
			/>
			<FieldsPitch
				:pitch-option="model.pitchOption"
				:options="ceilingPitchOptions"
			/>
			<FormKit
				id="surfaceArea"
				type="govInputWithSuffix"
				suffix-text="m²"
				label="Net surface area"
				help="Net area of the building element"
				name="surfaceArea"
				validation="required | number | min:0 | max:10000"
			/>
			<FormKit
				v-if="model.type !== 'heatedSpace'"
				id="uValue"
				type="govInputWithSuffix"
				suffix-text="W/(m²·K)"
				label="U-value"
				help="Steady-state thermal transmittance of the building element"
				name="uValue"
				validation="required | number | min:0.01 | max:10"
			/>
			<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
			<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		</template>
		<FormKit
			v-if="model.type === 'unheatedSpace'"
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of adjacent unheated space"
			help="The effective thermal resistance of the unheated space. For example values, please refer to technical paper S11P-028. Max value in the paper is: Facing wall not exposed, 2.5 (m^2.K) / W."
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
		>
			<p class="govuk-body">
				<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">
					Guidance on thermal resistance of unheated spaces (opens in another window)
				</a>
			</p>
		</FormKit>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
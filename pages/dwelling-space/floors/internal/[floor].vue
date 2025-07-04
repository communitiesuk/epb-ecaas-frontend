<script setup lang="ts">
import { AdjacentSpaceType } from '~/stores/ecaasStore.types';

const title = "Internal floor";
const store = useEcaasStore();
const { saveToList } = useForm();

const floorData = useItemToEdit('floor', store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor?.data);
const model: Ref<InternalFloorData> = ref(floorData!);

const typeOfInternalFloorOptions = adjacentSpaceTypeOptions('Internal floor');

const saveForm = (fields: InternalFloorData) => {
	store.$patch((state) => {
		const {dwellingSpaceFloors} = state.dwellingFabric;

		const commonFields = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
		};

		let floor: InternalFloorData;

		if (fields.typeOfInternalFloor === 'unheatedSpace') {
			floor = {
				...commonFields,
				typeOfInternalFloor: fields.typeOfInternalFloor,
				thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
			
			};
		} else if (fields.typeOfInternalFloor === 'heatedSpace') {
			floor = {
				...commonFields,
				typeOfInternalFloor: fields.typeOfInternalFloor,
			};
		} else {
			throw new Error("Invalid floor type");
		}

		if (!dwellingSpaceFloors.dwellingSpaceInternalFloor) {
			dwellingSpaceFloors.dwellingSpaceInternalFloor = {data: []};
		}
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor!.complete = false;
		saveToList(floor, dwellingSpaceFloors.dwellingSpaceInternalFloor);
	});
	navigateTo("/dwelling-space/floors");
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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="internalFloorErrorSummary"/>
		<FormKit
			id="typeOfInternalFloor"
			type="govRadios"
			:options="typeOfInternalFloorOptions"
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
				help="Provide a name for this element so that it can be identified later"
				name="name"
				validation="required"
			/>
			<FormKit
				id="surfaceAreaOfElement"
				type="govInputWithSuffix"
				label="Net surface area of element"
				help="Net area of the building element"
				name="surfaceAreaOfElement"
				validation="required | number | min:0 | max:10000"
				suffix-text="m²"
			/>
			<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
			<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		</template>
		<FormKit
			v-if="model.typeOfInternalFloor === AdjacentSpaceType.unheatedSpace"
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
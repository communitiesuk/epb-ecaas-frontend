<script setup lang="ts">
const title = "Exposed floor";
const store = useEcaasStore();
const { saveToList } = useForm();

const floorData = useItemToEdit('floor', store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor?.data);
const model: Ref<ExposedFloorData> = ref(floorData!);

const saveForm = (fields: ExposedFloorData) => {	

	store.$patch((state) => {
		const {dwellingSpaceFloors} = state.dwellingFabric;

		const floor: ExposedFloorData = {
			name: fields.name,
			pitch: 180,
			orientation: 0,
			length: fields.length,
			width: fields.width,
			elevationalHeight: fields.elevationalHeight,
			surfaceArea: fields.surfaceArea,
			solarAbsorption: fields.solarAbsorption,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass
		};

		if (!dwellingSpaceFloors.dwellingSpaceExposedFloor) {
			dwellingSpaceFloors.dwellingSpaceExposedFloor = { data: [] };
		}
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor!.complete = false;
		saveToList(floor, dwellingSpaceFloors.dwellingSpaceExposedFloor);
	}); 
	navigateTo("/dwelling-space/floors");
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
			id="length"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Length"
			help="The length of the building element"
			name="length"
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
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Net area of the building element"
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorption" name="solarAbsorption"/>
		<FormKit
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
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
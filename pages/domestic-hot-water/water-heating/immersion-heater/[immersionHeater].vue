<script setup lang="ts">
const title = "Immersion heater";
const store = useEcaasStore();
const { saveToList } = useForm();

const immersionHeaterData = useItemToEdit('immersionHeater', store.domesticHotWater.waterHeating.immersionHeater.data);
const model: Ref<ImmersionHeaterData> = ref(immersionHeaterData!);

const saveForm = (fields: ImmersionHeaterData) => {
	store.$patch((state) => {
		const {immersionHeater} = state.domesticHotWater.waterHeating;

		const immersionHeaterItem: ImmersionHeaterData = {
			name: fields.name,
			ratedPower: fields.ratedPower,
			heaterPosition: fields.heaterPosition,
			thermostatPosition: fields.heaterPosition
		};

		saveToList(immersionHeaterItem, immersionHeater);
		immersionHeater.complete = false;
	});

	navigateTo("/domestic-hot-water/water-heating");
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="immersionHeaterErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="ratedPower"
			type="govInputWithSuffix"
			label="Rated power"
			help="The power rating of the immersion heater, indicating its heating capacity"
			name="ratedPower"
			validation="required | number"
			suffix-text="kW"
		/>
		<FormKit
			id="heaterPosition"
			type="govRadios"
			:options="new Map([
				['1', 'Top'],
				['0.5', 'Middle'],
				['0', 'Bottom']
			])"
			value-type="number"
			label="Heater position"
			help="Specify where the immersion heater is installed within the tank"
			name="heaterPosition"
			validation="required"
		/>
		<FormKit
			id="thermostatPosition"
			type="govRadios"
			:options="new Map([
				['1', 'Top'],
				['0.5', 'Middle'],
				['0', 'Bottom']
			])"
			value-type="number"
			label="Thermostat position"
			help="Enter the location of the thermostat sensor in the tank"
			name="thermostatPosition"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
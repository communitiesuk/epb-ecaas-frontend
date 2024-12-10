<script setup lang="ts">
	const store = useEcaasStore();

	const model = ref({
		...store.dwellingDetails.appliancesAndElectricity.data
	});

	const energyRatingOptions = {
		a: 'A',
		b: 'B',
		c: 'C',
		d: 'D',
		e: 'E',
		f: 'F',
		na: 'N/A'
	};

	const saveForm = (fields: typeof model.value) => {
		store.$patch({
			dwellingDetails: {
				appliancesAndElectricity: {
					data: {
						fridgeFreezerEnergyRating: fields.fridgeFreezerEnergyRating,
						dishwasherEnergyRating: fields.dishwasherEnergyRating,
						ovenCookerEnergyRating: fields.ovenCookerEnergyRating,
						washingMachineEnergyRating: fields.washingMachineEnergyRating,
						tumbleDryerEnergyRating: fields.tumbleDryerEnergyRating,
						electricVehicleCharger: fields.electricVehicleCharger,
						electricityGridConnection: fields.electricityGridConnection,
						electricityTariff: fields.electricityTariff
					},
					complete: true,
				},
			},
		});

		navigateTo("/dwelling-details");
	};

	const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>Appliances and electricity</Title>
	</Head>
	<FormKit type="form" v-model="model" @submit="saveForm" @submit-invalid="handleInvalidSubmit" :actions="false" :incomplete-message="false">
		<GovErrorSummary :error-list="errorMessages" test-id="appliancesAndElectricityErrorSummary"/>
		<h2 class="govuk-heading-l">Appliances</h2>
		<FormKit
			type="govDropdown"
			label="Fridge/freezer energy rating"
			id="fridgeFreezerEnergyRating"
			name="fridgeFreezerEnergyRating"
			:options="energyRatingOptions"
			validation="required"
		/>
		<FormKit
			type="govDropdown"
			label="Dishwasher energy rating"
			id="dishwasherEnergyRating"
			name="dishwasherEnergyRating"
			:options="energyRatingOptions"
			validation="required"
		/>
		<FormKit
			type="govDropdown"
			label="Oven/cooker energy rating"
			id="ovenCookerEnergyRating"
			name="ovenCookerEnergyRating"
			:options="energyRatingOptions"
			validation="required"
		/>
		<FormKit
			type="govDropdown"
			label="Washing machine energy rating"
			id="washingMachineEnergyRating"
			name="washingMachineEnergyRating"
			:options="energyRatingOptions"
			validation="required"
		/>
		<FormKit
			type="govDropdown"
			label="Tumble dryer energy rating"
			id="tumbleDryerEnergyRating"
			name="tumbleDryerEnergyRating"
			:options="energyRatingOptions"
			validation="required"
		/>
		<FormKit
			type="govDropdown"
			:options="{
				yes: 'Yes',
				no: 'No'
			}"
			label="Electric vehicle charger"
			id="electricVehicleCharger"
			name="electricVehicleCharger"
			validation="required"
		/>
		<hr class="govuk-!-margin-bottom-6" />
		<h2 class="govuk-heading-l">Electricity</h2>
		<FormKit
			type="govRadios"
			:options="{
				onePhase: '1 phase',
				threePhase: '3 phase',
				none: 'None'
			}"
			label="Electricity grid connection"
			id="electricityGridConnection"
			name="electricityGridConnection"
			validation="required"
			:details="{
				summaryText: 'More information',
				text: 'Whether the dwelling\'s connection to the electricity grid is 1-phase (typical), 3 phase (to support higher electricity loads) or absent altogether (rare). This input is not currently used by the model and will not affect the results, future developments will make use of this data.'
			}"
		/>
		<FormKit
			type="govRadios"
			:options="{
				standardTariff: 'Standard tariff',
				sevenHourTariffControl: '7 hour tariff control'
			}"
			label="Electricity tariff"
			id="electricityTariff"
			name="electricityTariff"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
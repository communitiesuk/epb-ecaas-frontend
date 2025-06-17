<script setup lang="ts">
import { FuelType } from '~/schema/api-schema.types';

const title = "Energy supply";
const store = useEcaasStore();

const model = ref({
	...store.heatingSystems.energySupply.data
});

const fuelTypeOptions: Record<FuelType.electricity, Capitalize<FuelType.electricity>> = {
	[FuelType.electricity]: 'Electricity'
};

const saveForm = (fields: EnergySupplyData) => {
	store.$patch({
		heatingSystems: {
			energySupply: {
				data: {
					fuelType: fields.fuelType,
					exported: fields.exported,
					co2PerKwh: fields.co2PerKwh,
					co2PerKwhIncludingOutOfScope: fields.co2PerKwhIncludingOutOfScope,
					kwhPerKwhDelivered: fields.kwhPerKwhDelivered
				},
				complete: true
			},
		},
	});

	navigateTo("/heating-systems");
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
		<GovErrorSummary :error-list="errorMessages" test-id="energySupplyErrorSummary"/>
		<FormKit
			id="fuelType"
			type="govCheckboxes"
			name="fuelType"
			label="Energy supply by fuel type"
			help="For now, this service only allows modelling based on electricity. More options will be available in future releases."
			:options="fuelTypeOptions"
			validation="required"
		/>
		<template v-if="model.fuelType?.includes(FuelType.custom)">
			<FormKit
				id="co2PerKwh"
				type="govInputWithSuffix"
				label="CO2 per kWh"
				help="Equivalent amount of CO2 emissions per kWh used. CO2e is the CO2 equivalent, including other greenhouse gases like methane which may have been emitted in addition to CO2."
				name="co2PerKwh"
				validation="required | number"
				suffix-text="kgCO2e/kWh"
			/>
			<FormKit
				id="co2PerKwhIncludingOutOfScope"
				type="govInputWithSuffix"
				label="CO2 per kWh (including out of scope)"
				help="Equivalent amount of CO2 emissions per kWh used, including out-of-scope emissions"
				name="co2PerKwhIncludingOutOfScope"
				validation="required | number"
				suffix-text="kgCO2e/kWh"
			/>
			<FormKit
				id="kwhPerKwhDelivered"
				type="govInputFloat"
				label="kWh per kWh delivered"
				help="For every kWh delivered to the home, the actual amount of primary energy in kWh needed to deliver that kWh."
				name="kwhPerKwhDelivered"
				validation="required | number"
			/>
		</template>
		<FormKit
			v-if="model.fuelType?.includes(FuelType.electricity)"
			id="exported"
			type="govBoolean"
			label="Can electricity be exported back to the grid?"
			name="exported"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
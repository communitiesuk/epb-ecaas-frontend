<script setup lang="ts">
import { getUrl } from "#imports";
import { FuelType } from "~/schema/api-schema.types";

const title = "Energy supply";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

const model = ref({
	...store.heatingAndCoolingSystems.energySupply.data,
});

const fuelTypeOptions: Record<FuelType.electricity, Capitalize<FuelType.electricity>> = {
	[FuelType.electricity]: "Electricity",
};

const saveForm = (fields: EnergySupplyData) => {
	store.$patch({
		heatingAndCoolingSystems: {
			energySupply: {
				data: {
					fuelType: fields.fuelType,
					exported: fields.exported,
					co2PerKwh: fields.co2PerKwh,
					co2PerKwhIncludingOutOfScope: fields.co2PerKwhIncludingOutOfScope,
					kwhPerKwhDelivered: fields.kwhPerKwhDelivered,
				},
				complete: true,
			},
		},
	});

	navigateTo("/heating-and-cooling-systems");
};

autoSaveForm(model, (state, newData) => {
	state.heatingAndCoolingSystems.energySupply = newData;
});

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
			data-field="EnergySupply.*.fuel"
		/>
		<template v-if="model.fuelType?.includes(FuelType.custom)">
			<ClientOnly>
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
			</ClientOnly>
		</template>
		
		<ClientOnly>
			<FormKit
				v-if="model.fuelType?.includes(FuelType.electricity)"
				id="exported"
				type="govBoolean"
				label="Can electricity be exported back to the grid?"
				name="exported"
				validation="required"
				data-field="EnergySupply.*.is_export_capable"
			/>
		</ClientOnly>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('heatingAndCoolingSystems')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
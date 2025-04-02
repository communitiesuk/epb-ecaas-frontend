<script lang="ts" setup>
const title = "Electric battery";
const store = useEcaasStore();

const model = ref({
	...store.pvAndEnergyStorage.electricBattery.data
});

const saveForm = (fields: ElectricBatteryData) => {
	store.$patch({
		pvAndEnergyStorage: {
			electricBattery: {
				data: fields,
				complete: true
			}
		}
	});

	navigateTo("/pv-storage");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const chargeRateMaxGreaterThanMin = (node: FormKitNode) => {
	const parent = node.at("$parent");
	if (parent && parent.value) {
		const formValue = parent.value as ElectricBatteryData;
		const { minimumChargeRate, maximumChargeRate } = formValue;
		if (!minimumChargeRate || !maximumChargeRate) {
			return true;
		}
		return minimumChargeRate <= maximumChargeRate;
	}
	return true;
};
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
		<GovErrorSummary :error-list="errorMessages" test-id="electricBatteryErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this battery so it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="capacity"
			type="govInputWithSuffix"
			label="Capacity"
			help="Maximum capacity of the battery"
			name="capacity"
			validation="required | number | min:0 | max:50"
			suffix-text="kWh"
		/>
		<FormKit
			id="batteryAge"
			type="govInputWithSuffix"
			label="Battery age"
			help="The starting age of the battery in years"
			name="batteryAge"
			validation="required | number | min:0 | max:100"
			suffix-text="years"
		/>
		<FormKit
			id="chargeEfficiency"
			type="govInputFloat"
			label="Charge/discharge efficiency"
			help="The percentage of energy retained during charging and discharging. Higher efficiency means less energy loss. Decimal between 0-1"
			name="chargeEfficiency"
			validation="required | number | min:0 | max:1"
		/>
		<FormKit
			id="location"
			type="govRadios"
			:options="{
				inside: 'Inside',
				outside: 'Outside',
			}"
			label="Location"
			name="location"
			validation="required"
		/>
		<FormKit
			id="gridChargingPossible"
			type="govRadios"
			:options="{
				yes: 'Yes',
				no: 'No',
			}"
			label="Charging from the grid"
			name="gridChargingPossible"
			validation="required"
			help="Is charging from the grid possible?"
		/>
		<FormKit
			id="maximumChargeRate"
			type="govInputWithSuffix"
			label="Maximum charge rate"
			help="The maximum charge rate the battery allows during a single charging session or one-way trip"
			name="maximumChargeRate"
			:validation-rules="{ chargeRateMaxGreaterThanMin }"
			validation="required | number | chargeRateMaxGreaterThanMin"
			suffix-text="kW"
		/>
		<FormKit
			id="minimumChargeRate"
			type="govInputWithSuffix"
			label="Minimum charge rate"
			help="The lowest power at which the battery can be charged during a single one-way trip"
			name="minimumChargeRate"
			:validation-rules="{ chargeRateMaxGreaterThanMin }"
			validation="required | number | chargeRateMaxGreaterThanMin"
			suffix-text="kW"
		/>
		<FormKit
			id="maximumDischargeRate"
			type="govInputWithSuffix"
			label="Maximum discharge rate"
			help="The highest power at which the battery can discharge energy during a single one-way trip"
			name="maximumDischargeRate"
			validation="required | number"
			suffix-text="kW"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
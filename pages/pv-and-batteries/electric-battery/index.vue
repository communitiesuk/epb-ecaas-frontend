<script setup lang="ts">
import type { BatteryLocation } from '~/schema/api-schema.types';
import { getUrl } from "~/utils/page";

const title = "Electric battery";
const store = useEcaasStore();

const electricBatteryData = store.pvAndBatteries.electricBattery.data[0];
const model: Ref<ElectricBatteryData | undefined> = ref(electricBatteryData?.data);

const saveForm = (fields: ElectricBatteryData) => {
	store.$patch((state) => {
		const { electricBattery } = state.pvAndBatteries;

		const batteryItem: EcaasForm<ElectricBatteryData> = {
			data: {
				name: fields.name,
				capacity: fields.capacity,
				batteryAge: fields.batteryAge,
				chargeEfficiency: fields.chargeEfficiency,
				location: fields.location,
				gridChargingPossible: fields.gridChargingPossible,
				maximumChargeRate: fields.maximumChargeRate,
				minimumChargeRate: fields.minimumChargeRate,
				maximumDischargeRate: fields.maximumDischargeRate
			},
			complete: true,
		};
		
		electricBattery.data = [batteryItem];
		electricBattery.complete = false;
	});

	navigateTo("/pv-and-batteries");
};

watch(model, async (newData: ElectricBatteryData | undefined, initialData: ElectricBatteryData | undefined) => {
	const storeData = store.pvAndBatteries.electricBattery.data[0];

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = 'Electric battery';
	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
			Object.values(newData).some(x => x !== undefined);

	for (const key of Object.keys(initialData) as (keyof typeof initialData)[]) {
		if (initialData[key]  !== newData[key]) {
			store.$patch(state => {
				if (!storeData && isFirstEdit) {
					state.pvAndBatteries.electricBattery.data = [{
						data: {
							...newData,
							name: newData.name || defaultName,
						},
					}];
				} else {
					state.pvAndBatteries.electricBattery.data[0] = {
						data: {
							...newData,
							name: newData.name?.trim() || defaultName,
						},
					};
				}

				state.pvAndBatteries.electricBattery.complete = false;
			});
		}}
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const locationOptions: Record<BatteryLocation, SnakeToSentenceCase<BatteryLocation>> = {
	inside: 'Inside',
	outside: 'Outside',
};

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
		@submit-invalid="handleInvalidSubmit"
	>
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
			help="Enter the maximum capacity of the battery"
			name="capacity"
			validation="required | number | min:0 | max:50"
			suffix-text="kWh"
		/>
		<FormKit
			id="batteryAge"
			type="govInputWithSuffix"
			label="Battery age"
			help="Enter the starting age of the battery in years"
			name="batteryAge"
			validation="required | number | min:0 | max:100"
			suffix-text="years"
		/>
		<FormKit
			id="chargeEfficiency"
			type="govInputFloat"
			label="Charge/discharge efficiency"
			help="Enter the percentage of energy retained during charging and discharging, as a decimal between 0 and 1 where 1 is no energy loss."
			name="chargeEfficiency"
			validation="required | number | min:0 | max:1"
		/>
		<FormKit
			id="location"
			type="govRadios"
			:options="locationOptions"
			label="Is the battery inside or outside the thermal envelope of the dwelling?"
			name="location"
			validation="required"
		/>
		<FormKit
			id="gridChargingPossible"
			type="govBoolean"
			label="Is charging from the grid possible?"
			name="gridChargingPossible"
			validation="required"
		/>
		<FormKit
			id="maximumChargeRate"
			type="govInputWithSuffix"
			label="Maximum charge rate"
			help="This is the maximum charge rate the battery allows during a single charging session or one-way trip"
			name="maximumChargeRate"
			:validation-rules="{ chargeRateMaxGreaterThanMin }"
			validation="required | number | chargeRateMaxGreaterThanMin"
			suffix-text="kW"
		/>
		<FormKit
			id="minimumChargeRate"
			type="govInputWithSuffix"
			label="Minimum charge rate"
			help="This is the lowest power at which the battery can be charged during a single one-way trip"
			name="minimumChargeRate"
			:validation-rules="{ chargeRateMaxGreaterThanMin }"
			validation="required | number | chargeRateMaxGreaterThanMin"
			suffix-text="kW">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header govuk-!-width-one-third">Energy source for the battery</th>
							<th scope="col" class="govuk-table__header">Typical values</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">PV system</th>
							<td class="govuk-table__cell">The minimum effective charge rate can be 0 kW when no solar energy is available, or as low as 0.1 kW - 0.5 kW in very poor light conditions, depending on the available surplus.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Mains electricity</th>
							<td class="govuk-table__cell">When actively charging from the grid, the battery system will generally aim for 2-3 kW or more to efficiently fill up within the off-peak window.</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="maximumDischargeRate"
			type="govInputWithSuffix"
			label="Maximum discharge rate"
			help="This is the highest power at which the battery can discharge energy during a single one-way trip"
			name="maximumDischargeRate"
			validation="required | number"
			suffix-text="kW"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('pvAndBatteries')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
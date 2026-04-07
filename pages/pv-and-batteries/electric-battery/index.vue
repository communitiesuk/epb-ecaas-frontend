<script setup lang="ts">
import type { SchemaBatteryLocation } from "~/schema/aliases";
import { capacityElectricBatteryZod } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";
import { getUrl } from "~/utils/page";

const title = "Electric battery";
const store = useEcaasStore();

const electricBatteryData = store.pvAndBatteries.electricBattery.data[0];
const model = ref(electricBatteryData?.data);

const saveForm = (fields: ElectricBatteryData) => {
	store.$patch((state) => {
		const { electricBattery } = state.pvAndBatteries;

		const batteryItem: EcaasForm<ElectricBatteryData> = {
			data: {
				name: fields.name,
				capacity: fields.capacity,
				chargeEfficiency: fields.chargeEfficiency,
				location: fields.location,
				maximumChargeRate: fields.maximumChargeRate,
				minimumChargeRate: fields.minimumChargeRate,
				maximumDischargeRate: fields.maximumDischargeRate,
			},
			complete: true,
		};
		
		electricBattery.data = [batteryItem];
		electricBattery.complete = false;
	});

	navigateTo("/pv-and-batteries");
};

watch(model, async (newData, initialData) => {

	if (initialData === undefined || newData === undefined) {
		return;
	};

	const defaultName = "Electric battery";

	store.$patch(state => {
		state.pvAndBatteries.electricBattery.data[0] = {
			data: {
				...newData,
				name: newData.name?.trim() || defaultName,
			},
		};

		state.pvAndBatteries.electricBattery.complete = false;
	});
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const locationOptions: Record<SchemaBatteryLocation, SnakeToSentenceCase<SchemaBatteryLocation>> = {
	inside: "Inside",
	outside: "Outside",
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
			:validation="zodTypeAsFormKitValidation(capacityElectricBatteryZod)"
			suffix-text="kWh"
		/>
		<FormKit
			id="chargeEfficiency"
			type="govInputFloat"
			label="Charge/discharge efficiency"
			help="Enter the percentage of energy retained during the charge and discharge round trip, as a decimal between 0 and 1 where 1 is no energy loss"
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
			id="maximumChargeRate"
			type="govInputWithSuffix"
			label="Maximum charge rate"
			help="This is the highest rate of power at which the battery can be charged. Additional available power will not be used for charging."
			name="maximumChargeRate"
			:validation-rules="{ chargeRateMaxGreaterThanMin }"
			validation="required | number | chargeRateMaxGreaterThanMin"
			suffix-text="kW"
		/>
		<FormKit
			id="minimumChargeRate"
			type="govInputWithSuffix"
			label="Minimum charge rate"
			help="This is the lowest rate of power at which the battery can be charged. No charging will occur if the available power is less than this value."
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
			help="This is the maximum power output of the battery at any one time"
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
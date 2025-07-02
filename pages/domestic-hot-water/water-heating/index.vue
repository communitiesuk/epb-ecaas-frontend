<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import type { HotWaterCylinderData } from '~/stores/ecaasStore.types';

const title = "Water heating";
const store = useEcaasStore();

const hotWaterCylinderData = store.domesticHotWater.waterHeating.hotWaterCylinder.data[0];
const model: Ref<HotWaterCylinderData> = ref(hotWaterCylinderData!);

const saveForm = (fields: HotWaterCylinderData) => {
	store.$patch({
		domesticHotWater: {
			waterHeating: {
				hotWaterCylinder: {
					data: [{
						id: uuidv4(),
						name: fields.name,
						heatSource: fields.heatSource,
						tankVolume: fields.tankVolume,
						dailyEnergyLoss: fields.dailyEnergyLoss,
					}],
					complete: true
				},
				// the below fields are currently set to empty and marked as complete
				// in future versions they will be supported
				immersionHeater: {
					data: [],
					complete: true
				},
				solarThermal: {
					data: [],
					complete: true
				},
				pointOfUse: {
					data: [],
					complete: true
				},
				heatPump: {
					data: [],
					complete: true
				},
				combiBoiler: {
					data: [],
					complete: true
				},
				heatBattery: {
					data: [],
					complete: true
				},
				smartHotWaterTank: {
					data: [],
					complete: true
				},
				heatInterfaceUnit: {
					data: [],
					complete: true
				},
			}
		}
	});

	navigateTo("/domestic-hot-water");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		Water Heating
	</h1>
	<p class="govuk-body">For now, this service only allows homes to be modelled with the a hot water cylinder. In future releases there will be further options.</p>

	<h2 class="govuk-heading-l">Hot Water Cylinder</h2>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="waterHeatingErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FieldsHeatGenerators
			id="heatSource"
			name="heatSource"
			label="Heat source"
			help="Select the relevant heat source that has been added previously"
		/>
		<FormKit
			id="tankVolume"
			type="govInputWithSuffix"
			label="Tank volume"
			help="Total internal capacity of the tank in m³"
			name="tankVolume"
			validation="required | number | min:0 | max:200"
			suffix-text="m³"
		/>
		<FormKit
			id="dailyEnergyLoss"
			type="govInputWithSuffix"
			label="Daily energy loss"
			help="Estimated energy lost  from the tank per day"
			name="dailyEnergyLoss"
			validation="required | number | min:0 | max:200"
			suffix-text="kWh"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
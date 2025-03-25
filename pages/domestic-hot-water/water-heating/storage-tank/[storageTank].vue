<script setup lang="ts">
const title = "Storage tank";
const store = useEcaasStore();
const { saveToList } = useForm();

const storageTankData = useItemToEdit('storageTank', store.domesticHotWater.waterHeating.storageTank.data);
const model: Ref<StorageTankData> = ref(storageTankData!);

const saveForm = (fields: StorageTankData) => {
	store.$patch((state) => {
		const {storageTank} = state.domesticHotWater.waterHeating;

		const storageTankItem: StorageTankData = {
			heatSource: fields.heatSource,
			tankVolume: fields.tankVolume,
			dailyEnergyLoss: fields.dailyEnergyLoss
		};

		saveToList(storageTankItem, storageTank);
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
		<GovErrorSummary :error-list="errorMessages" test-id="storageTankErrorSummary"/>
		<FormKit
			id="heatSource"
			type="govRadios"
			:options="{
				kensaHeatPump: 'Kensa heat pump',
				batteryHeat: 'Battery heat 189',
			}"
			label="Heat source"
			help="Select the relevant heat source that has been added previously"
			name="heatSource"
			validation="required"
		/>
		<FormKit
			id="tankVolume"
			type="govInputWithSuffix"
			label="Tank volume"
			help="Total internal capacity of the tank in m3"
			name="tankVolume"
			validation="required | number | min:0 | max:200"
			suffix-text="m3"
		/>
		<FormKit
			id="dailyEnergyLoss"
			type="govInputWithSuffix"
			label="Daily energy loss"
			help="Estimated energy lost  from the tank per day"
			name="dailyEnergyLoss"
			validation="required | number | min:0 | max:200"
			suffix-text="kWh/24h"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
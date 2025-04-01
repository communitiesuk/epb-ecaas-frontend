<script setup lang="ts">
import {getUrl} from "~/utils/page";

const title = "Storage tank";
const store = useEcaasStore();
const { saveToList } = useForm();

const storageTankData = useItemToEdit('storageTank', store.domesticHotWater.waterHeating.storageTank.data);
const model: Ref<StorageTankData> = ref(storageTankData!);

const saveForm = (fields: StorageTankData) => {
	store.$patch((state) => {
		const {storageTank} = state.domesticHotWater.waterHeating;

		const storageTankItem: StorageTankData = {
			name: fields.name,
			heatSource: fields.heatSource,
			tankVolume: fields.tankVolume,
			dailyEnergyLoss: fields.dailyEnergyLoss
		};

		saveToList(storageTankItem, storageTank);
		storageTank.complete = true;
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
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="heatSource"
			type="govStoredList"
			label="Heat source"
			name="heatSource"
			help="Select the relevant heat source that has been added previously"
			:options="[]"
			:link="getUrl('heatingSystems')"
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
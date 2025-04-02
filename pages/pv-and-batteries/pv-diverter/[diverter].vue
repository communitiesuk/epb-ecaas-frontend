<script setup lang="ts">
import { getUrl } from '#imports';

const title = "PV diverter";
const store = useEcaasStore();
const { saveToList } = useForm();

const pvDiverterData = useItemToEdit('diverter', store.pvAndBatteries.pvDiverter.data);
const model: Ref<PvDiverterData> = ref(pvDiverterData!);

const { heatPump, boiler, heatBattery, heatNetwork, heatInterfaceUnit } = store.heatingSystems.heatGeneration;

const heatGenerators = [
	heatPump.data.map((x, i) => [`heatPump_${i}`, x.name] as [string, string]),
	boiler.data.map((x, i) => [`boiler_${i}`, x.name] as [string, string]),
	heatBattery.data.map((x, i) => [`heatBattery_${i}`, x.name] as [string, string]),
	heatNetwork.data.map((x, i) => [`heatNetwork_${i}`, x.name] as [string, string]),
	heatInterfaceUnit.data.map((x, i) => [`heatInterfaceUnit_${i}`, x.name] as [string, string])
].flat();

const saveForm = (fields: PvDiverterData) => {
	store.$patch((state) => {
		const {pvDiverter} = state.pvAndBatteries;

		const pvDiverterItem: PvDiverterData = {
			name: fields.name,
			energyDivertedToHeatGeneration: fields.energyDivertedToHeatGeneration,
			energyDivertedToStorageTank: fields.energyDivertedToStorageTank
		};

		saveToList(pvDiverterItem, pvDiverter);
		pvDiverter.complete = true;
	});

	navigateTo("/pv-and-batteries");
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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="pvDiverterErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name so this diverter can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="energyDivertedToHeatGeneration"
			type="govRadios"
			:options="new Map(heatGenerators)"
			label="Energy diverted to heat generation"
			help="Select which heat generator, added previously, is being sent energy by the diverter"
			name="energyDivertedToHeatGeneration"
			validation="required">
			<div v-if="!heatGenerators.length">
				<p class="govuk-error-message">No heat generators added.</p>
				<NuxtLink :to="getUrl('heatGeneration')" class="govuk-link gov-radios-add-link">
					Click here to add a heat generator
				</NuxtLink>
			</div>
		</FormKit>
		<FormKit
			id="energyDivertedToStorageTank"
			type="govRadios"
			:options="new Map(store.domesticHotWater.waterHeating.storageTank.data.map((x, i) => [`${i}`, x.name]))"
			label="Energy diverted to storage tank"
			help="Select a storage tank, added previously, which is being sent energy by the diverter"
			name="energyDivertedToStorageTank"
			validation="required">
			<div v-if="!store.domesticHotWater.waterHeating.storageTank.data.length">
				<p class="govuk-error-message">No storage tank added.</p>
				<NuxtLink :to="getUrl('storageTankCreate')" class="govuk-link gov-radios-add-link">
					Click here to add a storage tank
				</NuxtLink>
			</div>
		</FormKit>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
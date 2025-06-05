<script setup lang="ts">
import { getUrl } from '#imports';

const title = "PV diverter";
const store = useEcaasStore();
const { saveToList } = useForm();

const pvDiverterData = useItemToEdit('diverter', store.pvAndBatteries.pvDiverter.data);
const model: Ref<PvDiverterData> = ref(pvDiverterData!);

const saveForm = (fields: PvDiverterData) => {
	store.$patch((state) => {
		const {pvDiverter} = state.pvAndBatteries;

		const pvDiverterItem: PvDiverterData = {
			name: fields.name,
			energyDivertedToHeatGeneration: fields.energyDivertedToHeatGeneration,
			energyDivertedToHotWaterCylinder: fields.energyDivertedToHotWaterCylinder
		};

		saveToList(pvDiverterItem, pvDiverter);
		pvDiverter.complete = false;
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
		<FieldsHeatGenerators
			id="energyDivertedToHeatGeneration"
			name="energyDivertedToHeatGeneration"
			label="Energy diverted to heat generation"
			help="Select which heat generator, added previously, is being sent energy by the diverter"
		/>
		<FormKit
			id="energyDivertedToHotWaterCylinder"
			type="govRadios"
			:options="new Map(store.domesticHotWater.waterHeating.hotWaterCylinder.data.map(x => [x.id, x.name]))"
			label="Energy diverted to hot water cylinder"
			help="Select a hot water cylinder, added previously, which is being sent energy by the diverter"
			name="energyDivertedToHotWaterCylinder"
			validation="required">
			<div v-if="!store.domesticHotWater.waterHeating.hotWaterCylinder.data.length">
				<p class="govuk-error-message">No hot water cylinder added.</p>
				<NuxtLink :to="getUrl('hotWaterCylinderCreate')" class="govuk-link gov-radios-add-link">
					Click here to add a hot water cylinder
				</NuxtLink>
			</div>
		</FormKit>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
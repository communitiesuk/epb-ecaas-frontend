<script setup lang="ts">
import { getUrl } from "#imports";

const title = "Heat pump (hot water only)";
const store = useEcaasStore();
const { getStoreIndex, autoSaveElementForm } = useForm();

const heatPumpData = useItemToEdit("hotWaterHeatPump", store.domesticHotWaterNew.waterHeating.heatPump.data);
const model: Ref<HotWaterHeatPumpData | undefined> = ref(heatPumpData?.data);

const saveForm = (fields: HotWaterHeatPumpData) => {
	store.$patch((state) => {
		const { heatPump } = state.domesticHotWaterNew.waterHeating;
		const index = getStoreIndex(heatPump.data);

		const heatPumpItem: HotWaterHeatPumpData = {
			name: fields.name,
		};

		heatPump.data[index] = {
			data: heatPumpItem,
			complete: true,
		};

		heatPump.complete = false;
	});

	navigateTo("/domestic-hot-water/water-heating");
};

autoSaveElementForm({
	model,
	storeData: store.domesticHotWaterNew.waterHeating.heatPump,
	defaultName: "Heat pump",
	onPatch: (state, newData, index) => {
		state.domesticHotWaterNew.waterHeating.heatPump.data[index] = newData;
		state.domesticHotWaterNew.waterHeating.heatPump.complete = false;
	},
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatPumpErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('domesticHotWaterNew')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
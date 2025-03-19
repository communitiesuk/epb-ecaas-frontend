<script setup lang="ts">
const title = "Heat pump (hot water only)";
const store = useEcaasStore();
const route = useRoute();

const heatPumpData = useItemToEdit('heatPump', store.domesticHotWater.waterHeating.heatPump.data);
const model: Ref<HotWaterHeatPumpData> = ref(heatPumpData!);

const saveForm = (fields: HotWaterHeatPumpData) => {
	store.$patch((state) => {
		const {heatPump} = state.domesticHotWater.waterHeating;

		if (!heatPump.data) {
			heatPump.data = [];
		}

		const heatPumpItem: HotWaterHeatPumpData = {
			name: fields.name
		};

		if (route.params.heatPump && route.params.heatPump !== 'create') {
			const index = parseInt(route.params.heatPump as string);
			heatPump.data[index] = heatPumpItem;
		} else {
			heatPump.data.push(heatPumpItem);
		}

		heatPump.complete = true;
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatPumpErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
<script setup lang="ts">
const title = "Heat battery";
const store = useEcaasStore();
const route = useRoute();

const heatBatteryData = useItemToEdit('battery', store.heatingSystems.heatGeneration.heatBattery.data);
const model: Ref<HeatBatteryData> = ref(heatBatteryData!);

const saveForm = (fields: HeatBatteryData) => {
	store.$patch((state) => {
		const {heatBattery} = state.heatingSystems.heatGeneration;

		if (!heatBattery.data) {
			heatBattery.data = [];
		}

		const heatBatteryItem: HeatBatteryData = {
			name: fields.name
		};

		if (route.params.battery && route.params.battery !== 'create') {
			const index = parseInt(route.params.battery as string);
			heatBattery.data[index] = heatBatteryItem;
		} else {
			heatBattery.data.push(heatBatteryItem);
		}

		heatBattery.complete = true;
	});

	navigateTo("/heating-systems/heat-generation");
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatBatteryErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this heat battery so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
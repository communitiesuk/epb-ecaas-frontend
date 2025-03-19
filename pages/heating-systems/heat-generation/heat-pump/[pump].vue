<script setup lang="ts">
const title = "Heat pump";
const store = useEcaasStore();
const route = useRoute();

const heatPumpData = useItemToEdit('pump', store.heatingSystems.heatGeneration.heatPump.data);
const model: Ref<HeatPumpData> = ref(heatPumpData!);

const saveForm = (fields: HeatPumpData) => {
	store.$patch((state) => {
		const {heatPump} = state.heatingSystems.heatGeneration;

		if (!heatPump.data) {
			heatPump.data = [];
		}

		const heatPumpItem: HeatPumpData = {
			name: fields.name
		};

		if (route.params.pump && route.params.pump !== 'create') {
			const index = parseInt(route.params.pump as string);
			heatPump.data[index] = heatPumpItem;
		} else {
			heatPump.data.push(heatPumpItem);
		}

		heatPump.complete = true;
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatPumpErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this heat pump so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
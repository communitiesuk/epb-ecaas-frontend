<script setup lang="ts">
const title = "Warm air heat pump";
const store = useEcaasStore();
const { saveToList } = useForm();

const warmAirHeatPumpData = useItemToEdit('pump', store.heatingSystems.heatEmitting.warmAirHeatPump.data);
const model: Ref<WarmAirHeatPumpData> = ref(warmAirHeatPumpData!);

const saveForm = (fields: WarmAirHeatPumpData) => {
	store.$patch((state) => {
		const {warmAirHeatPump} = state.heatingSystems.heatEmitting;

		const item: WarmAirHeatPumpData = {
			name: fields.name
		};

		saveToList(item, warmAirHeatPump);
		warmAirHeatPump.complete = false;
	});

	navigateTo("/heating-systems/heat-emitting");
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
		<GovErrorSummary :error-list="errorMessages" test-id="warmAirHeatPumpErrorSummary"/>
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
<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const title = "Heat network";
const store = useEcaasStore();
const { saveToList } = useForm();

const heatNetworkData = useItemToEdit('network', store.heatingSystems.heatGeneration.heatNetwork.data);
const model: Ref<HeatNetworkData> = ref(heatNetworkData!);

const saveForm = (fields: HeatNetworkData) => {
	store.$patch((state) => {
		const {heatNetwork} = state.heatingSystems.heatGeneration;

		const heatNetworkItem: HeatNetworkData = {
			id: uuidv4(),
			name: fields.name
		};

		saveToList(heatNetworkItem, heatNetwork);
		heatNetwork.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatNetworkErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this heat network so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
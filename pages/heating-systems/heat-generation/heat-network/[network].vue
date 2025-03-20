<script setup lang="ts">
const title = "Heat network";
const store = useEcaasStore();
const route = useRoute();

const heatNetworkData = useItemToEdit('network', store.heatingSystems.heatGeneration.heatNetwork.data);
const model: Ref<HeatNetworkData> = ref(heatNetworkData!);

const saveForm = (fields: HeatNetworkData) => {
	store.$patch((state) => {
		const {heatNetwork} = state.heatingSystems.heatGeneration;

		if (!heatNetwork.data) {
			heatNetwork.data = [];
		}

		const heatNetworkItem: HeatNetworkData = {
			name: fields.name
		};

		if (route.params.network && route.params.network !== 'create') {
			const index = parseInt(route.params.network as string);
			heatNetwork.data[index] = heatNetworkItem;
		} else {
			heatNetwork.data.push(heatNetworkItem);
		}

		heatNetwork.complete = true;
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
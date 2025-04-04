<script setup lang="ts">
const title = "Wet distribution";
const store = useEcaasStore();
const { saveToList } = useForm();

const wetDistributionData = useItemToEdit('distribution', store.heatingSystems.heatEmitting.wetDistribution.data);
const model: Ref<WetDistributionData> = ref(wetDistributionData!);

const saveForm = (fields: WetDistributionData) => {
	store.$patch((state) => {
		const {wetDistribution} = state.heatingSystems.heatEmitting;

		const item: WetDistributionData = {
			name: fields.name
		};

		saveToList(item, wetDistribution);
		wetDistribution.complete = true;
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
		<GovErrorSummary :error-list="errorMessages" test-id="wetDistributionErrorSummary"/>
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
<script setup lang="ts">
const title = "Air conditioning";
const store = useEcaasStore();
const { saveToList } = useForm();

const airConditioningData = useItemToEdit('airConditioning', store.cooling.airConditioning.data);
const model: Ref<AirConditioningData> = ref(airConditioningData!);

const saveForm = (fields: AirConditioningData) => {
	store.$patch((state) => {
		const {airConditioning} = state.cooling;

		const airConditioningItem: AirConditioningData = {
			name: fields.name
		};

		saveToList(airConditioningItem, airConditioning);
		airConditioning.complete = true;
	});

	navigateTo("/cooling");
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
		<GovErrorSummary :error-list="errorMessages" test-id="airConditioningErrorSummary"/>
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
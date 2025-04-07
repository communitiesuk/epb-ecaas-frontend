<script setup lang="ts">
const title = "WWHRS";
const store = useEcaasStore();
const { saveToList } = useForm();

const wwhrsData = useItemToEdit('wwhrs', store.domesticHotWater.wwhrs.data);
const model: Ref<WwhrsData> = ref(wwhrsData!);

const saveForm = (fields: WwhrsData) => {
	store.$patch((state) => {
		const {wwhrs} = state.domesticHotWater;

		const item: WwhrsData = {
			name: fields.name
		};

		saveToList(item, wwhrs);
		wwhrs.complete = true;
	});

	navigateTo("/domestic-hot-water/wwhrs");
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
		<GovErrorSummary :error-list="errorMessages" test-id="wwhrsErrorSummary"/>
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
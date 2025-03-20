<script setup lang="ts">
const title = "Storage tank";
const store = useEcaasStore();
const { saveToList } = useForm();

const storageTankData = useItemToEdit('storageTank', store.domesticHotWater.waterHeating.storageTank.data);
const model: Ref<StorageTankData> = ref(storageTankData!);

const saveForm = (fields: StorageTankData) => {
	store.$patch((state) => {
		const {storageTank} = state.domesticHotWater.waterHeating;

		const storageTankItem: StorageTankData = {
			name: fields.name
		};

		saveToList(storageTankItem, storageTank);
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
		<GovErrorSummary :error-list="errorMessages" test-id="storageTankErrorSummary"/>
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
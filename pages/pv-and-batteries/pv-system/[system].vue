<script setup lang="ts">
const title = "PV System";
const store = useEcaasStore();
const { saveToList } = useForm();

const pvSystemData = useItemToEdit('system', store.pvAndBatteries.pvSystem.data);
const model: Ref<PvSystemData> = ref(pvSystemData!);

const saveForm = (fields: PvSystemData) => {
	store.$patch((state) => {
		const {pvSystem} = state.pvAndBatteries;

		const pvSystemItem: PvSystemData = {
			name: fields.name
		};

		saveToList(pvSystemItem, pvSystem);
		pvSystem.complete = true;
	});

	navigateTo("/pv-and-batteries");
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
		<GovErrorSummary :error-list="errorMessages" test-id="internalFloorErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name to this PV so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
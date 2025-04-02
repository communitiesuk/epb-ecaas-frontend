<script setup lang="ts">
const title = "PV diverter";
const store = useEcaasStore();
const { saveToList } = useForm();

const pvDiverterData = useItemToEdit('diverter', store.pvAndBatteries.pvDiverter.data);
const model: Ref<PvDiverterData> = ref(pvDiverterData!);

const saveForm = (fields: PvDiverterData) => {
	store.$patch((state) => {
		const {pvDiverter} = state.pvAndBatteries;

		const pvDiverterItem: PvDiverterData = {
			name: fields.name
		};

		saveToList(pvDiverterItem, pvDiverter);
		pvDiverter.complete = true;
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
			help="Provide a name so this diverter can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
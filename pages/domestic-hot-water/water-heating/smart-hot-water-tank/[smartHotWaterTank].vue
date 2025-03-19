<script setup lang="ts">
const title = "Smart hot water tank";
const store = useEcaasStore();
const route = useRoute();

const smartHotWaterTankData = useItemToEdit('smartHotWaterTank', store.domesticHotWater.waterHeating.smartHotWaterTank.data);
const model: Ref<SmartHotWaterTankData> = ref(smartHotWaterTankData!);

const saveForm = (fields: SmartHotWaterTankData) => {
	store.$patch((state) => {
		const {smartHotWaterTank} = state.domesticHotWater.waterHeating;

		if (!smartHotWaterTank.data) {
			smartHotWaterTank.data = [];
		}

		const storageTankItem: SmartHotWaterTankData = {
			name: fields.name
		};

		if (route.params.smartHotWaterTank && route.params.smartHotWaterTank !== 'create') {
			const index = parseInt(route.params.smartHotWaterTank as string);
			smartHotWaterTank.data[index] = storageTankItem;
		} else {
			smartHotWaterTank.data.push(storageTankItem);
		}

		smartHotWaterTank.complete = true;
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
		<GovErrorSummary :error-list="errorMessages" test-id="smartHotWaterTankErrorSummary"/>
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
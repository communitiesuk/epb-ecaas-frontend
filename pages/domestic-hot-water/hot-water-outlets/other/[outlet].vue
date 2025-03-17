<script setup lang="ts">
const title = "Other outlets";
const store = useEcaasStore();
const route = useRoute();

const otherOutletsData = useItemToEdit('outlet', store.domesticHotWater.hotWaterOutlets.otherOutlets.data);
const model: Ref<OtherHotWaterOutletData> = ref(otherOutletsData!);

const saveForm = (fields: OtherHotWaterOutletData) => {
	store.$patch((state) => {
		const {otherOutlets} = state.domesticHotWater.hotWaterOutlets;

		if (!otherOutlets.data) {
			otherOutlets.data = [];
		}

		const outletItem: OtherHotWaterOutletData = {
			name: fields.name,
			flowRate: fields.flowRate,
		};

		if (route.params.outlet && route.params.outlet !== 'create') {
			const index = parseInt(route.params.outlet as string);
			otherOutlets.data[index] = outletItem;
		} else {
			otherOutlets.data.push(outletItem);
		}

		otherOutlets.complete = true;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
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
		<GovErrorSummary :error-list="errorMessages" test-id="otherOutletsErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this outlet so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="flowRate"
			type="govInputWithSuffix"
			label="Flow rate"
			name="flowRate"
			validation="required | number | min:0 | max:15"
			suffix-text="litres/min"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
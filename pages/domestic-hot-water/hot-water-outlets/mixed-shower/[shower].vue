<script setup lang="ts">
const title = "Mixed shower";
const store = useEcaasStore();
const route = useRoute();

const mixedShowerData = useItemToEdit('shower', store.domesticHotWater.hotWaterOutlets.mixedShower.data);
const model: Ref<MixedShowerData> = ref(mixedShowerData!);

const saveForm = (fields: MixedShowerData) => {
	store.$patch((state) => {
		const {mixedShower} = state.domesticHotWater.hotWaterOutlets;

		if (!mixedShower.data) {
			mixedShower.data = [];
		}

		const mixedShowerItem: MixedShowerData = {
			name: fields.name,
			flowRate: fields.flowRate,
		};

		if (route.params.shower && route.params.shower !== 'create') {
			const index = parseInt(route.params.shower as string);
			mixedShower.data[index] = mixedShowerItem;
		} else {
			mixedShower.data.push(mixedShowerItem);
		}

		mixedShower.complete = true;
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
		<GovErrorSummary :error-list="errorMessages" test-id="mixedShowerErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this shower so that it can be identified later"
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
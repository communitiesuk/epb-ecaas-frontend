<script setup lang="ts">
const title = "Hot water distribution";
const store = useEcaasStore();
const route = useRoute();

let model: Ref<HotWaterDistributionData>;

if (route.params.distribution && route.params.distribution !== 'create') {
	const index = parseInt(route.params.distribution as string);

	const distribution = store.hotWaterOutlets.hotWaterDistribution.data.distributions?.[index];

	model = ref({
		...distribution!
	});
}

const saveForm = (fields: HotWaterDistributionData) => {
	store.$patch((state) => {
		if (!state.hotWaterOutlets.hotWaterDistribution.data.distributions) {
			state.hotWaterOutlets.hotWaterDistribution.data.distributions = [];
		}

		const index = parseInt(route.params.distribution as string);

		if (route.params.distribution && route.params.distribution !== 'create') {
			state.hotWaterOutlets.hotWaterDistribution.data.distributions[index] = {
				name: fields.name,
				location: fields.location,
				length: fields.length,
				internalDiameter: fields.internalDiameter,
			};
		} else {
			state.hotWaterOutlets.hotWaterDistribution.data.distributions.push({
				name: fields.name,
				location: fields.location,
				length: fields.length,
				internalDiameter: fields.internalDiameter,
			});
		}
		
		state.hotWaterOutlets.hotWaterDistribution.complete = true;
	});

	navigateTo("/hot-water-outlets/hot-water-distribution");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
		<GovErrorSummary
			:error-list="errorMessages"
			test-id="hotWaterDistributionErrorSummary"
		/>

		<GovDetails
			class="summary-text"
			:summary-text="`Typical input values`"
			:text="`Length = 20m\nInternal diameter = 0.022m`"
			classes="govuk-!-margin-bottom-4"
		/>

		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this hot water distribution so it can be identified later "
			name="name"
			validation="required | length:1,50"
		/>
		<FormKit
			id="location"
			type="govRadios"
			:options="{
				internal: 'Internal',
				external: 'External',
			}"
			label="Location"
			help="The location of the pipe"
			name="location"
			validation="required"
		/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length"
			help="Total length of distribution pipework - pipework serving multiple tapping points should be counted once for each tapping point"
			name="length"
			validation="required | number | min:0 | max:200"
			suffix-text="m"
		/>
		<FormKit
			id="internalDiameter"
			type="govInputWithSuffix"
			label="Internal diameter"
			help="Internal diameter of the pipe"
			name="internalDiameter"
			validation="number| min:0.005 | max:0.1"
			suffix-text="m"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>

<style scoped lang="scss">
.summary-text {
  white-space: pre-wrap;
}

.h2 {
  padding-top: 40px;
}
</style>

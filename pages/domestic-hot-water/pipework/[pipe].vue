<script setup lang="ts">
const title = "Pipework";
const store = useEcaasStore();
const { saveToList } = useForm();

const pipeworkData = useItemToEdit('pipe', store.domesticHotWater.pipework.data);
const model: Ref<PipeworkData> = ref(pipeworkData!);

const saveForm = (fields: PipeworkData) => {
	store.$patch((state) => {
		const {pipework} = state.domesticHotWater;

		const pipeworkItem: PipeworkData = {
			name: fields.name,
			location: fields.location,
			length: fields.length,
			internalDiameter: fields.internalDiameter,
		};

		saveToList(pipeworkItem, pipework);
	});

	navigateTo("/domestic-hot-water/pipework");
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
		<GovErrorSummary
			:error-list="errorMessages"
			test-id="pipeworkErrorSummary"
		/>

		<GovDetails
			class="summary-text"
			:summary-text="`Typical input values`"
			classes="govuk-!-margin-bottom-4">
			Length = 20m<br>
			Internal diameter = 0.022m
		</GovDetails>

		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
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
		<FormKit type="govButton" label="Save and continue"/>
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

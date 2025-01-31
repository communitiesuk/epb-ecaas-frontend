<script setup lang="ts">
const title = "Hot water distribution";
const store = useEcaasStore();
const route = useRoute();

let model: Ref<HotWaterDistributionData>;

if (route.params.distribution && route.params.distribution !== 'create') {
	const index = parseInt(route.params.distribution as string);

	const distribution = store.dwellingDetails.hotWaterDistribution.data.distributions?.[index];

	model = ref({
		...distribution!
	});
}

const saveForm = (fields: HotWaterDistributionData) => {
	store.$patch((state) => {
		if (!state.dwellingDetails.hotWaterDistribution.data.distributions) {
			state.dwellingDetails.hotWaterDistribution.data.distributions = [];
		}

		const index = parseInt(route.params.distribution as string);

		if (route.params.distribution && route.params.distribution !== 'create') {
			state.dwellingDetails.hotWaterDistribution.data.distributions[index] = {
				name: fields.name,
				location: fields.location,
				length: fields.length,
				internalDiameter: fields.internalDiameter,
				externalDiameter: fields.externalDiameter,
				insulationThickness: fields.insulationThickness,
				insulationThermalConductivity:
					fields.insulationThermalConductivity,
				pipeContents: fields.pipeContents,
				surfaceReflectivity: fields.surfaceReflectivity,
			};
		} else {
			state.dwellingDetails.hotWaterDistribution.data.distributions.push({
				name: fields.name,
				location: fields.location,
				length: fields.length,
				internalDiameter: fields.internalDiameter,
				externalDiameter: fields.externalDiameter,
				insulationThickness: fields.insulationThickness,
				insulationThermalConductivity:
					fields.insulationThermalConductivity,
				pipeContents: fields.pipeContents,
				surfaceReflectivity: fields.surfaceReflectivity,
			});
		}

		state.dwellingDetails.hotWaterDistribution.complete = true;
	});

	navigateTo("/dwelling-details/hot-water-distribution");
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
			:text="`Length = 20m\nInternal diameter = 22mm\nExternal diameter = 25mm\nInsulation thickness = 20mm\nInsulation thermal conductivity = 0.035W/m.K`"
			classes="govuk-!-margin-bottom-4"
		/>

		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Name this pipework so it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="location"
			type="govRadios"
			:options="{
				internal: 'Internal',
				external: 'External',
			}"
			label="Location"
			name="location"
			validation="required"
		/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length"
			name="length"
			validation="required | number"
			suffix-text="m"
		/>

		<FormKit
			id="internalDiameter"
			type="govInputWithSuffix"
			label="Internal diameter"
			name="internalDiameter"
			validation="number"
			suffix-text="mm"
		/>
		<FormKit
			id="externalDiameter"
			type="govInputWithSuffix"
			label="External diameter"
			name="externalDiameter"
			validation="number"
			suffix-text="mm"
		/>
		<FormKit
			id="insulationThickness"
			type="govInputWithSuffix"
			label="Insulation thickness"
			name="insulationThickness"
			validation="number"
			suffix-text="mm"
		/>
		<FormKit
			id="insulationThermalConductivity"
			type="govInputWithSuffix"
			label="Insulation thermal conductivity"
			name="insulationThermalConductivity"
			validation="number"
			suffix-text="W/m.K"
		/>
		<FormKit
			id="pipeContents"
			type="govRadios"
			:options="{
				air: 'Air',
				water: 'Water',
			}"
			label="Pipe contents"
			name="pipeContents"
		/>
		<FormKit
			id="surfaceReflectivity"
			type="govRadios"
			label="Surface reflectivity"
			name="surfaceReflectivity"
			:options="{
				yes: 'Yes',
				no: 'No'
			}"
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

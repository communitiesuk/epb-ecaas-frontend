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
			state.dwellingDetails.hotWaterDistribution.data.distributions = []
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
			}
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
			})
		}

		state.dwellingDetails.hotWaterDistribution.complete = true
	})

	navigateTo("/dwelling-details/hot-water-distribution");
}

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<style scoped lang="scss">
.summary-text {
  white-space: pre-wrap;
}

.h2 {
  padding-top: 40px;
}
</style>

<template>
  <Head>
    <Title>{{ title }}</Title>
  </Head>
  <h1 class="govuk-heading-l">{{ title }}</h1>
  <FormKit
	type="form"
	v-model="model"
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
		type="govInputText"
		label="Name"
		help="Name this pipework so it can be identified later"
		id="name"
		name="name"
		validation="required"
	/>
	<FormKit
      type="govRadios"
      :options="{
        internal: 'Internal',
        external: 'External',
      }"
      label="Location"
      id="location"
      name="location"
      validation="required"
    />
    <FormKit
      type="govInputWithSuffix"
      label="Length"
      id="length"
      name="length"
      validation="required | number"
      suffixText="m"
    />

    <FormKit
      type="govInputWithSuffix"
      label="Internal diameter"
      id="internalDiameter"
      name="internalDiameter"
      validation="number"
      suffixText="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="External diameter"
      id="externalDiameter"
      name="externalDiameter"
      validation="number"
      suffixText="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="Insulation thickness"
      id="insulationThickness"
      name="insulationThickness"
      validation="number"
      suffixText="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="Insulation thermal conductivity"
      id="insulationThermalConductivity"
      name="insulationThermalConductivity"
      validation="number"
      suffixText="W/m.K"
    />
    <FormKit
      type="govRadios"
      :options="{
        air: 'Air',
        water: 'Water',
      }"
      label="Pipe contents"
      id="pipeContents"
      name="pipeContents"
    />
    <FormKit
      type="govRadios"
      label="Surface reflectivity"
      id="surfaceReflectivity"
      name="surfaceReflectivity"
      :options="{
		yes: 'Yes',
		no: 'No'
	  }"
    />
    <FormKit type="govButton" label="Save and continue" />
  </FormKit>
</template>

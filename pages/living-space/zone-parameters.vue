<script setup lang="ts">
const store = useEcaasStore();

const model = ref({
  ...store.livingSpaceFabric.livingSpaceZoneParameters.data,
});
const { data } = store.livingSpaceFabric.livingSpaceZoneParameters;
const saveForm = (fields: typeof model.value) => {
  store.$patch({
    livingSpaceFabric: {
      livingSpaceZoneParameters: {
        data: {
          area: fields.area,
          volume: fields.volume,
          spaceHeatingSystemForThisZone: fields.spaceHeatingSystemForThisZone,
          spaceCoolingSystemForThisZone: fields.spaceCoolingSystemForThisZone,
          spaceHeatControlSystemForThisZone:
            fields.spaceHeatControlSystemForThisZone,
        },
        complete: true,
      },
    },
  });

  navigateTo("/living-space");
};
const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
  <Head>
    <Title>Zone Parameters</Title>
  </Head>
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
      test-id="zoneParametersErrorSummary"
    />
    <h2 class="govuk-heading-l govuk-!-margin-bottom-3">Zone Parameters</h2>
    <div class="govuk-details__link">
      <NuxtLink class="govuk-link" :href="``">Guidance</NuxtLink>
    </div>
    <GovDetails
      class="summary-text"
      :summary-text="`Example values`"
      :text="``"
      classes="govuk-!-margin-bottom-4"
    />
    <FormKit
      id="area"
      type="govInputWithSuffix"
      suffix-text="m2"
      label="Area"
      name="area"
      help="Floor area of the zone"
			validation="required"
    />
    <FormKit
      id="volume"
      type="govInputWithSuffix"
      suffix-text="m3"
      label="Volume"
      name="volume"
      help="Volume of the zone"
			validation="required"

    />

    <FormKit
      id="spaceHeatingSystem"
      type="govStoredList"
      label="Space heating system for this zone"
      name="spaceHeatingSystem"
      help="Select a space heating system that has already been added to the calculation"
      :list="
        (
          store.livingSpaceFabric.livingSpaceZoneParameters.data
            ?.spaceHeatingSystemForThisZone ?? []
        ).map((system) => system.name)
      "
      validation="required"
      link="/space-heating"
    />

    <FormKit
      id="spaceCoolingSystem"
      type="govStoredList"
      label="Space cooling system for this zone"
      name="spaceCoolingSystem"
      help="Select a space cooling system that has already been added to the calculation"
      :list="
        (
          store.livingSpaceFabric.livingSpaceZoneParameters.data
            ?.spaceCoolingSystemForThisZone ?? []
        ).map((system) => system.name)
      "
      validation="required"
      link="/space-cooling"
    />
    <FormKit
      id="spaceHeatControlSystem"
      type="govStoredList"
      label="Space heat control system for this zone"
      name="spaceHeatControlSystem"
      help="Select a space heat control system that has already been added to the calculation"
      :list="
        (
          store.livingSpaceFabric.livingSpaceZoneParameters.data
            .spaceHeatControlSystemForThisZone ?? []
        ).map((system) => system.name)
      "
      validation="required"
      link="/space-heat-control"
    />
    <FormKit type="govButton" label="Save and continue" />
  </FormKit>
</template>

<style scoped lang="scss">
@use "sass:map";

.govuk-details__link {
  color: #1d70b8;
  font-size: 1.1875rem;
  line-height: 1.3157894737;
  padding-bottom: 1em;
}
</style>

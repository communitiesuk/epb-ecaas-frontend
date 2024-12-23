<script setup lang="ts">
const title = "Hot water distribution";
const store = useEcaasStore();

const model = ref({
  ...store.dwellingDetails.hotWaterDistribution.data,
});

const saveForm = (fields: typeof model.value) => {
  store.$patch({
    dwellingDetails: {
      hotWaterDistribution: {
        data: {
          lengthInternal: fields.lengthInternal,
          internalDiameterInternal: fields.internalDiameterInternal,
          externalDiameterInternal: fields.externalDiameterInternal,
          insulationThicknessInternal: fields.insulationThicknessInternal,
          insulationThermalConductivityInternal:
            fields.insulationThermalConductivityInternal,
          lengthExternal: fields.lengthExternal,
          internalDiameterExternal: fields.internalDiameterExternal,
          externalDiameterExternal: fields.externalDiameterExternal,
          insulationThicknessExternal: fields.insulationThicknessExternal,
          insulationThermalConductivityExternal:
            fields.insulationThermalConductivityExternal,
          pipeContents: fields.pipeContents,
          surfaceReflectivity: fields.surfaceReflectivity,
        },
        complete: true,
      },
    },
  });
  navigateTo("/dwelling-details");
};

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
  <h1 class="govuk-heading-l">{{ title }} - internal</h1>
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
      type="govInputWithSuffix"
      label="Length"
      id="lengthInternal"
      name="lengthInternal"
      validation="required | number"
      suffixIcon="m"
    />

    <FormKit
      type="govInputWithSuffix"
      label="Internal diameter"
      id="internalDiameterInternal"
      name="internalDiameterInternal"
      validation="required | number"
      suffixIcon="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="External diameter"
      id="externalDiameterInternal"
      name="externalDiameterInternal"
      validation="required | number"
      suffixIcon="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="Insulation thickness"
      id="insulationThicknessInternal"
      name="insulationThicknessInternal"
      validation="required | number"
      suffixIcon="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="Insulation thermal conductivity"
      id="insulationThermalConductivityInternal"
      name="insulationThermalConductivityInternal"
      validation="required | number"
      suffixIcon="W/m.K"
    />

    <h2 class="govuk-heading-l h2">{{ title }} - external</h2>
    <GovDetails
      class="summary-text"
      :summary-text="`Typical input values`"
      :text="`Length = 20m\nInternal diameter = 22mm\nExternal diameter = 25mm\nInsulation thickness = 20mm\nInsulation thermal conductivity = 0.035W/m.K`"
      classes="govuk-!-margin-bottom-4"
    />

    <FormKit
      type="govInputWithSuffix"
      label="Length"
      id="lengthExternal"
      name="lengthExternal"
      validation="required | number"
      suffixIcon="m"
    />

    <FormKit
      type="govInputWithSuffix"
      label="Internal diameter"
      id="internalDiameterExternal"
      name="internalDiameterExternal"
      validation="required | number"
      suffixIcon="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="External diameter"
      id="externalDiameterExternal"
      name="externalDiameterExternal"
      validation="required | number"
      suffixIcon="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="Insulation thickness"
      id="insulationThicknessExternal"
      name="insulationThicknessExternal"
      validation="required | number"
      suffixIcon="mm"
    />
    <FormKit
      type="govInputWithSuffix"
      label="Insulation thermal conductivity"
      id="insulationThermalConductivityExternal"
      name="insulationThermalConductivityExternal"
      validation="required | number"
      suffixIcon="W/m.K"
    />
    <FormKit
      type="govRadios"
      :options="{
        none: 'None',
        air: 'Air',
        water: 'Water',
      }"
      label="Pipe contents"
      id="pipeContents"
      name="pipeContents"
      validation="required"
    />
    <FormKit
      type="govCheckboxToggled"
      label="Surface reflectivity"
      id="surfaceReflectivity"
      name="surfaceReflectivity"
      :options="['Yes', 'No']"
      validation="required"
    />

    <FormKit type="govButton" label="Save and continue" />
  </FormKit>
</template>

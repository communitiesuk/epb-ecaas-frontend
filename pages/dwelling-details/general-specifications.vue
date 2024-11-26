<script setup lang="ts">
import { useEcaasStore } from "~/stores/ecaasStore";

const title = "General specifications";
const store = useEcaasStore();

const model = ref({
  ...store.dwellingDetails.generalSpecifications.data,
});

const saveForm = async (fields: typeof model.value) => {
  store.$patch({
    dwellingDetails: {
      generalSpecifications: {
        data: {
          typeOfResidence: fields.typeOfResidence,
          weatherDataLocation: fields.weatherDataLocation,
          storiesInDwelling: fields.storiesInDwelling,
          sizeGroundFloorArea: fields.sizeGroundFloorArea,
          numOfBedrooms: fields.numOfBedrooms
        },
        complete: true,
      },
    },
  });

  navigateTo("/dwelling-details");
};
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
  </Head>
  <h1 class="govuk-heading-l">{{ title }}</h1>
  <FormKit type="form" v-model="model" @submit="saveForm" :actions="false">
    <FormKit
      type="govRadios"
      :options="{
        house: 'House',
        flat: 'Flat',
      }"
      label="Type of residence"
      name="typeOfResidence"
      validation="required"
    />
    <FormKit
      type="govDropdown"
      label="Weather data location"
      name="weatherDataLocation"
      :options="{
        london: 'London',
        manchester: 'Manchester',
        york: 'York',
      }"
      validation="required"
    />

    <FormKit
      type="govInputMeters"
      label="Size of ground floor area"
      name="sizeGroundFloorArea"
      validation="required | number"
    />

    <FormKit
      type="govInputInt"
      label="Number of bedrooms"
      name="numOfBedrooms"
      validation="required | number"
    />

    <FormKit
      type="govInputInt"
      label="Number of stories in dwelling"
      name="storiesInDwelling"
      validation="required | number"
    />

    <FormKit type="govButton" label="Save and continue" />
  </FormKit>
</template>
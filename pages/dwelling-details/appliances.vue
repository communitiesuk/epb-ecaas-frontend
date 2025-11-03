<script setup lang="ts">
import type { SchemaApplianceType } from '~/schema/aliases';
import { getUrl, type AppliancesData } from "#imports";

const title = "Appliances"
const store = useEcaasStore();

const model = ref(store.dwellingDetails.appliances.data)
const { autoSaveForm } = useForm();

const appliances = { 
  Oven: "Oven", 
  Hobs: "Hobs", 
  "Fridge-Freezer": "Fridge freezer",
  Fridge: "Fridge",
  Freezer: "Freezer",
  Dishwasher: "Dishwasher",
  Clothes_washing: "Washing machine",
  Clothes_drying: "Tumble dryer",
  Otherdevices: "Other"
} as const satisfies Record<SchemaApplianceType, ApplianceKeyDisplay >

const saveForm = (fields: AppliancesData) => {
	store.$patch({
		dwellingDetails: {
      appliances: {
        data: {
          applianceType: fields.applianceType
        },
        complete: true
      }
		},
	});
	navigateTo("/dwelling-details");
};

autoSaveForm(model, (state, newData) => {
	state.dwellingDetails.appliances = newData;
});

const isFridgeInChoice = (node: FormKitNode) => {
  const parent = node.at("$parent");

if (parent && parent.value) {
const formValue = parent.value as AppliancesData;
const { applianceType } = formValue
return (applianceType && applianceType.includes("Fridge") || applianceType.includes("Fridge-Freezer"))
}
else {
  return true
}
}

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
@submit-invalid="handleInvalidSubmit">
<GovErrorSummary :error-list="errorMessages" test-id="appliancesErrorSummary"/>

 <FormKit
 	type="govCheckboxes"
  id="applianceType"
  name="applianceType"
  label="Select the appliances that will be present in the dwelling"
  :options="appliances"
  :validation-rules="{ isFridgeInChoice }"
  validation="required | isFridgeInChoice"
  :validation-messages="{isFridgeInChoice: 'Fridge or Fridge freezer is required.'}"
/> 
  <div class="govuk-button-group">
    <FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
    <GovButton :href="getUrl('dwellingDetails')" test-id="saveProgress" secondary>Save progress</GovButton>
  </div>
</FormKit>
</template>
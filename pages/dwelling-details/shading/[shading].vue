<script setup lang="ts">
const title = "Distant shading";
const store = useEcaasStore();
const route = useRoute();

let model: Ref<ShadingObject>;

if (route.params.shading && route.params.shading !== 'create') {
	const index = parseInt(route.params.shading as string);

	const shading = store.dwellingDetails.shading.data.shadingObjects?.[index];

	model = ref({
		...shading!
	});
}

const saveForm = (fields: ShadingObject) => {
	store.$patch((state) => {
		if (!state.dwellingDetails.shading.data.shadingObjects) {
			state.dwellingDetails.shading.data.shadingObjects = [];
		}

		const index = parseInt(route.params.shading as string);

		if (route.params.shading && route.params.shading !== 'create') {
			state.dwellingDetails.shading.data.shadingObjects[index] = { name: fields.name };
		} else {
			state.dwellingDetails.shading.data.shadingObjects?.push({name: fields.name});
		}

		state.dwellingDetails.shading.complete = true;
	});

	navigateTo("/dwelling-details/shading");
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
  <h1 class="govuk-heading-l">
    {{ title }}
  </h1>
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
      test-id="ShadingErrorSummary"
    />
    <FormKit
      id="name"
      type="govInputText"
      label="Name"
      help="Name this shading so it can be identified later"
      name="name"
      validation="required"
    />
    <FormKit
      type="govButton"
      label="Save and continue"
    />
  </FormKit>
</template>

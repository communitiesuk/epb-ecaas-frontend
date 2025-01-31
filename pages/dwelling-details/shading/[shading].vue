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

		const shading = {
			name: fields.name,
			direction:
			fields.direction,
			objectType: fields.objectType,
			height: fields.height,
			distance: fields.distance
		};

		if (route.params.shading && route.params.shading !== 'create') {
			state.dwellingDetails.shading.data.shadingObjects[index] = shading;
		} else {
			state.dwellingDetails.shading.data.shadingObjects?.push(shading);
		}

		state.dwellingDetails.shading.complete = true;
	});

	navigateTo("/dwelling-details/shading");
};
const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

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
			id="direction"
			type="govInputWithSuffix"
			label="Direction"
			help="What direction is the shading coming from (in degrees)?"
			name="direction"
			validation="required | number"
			suffix-text="&deg"
		/>
		<FormKit
			id="objectType"
			type="govRadios"
			label="Object Type"
			help="What is causing the shading?"
			name="objectType"
			:options="{
				obstacle: 'Obstacle',
				overhang: 'Overhang',
			}"
			validation="required"
		/>
		<FormKit
			id="height"
			type="govInputWithSuffix"
			label="Height"
			suffix-text="m"
			name="height"
			validation="required | number"
			help="How high is the object or obstacle?"
		/>
		<FormKit
			id="distance"
			type="govInputWithSuffix"
			label="Distance"
			suffix-text="m"
			name="distance"
			validation="required | number"
			help="How far away is the object or obstacle?"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
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

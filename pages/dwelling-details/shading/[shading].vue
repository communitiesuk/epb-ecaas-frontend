<script setup lang="ts">
const title = "Distant shading";
const store = useEcaasStore();
const route = useRoute();

const shading = useItemToEdit('shading', store.dwellingDetails.shading.data);
const model: Ref<ShadingData> = ref(shading!);

const saveForm = (fields: ShadingData) => {
	store.$patch((state) => {
		const { shading } = state.dwellingDetails;

		if (!shading.data) {
			shading.data = [];
		}

		const shadingItem: ShadingData = {
			name: fields.name,
			startAngle: fields.startAngle,
			endAngle: fields.endAngle,
			objectType: fields.objectType,
			height: fields.height,
			distance: fields.distance
		};

		if (route.params.shading && route.params.shading !== 'create') {
			const index = parseInt(route.params.shading as string);
			shading.data[index] = shadingItem;
		} else {
			shading.data.push(shadingItem);
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
			id="startAngle"
			type="govInputWithSuffix"
			label="Shading start angle"
			help="Absolute start angle from compass North of the segment."
			name="startAngle"
			validation="required | number | min:0 | max:360"
			suffix-text="&deg"
		/>
		<FormKit
			id="endAngle"
			type="govInputWithSuffix"
			label="Shading end angle"
			help="Absolute end angle from compass North of the segment clockwise from the start angle. (E.g. the end angle must be greater than the start angle)."
			name="endAngle"
			validation="required | number | min:0 | max:360"
			suffix-text="&deg"
		/>
		<FormKit
			id="objectType"
			type="govRadios"
			label="Object Type"
			help="Select what type of object is causing the shading"
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
			help="Enter the height of the object causing the shading"
		/>
		<FormKit
			id="distance"
			type="govInputWithSuffix"
			label="Distance"
			suffix-text="m"
			name="distance"
			validation="required | number"
			help="Provide the distance from the dwelling to the shading object"
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

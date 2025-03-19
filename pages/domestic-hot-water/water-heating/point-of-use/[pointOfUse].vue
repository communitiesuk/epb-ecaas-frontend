<script setup lang="ts">
const title = "Point of use";
const store = useEcaasStore();
const route = useRoute();

const pointOfUseData = useItemToEdit('pointOfUse', store.domesticHotWater.waterHeating.pointOfUse.data);
const model: Ref<PointOfUseData> = ref(pointOfUseData!);

const saveForm = (fields: PointOfUseData) => {
	store.$patch((state) => {
		const {pointOfUse} = state.domesticHotWater.waterHeating;

		if (!pointOfUse.data) {
			pointOfUse.data = [];
		}

		const pointOfUseItem: PointOfUseData = {
			name: fields.name
		};

		if (route.params.pointOfUse && route.params.pointOfUse !== 'create') {
			const index = parseInt(route.params.pointOfUse as string);
			pointOfUse.data[index] = pointOfUseItem;
		} else {
			pointOfUse.data.push(pointOfUseItem);
		}

		pointOfUse.complete = true;
	});

	navigateTo("/domestic-hot-water/water-heating");
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="pointOfUseErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
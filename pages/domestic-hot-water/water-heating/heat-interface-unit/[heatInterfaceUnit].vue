<script setup lang="ts">
const title = "Heat interface unit";
const store = useEcaasStore();
const route = useRoute();

const heatInterfaceUnitData = useItemToEdit('heatInterfaceUnit', store.domesticHotWater.waterHeating.heatInterfaceUnit.data);
const model: Ref<HeatInterfaceUnitData> = ref(heatInterfaceUnitData!);

const saveForm = (fields: HeatInterfaceUnitData) => {
	store.$patch((state) => {
		const {heatInterfaceUnit} = state.domesticHotWater.waterHeating;

		if (!heatInterfaceUnit.data) {
			heatInterfaceUnit.data = [];
		}

		const heatInterfaceUnitItem: HeatInterfaceUnitData = {
			name: fields.name
		};

		if (route.params.heatInterfaceUnit && route.params.heatInterfaceUnit !== 'create') {
			const index = parseInt(route.params.heatInterfaceUnit as string);
			heatInterfaceUnit.data[index] = heatInterfaceUnitItem;
		} else {
			heatInterfaceUnit.data.push(heatInterfaceUnitItem);
		}

		heatInterfaceUnit.complete = true;
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatInterfaceUnitErrorSummary"/>
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
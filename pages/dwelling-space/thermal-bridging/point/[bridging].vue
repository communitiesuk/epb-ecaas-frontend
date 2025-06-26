<script setup lang="ts">
const title = "Point thermal bridges";
const store = useEcaasStore();
const { saveToList } = useForm();

const thermalBridgeData = useItemToEdit('bridging', store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data);
const model: Ref<PointThermalBridgeData> = ref(thermalBridgeData!);

const saveForm = (fields: PointThermalBridgeData) => {
	store.$patch((state) => {
		const {dwellingSpacePointThermalBridges} = state.dwellingFabric.dwellingSpaceThermalBridging;

		const thermalBridge: PointThermalBridgeData = {
			name: fields.name,
			heatTransferCoefficient: fields.heatTransferCoefficient
		};
		dwellingSpacePointThermalBridges.complete = false;
		saveToList(thermalBridge, dwellingSpacePointThermalBridges);
	});

	navigateTo("/dwelling-space/thermal-bridging");
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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="pointBridgeErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="heatTransferCoefficient"
			type="govInputWithSuffix"
			label="Heat transfer coefficient"
			name="heatTransferCoefficient"
			validation="required | number"
			suffix-text="W/K"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
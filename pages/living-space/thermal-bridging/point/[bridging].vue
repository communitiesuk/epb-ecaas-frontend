<script setup lang="ts">
const title = "Point thermal bridges";
const store = useEcaasStore();
const route = useRoute();

const thermalBridgeData = useItemToEdit('bridging', store.livingSpaceFabric.livingSpaceThermalBridging.livingSpacePointThermalBridges.data);
const model: Ref<PointThermalBridgeData> = ref(thermalBridgeData!);

const saveForm = (fields: PointThermalBridgeData) => {
	store.$patch((state) => {
		const { livingSpaceThermalBridging } = state.livingSpaceFabric;
		
		if (!livingSpaceThermalBridging.livingSpacePointThermalBridges?.data) {
			livingSpaceThermalBridging.livingSpacePointThermalBridges = { data: [] };
		}

		const thermalBridge: PointThermalBridgeData = {
			name: fields.name,
			heatTransferCoefficient: fields.heatTransferCoefficient
		};

		if (route.params.bridging && route.params.bridging !== 'create') {
			const index = parseInt(route.params.bridging as string);
			livingSpaceThermalBridging.livingSpacePointThermalBridges.data[index] = thermalBridge;
		} else {
			livingSpaceThermalBridging.livingSpacePointThermalBridges.data.push(thermalBridge);
		}

		state.livingSpaceFabric.livingSpaceThermalBridging.livingSpacePointThermalBridges.complete = true;
	});

	navigateTo("/living-space/thermal-bridging");
};

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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="pointBridgeErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Give this element a name so it can be identified later."
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
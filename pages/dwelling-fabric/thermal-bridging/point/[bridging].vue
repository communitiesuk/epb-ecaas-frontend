<script setup lang="ts">
import { getUrl } from "~/utils/page";

const title = "Point thermal bridges";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const thermalBridgeData = useItemToEdit("bridging", store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data);
const model: Ref<PointThermalBridgeData | undefined> = ref(thermalBridgeData?.data);

const saveForm = (fields: PointThermalBridgeData) => {
	store.$patch((state) => {
		const { dwellingSpacePointThermalBridges } = state.dwellingFabric.dwellingSpaceThermalBridging;
		const index = getStoreIndex(dwellingSpacePointThermalBridges.data);

		dwellingSpacePointThermalBridges.data[index] = {
			data: {
				name: fields.name,
				heatTransferCoefficient: fields.heatTransferCoefficient
			},
			complete: true
		};

		dwellingSpacePointThermalBridges.complete = false;
	});

	navigateTo("/dwelling-fabric/thermal-bridging");
};

autoSaveElementForm({
	model,
	storeData: store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges,
	defaultName: "Point thermal bridge",
	onPatchCreate: (state, newData) => {
		state.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data.push(newData);
		state.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.complete = false;
	},
	onPatchUpdate: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data[index] = newData;
		state.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.complete = false;
	},
});

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
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceThermalBridging')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>
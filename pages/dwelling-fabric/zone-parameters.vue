<script setup lang="ts">
import { getUrl } from "#imports";

const { autoSaveForm } = useForm();
const store = useEcaasStore();

const model = ref({
	...store.dwellingFabric.dwellingSpaceZoneParameters.data,
});

// const heatingControlTypeOptions: Record<HeatingControlType, RadioOption> = {
// 	SeparateTempControl: { 
// 		label: 'Separate temperature control'
// 	},
// 	SeparateTimeAndTempControl: {
// 		label: 'Separate temperature and time control'
// 	}
// };

// const spaceHeatingSystemOptions = [
// 	store.spaceHeating.heatEmitting.wetDistribution.data.map(x => [x.name, x.name] as [string, string]),
// 	store.spaceHeating.heatEmitting.instantElectricHeater.data.map(x => [x.name, x.name] as [string, string]),
// ].flat();

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceZoneParameters: {
				data: {
					livingZoneArea: fields.livingZoneArea,
					restOfDwellingArea: fields.restOfDwellingArea,
					groundFloorArea: fields.groundFloorArea,
					volume: fields.volume,
				},
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-fabric");
};

autoSaveForm(model, (state, newData) => {
	state.dwellingFabric.dwellingSpaceZoneParameters = newData ;
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>Zone Parameters</Title>
	</Head>
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
			test-id="zoneParametersErrorSummary"
		/>
		<h1 class="govuk-heading-l">Zone parameters</h1>
		<FormKit
			id="livingZoneArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Floor area of the living zone"
			help="The living zone includes all rooms in the thermal envelope apart from bedrooms and any wet or utility rooms"
			name="livingZoneArea"
			validation="required | number | min:0 | max:10000"
			data-field="Zone.livingzone_area"
		/>
		<FormKit
			id="restOfDwellingArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Floor area of the rest of dwelling"
			help="This is the total conditioned floor area minus the area of the living zone"
			name="restOfDwellingArea"
			validation="required | number | min:0 | max:10000"
			data-field="Zone.restofdwelling_area"
		/>
		<FormKit
			id="groundFloorArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Footprint area’"
			help="Enter the total footprint of the dwelling"
			name="groundFloorArea"
			validation="required | number | min:0 | max:10000"
			data-field="Zone.groundfloor_area"
		/>
		<FormKit
			id="volume"
			type="govInputWithSuffix"
			suffix-text="m³"
			label="Volume"
			name="volume"
			help="Enter the volume of the whole thermal envelope of the dwelling, including internal walls and floors. It should be measured up to the loft insulation.’"
			validation="required | number | min:0 | max:50000"
			data-field="Zone.volume"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingFabric')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>

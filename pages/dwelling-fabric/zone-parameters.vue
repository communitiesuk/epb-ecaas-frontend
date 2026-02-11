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
		<p class="govuk-hint">For this release the information required about zones has been simplified. Please be aware that input relating to zones may change in future releases as the calculation model is refined.</p>
		<FormKit
			id="livingZoneArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Enter the floor area of the living zone"
			name="livingZoneArea"
			validation="required | number | min:0 | max:10000"
			data-field="Zone.livingzone_area"
		/>
		<FormKit
			id="restOfDwellingArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Floor area of the rest of dwelling"
			help="Enter the floor area of the whole dwelling"
			name="restOfDwellingArea"
			validation="required | number | min:0 | max:10000"
			data-field="Zone.restofdwelling_area"
		/>
		<FormKit
			id="groundFloorArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Floor area of ground floor"
			help="Enter the total footprint of the ground floor, or largest floor of the dwelling if it's a flat"
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
			help="Enter the volume of the whole dwelling"
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

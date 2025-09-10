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
// 	store.heatingSystems.heatEmitting.wetDistribution.data.map(x => [x.name, x.name] as [string, string]),
// 	store.heatingSystems.heatEmitting.instantElectricHeater.data.map(x => [x.name, x.name] as [string, string]),
// ].flat();

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceZoneParameters: {
				data: {
					area: fields.area,
					volume: fields.volume,
					spaceHeatingSystemForThisZone: fields.spaceHeatingSystemForThisZone,
					// heatingControlType: fields.heatingControlType,
					// spaceCoolingSystemForThisZone: fields.spaceCoolingSystemForThisZone,
					// spaceHeatControlSystemForThisZone: fields.spaceHeatControlSystemForThisZone,
				},
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-space");
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
		<!--		<p class="govuk-body">-->
		<!--			<a href="/guidance/zone-parameters" target="_blank" class="govuk-link">-->
		<!--				Zone parameters guidance (opens in another window)-->
		<!--			</a>-->
		<!--		</p>-->
		<FormKit
			id="area"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Area"
			name="area"
			help="Enter the total area of the floors in the dwelling"
			validation="required"
		/>
		<FormKit
			id="volume"
			type="govInputWithSuffix"
			suffix-text="m³"
			label="Volume"
			name="volume"
			help="Enter the volume of the whole dwelling"
			validation="required"
		/>
		<!-- <FormKit
			id="heatingControlType"
			type="govRadios"
			:options="heatingControlTypeOptions"
			label="Heating control type"
			name="heatingControlType"
			validation="required"
			help="Determines whether living-room and rest-of-dwelling have differing set-points/heating schedules"
		/> -->

		<!--		<FormKit-->
		<!--			id="spaceHeatingSystemForThisZone"-->
		<!--			type="govRadios"-->
		<!--			label=" Heat emitting system for this zone"-->
		<!--			name="spaceHeatingSystemForThisZone"-->
		<!--			help="Select a heat emitting system that has already been added to the calculation. You can only add one heat emitting system for each zone."-->
		<!--			:options="new Map(spaceHeatingSystemOptions)"-->
		<!--			:link="getUrl('heatingSystems')"-->
		<!--			validation="required">-->
		<!--			<div v-if="!spaceHeatingSystemOptions.length">-->
		<!--				<p class="govuk-error-message">No heat emitting systems added.</p>-->
		<!--			</div>-->
		<!--		</FormKit>-->

		<!--		<p class="govuk-!-margin-bottom-5">-->
		<!--			<NuxtLink :to="getUrl('heatEmitting')" class="govuk-link gov-radios-add-link">-->
		<!--				{{spaceHeatingSystemOptions.length ? "Edit heat emitting systems" : "Add heat emitting system"}}-->
		<!--			</NuxtLink>-->
		<!--		</p>-->

		<!-- <FormKit
			id="spaceCoolingSystem"
			type="govStoredList"
			label="Cooling for this zone"
			name="spaceCoolingSystem"
			help="Select a space cooling system that has already been added to the calculation"
			:options="[]"
			:link="getUrl('cooling')"
		/> -->
		<!-- <FormKit
			id="spaceHeatControlSystem"
			type="govStoredList"
			label="Space heat control system for this zone"
			name="spaceHeatControlSystem"
			help="Select a space heat control system that has already been added to the calculation"
			:options="[]"
			link="/"
		/> -->
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingFabric')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>

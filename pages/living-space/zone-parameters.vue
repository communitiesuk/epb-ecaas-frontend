<script setup lang="ts">
import { getUrl } from '#imports';
import type { RadioOption } from '~/components/form-kit/Radios.vue';
import type { HeatingControlType } from '~/schema/api-schema.types';

const store = useEcaasStore();

const model = ref({
	...store.livingSpaceFabric.livingSpaceZoneParameters.data,
});

const heatingControlTypeOptions: Record<HeatingControlType, RadioOption> = {
	SeparateTempControl: { 
		label: 'Separate temperature control'
	},
	SeparateTimeAndTempControl: {
		label: 'Separate temperature and time control'
	}
};

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		livingSpaceFabric: {
			livingSpaceZoneParameters: {
				data: {
					area: fields.area,
					volume: fields.volume,
					heatingControlType: fields.heatingControlType,
					spaceHeatingSystemForThisZone: fields.spaceHeatingSystemForThisZone,
					spaceCoolingSystemForThisZone: fields.spaceCoolingSystemForThisZone,
					spaceHeatControlSystemForThisZone: fields.spaceHeatControlSystemForThisZone,
				},
				complete: true,
			},
		},
	});

	navigateTo("/living-space");
};

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
		<p class="govuk-body">
			<a href="/guidance/zone-parameters" target="_blank" class="govuk-link">
				Zone parameters guidance (opens in another window)
			</a>
		</p>
		<!--<GovDetails
			class="summary-text"
			:summary-text="`Example values`"
			text=""
			classes="govuk-!-margin-bottom-4"
		/>-->
		<FormKit
			id="area"
			type="govInputWithSuffix"
			suffix-text="m2"
			label="Area"
			name="area"
			help="Floor area of the zone"
			validation="required"
		/>
		<FormKit
			id="volume"
			type="govInputWithSuffix"
			suffix-text="m3"
			label="Volume"
			name="volume"
			help="Volume of the zone"
			validation="required"
		/>

		<FormKit
			id="heatingControlType"
			type="govRadios"
			:options="heatingControlTypeOptions"
			label="Heating control type"
			name="heatingControlType"
			validation="required"
			help="Determines whether living-room and rest-of-dwelling have differing set-points/heating schedules"
		/>

		<FormKit
			id="spaceHeatingSystem"
			type="govStoredList"
			label="Space heating system for this zone"
			name="spaceHeatingSystem"
			help="Select a space heating system that has already been added to the calculation"
			:options="[]"
			:link="getUrl('heatingSystems')"
		/>

		<FormKit
			id="spaceCoolingSystem"
			type="govStoredList"
			label="Space cooling system for this zone"
			name="spaceCoolingSystem"
			help="Select a space cooling system that has already been added to the calculation"
			:options="[]"
			:link="getUrl('cooling')"
		/>
		<FormKit
			id="spaceHeatControlSystem"
			type="govStoredList"
			label="Space heat control system for this zone"
			name="spaceHeatControlSystem"
			help="Select a space heat control system that has already been added to the calculation"
			:options="[]"
			link="/"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>

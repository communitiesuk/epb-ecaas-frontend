<script setup lang="ts">
import type { WaterPipeworkLocation } from '~/schema/api-schema.types';

const title = "Secondary pipework";
const store = useEcaasStore();
const { saveToList } = useForm();

const pipeworkData = useItemToEdit('pipe', store.domesticHotWater.pipework.secondaryPipework.data);
const model: Ref<SecondaryPipeworkData> = ref(pipeworkData!);

const locationOptions: Record<WaterPipeworkLocation, SnakeToSentenceCase<WaterPipeworkLocation>> = {
	internal: 'Internal',
	external: 'External',
};

const saveForm = (fields: SecondaryPipeworkData) => {
	store.$patch((state) => {
		const {secondaryPipework} = state.domesticHotWater.pipework;

		const pipeworkItem: SecondaryPipeworkData = {
			name: fields.name,
			location: fields.location,
			length: fields.length,
			internalDiameter: fields.internalDiameter,
		};

		saveToList(pipeworkItem, secondaryPipework);
		secondaryPipework.complete = false;
	});

	navigateTo("/domestic-hot-water/pipework");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="pipeworkErrorSummary" />

		<GovDetails class="summary-text" :summary-text="`Help with these inputs`" classes="govuk-!-margin-bottom-4">
			<table class="govuk-table">
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th class="govuk-table__header">Parameter</th>
						<th class="govuk-table__header">Typical values</th>
					</tr>
					<tr class="govuk-table__row">
						<td class="govuk-table__cell">Internal diameter of pipework</td>
						<td class="govuk-table__cell">10 - 22 mm, depending on use: <br >10 - 15 mm → For individual outlets (e.g.,
							taps, showers)<br >15 - 22 mm → For main hot water
							distribution pipes</td>
					</tr>
					<tr class="govuk-table__row">
						<td class="govuk-table__cell">Length of pipework</td>
						<td class="govuk-table__cell">5 - 15 meters → Small apartment or compact layout<br >15 - 30 meters →
							Standard house with multiple outlets<br >30+ meters → Larger homes with complex pipe runs</td>
					</tr>

				</tbody>
			</table>

		</GovDetails>

		<FormKit
			id="name" type="govInputText" label="Name"
			help="Provide a name for this element so that it can be identified later" name="name"
			validation="required | length:1,50" />
		<FormKit
			id="location" type="govRadios" :options="locationOptions" label="Location" help="The location of the pipe" name="location" validation="required" />
		<FormKit
			id="length" type="govInputWithSuffix" label="Length"
			help="Total length of distribution pipework - pipework serving multiple tapping points should be counted once for each tapping point"
			name="length" validation="required | number | min:0 | max:200" suffix-text="m" />
		<FormKit
			id="internalDiameter" type="govInputWithSuffix" label="Internal diameter"
			help="Internal diameter of the pipe" name="internalDiameter" validation="number| min:5 | max:10"
			suffix-text="mm" />
		<FormKit type="govButton" label="Save and continue" />
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

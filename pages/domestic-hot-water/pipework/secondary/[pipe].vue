<script setup lang="ts">
import type { WaterPipeworkLocation } from '~/schema/api-schema.types';
import { getUrl  } from '#imports';

const title = "Secondary pipework";
const store = useEcaasStore();
const route = useRoute();

const pipeworkData = useItemToEdit('pipe', store.domesticHotWater.pipework.secondaryPipework.data);
const model: Ref<SecondaryPipeworkData | undefined > = ref(pipeworkData?.data);

const locationOptions: Record<WaterPipeworkLocation, SnakeToSentenceCase<WaterPipeworkLocation>> = {
	internal: 'Internal',
	external: 'External',
};

const saveForm = (fields: SecondaryPipeworkData) => {
	store.$patch((state) => {
		const {secondaryPipework} = state.domesticHotWater.pipework;
		const storeData = store.domesticHotWater.pipework.secondaryPipework.data;
		const index = route.params.pipe === 'create' ? storeData.length -1 : Number(route.params.pipe);
		const pipeworkItem: EcaasForm<SecondaryPipeworkData> = {
			data: {
				name: fields.name,
				location: fields.location,
				length: fields.length,
				internalDiameter: fields.internalDiameter,
			}
		};
		secondaryPipework.data[index] = pipeworkItem;
		secondaryPipework.complete = false;
	});

	navigateTo("/domestic-hot-water/pipework");
};

watch(model, async (newData: SecondaryPipeworkData | undefined, initialData: SecondaryPipeworkData | undefined) => {
	const storeData = store.domesticHotWater.pipework.secondaryPipework.data;

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = 'Secondary pipework';
	const duplicates = storeData.filter(x => x.data.name.match(duplicateNamePattern(defaultName)));

	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
		Object.values(newData).some(x => x !== undefined);

	if (route.params.pipe === 'create' && isFirstEdit) {

		store.$patch(state => {
			state.domesticHotWater.pipework.secondaryPipework.data.push({
				data: {
					...newData,
					name: newData.name || (duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName)
				}
			});
		});

		return;
	}

	store.$patch((state) => {
		const index = route.params.pipe === 'create' ? storeData.length - 1 : Number(route.params.pipe);

		state.domesticHotWater.pipework.secondaryPipework.data[index] = {
			data: {
				...newData,
				name: newData.name ?? state.domesticHotWater.pipework.secondaryPipework.data[index]?.data.name
			}
		};

		state.domesticHotWater.pipework.secondaryPipework.complete = false;
	});
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<LinksPipeworkGuidance />
	<FormKit
		v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="pipeworkErrorSummary" />
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required | length:1,50"
		/>
		<FormKit
			id="internalDiameter"
			type="govInputWithSuffix"
			label="Internal diameter"
			help="This is the nominal internal width of the pipe. Typically between 13 and 25mm."
			name="internalDiameter"
			validation="number| min:1 | max:50"
			suffix-text="mm"/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length"
			help="Enter the total length of the distribution pipework. Pipework serving multiple tapping points should be counted once for each tapping point."
			name="length"
			validation="required | number | min:0 | max:200"
			suffix-text="m">
			<GovDetails class="summary-text" summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th class="govuk-table__header">Home type</th>
							<th class="govuk-table__header">Typical length</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Small apartment or compact layout</td>
							<td class="govuk-table__cell">5 - 15m</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Standard house with multiple outlets</td>
							<td class="govuk-table__cell">15 - 30m</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Larger homes with complex pipe runs</td>
							<td class="govuk-table__cell">More than 30m</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="location"
			type="govRadios"
			:options="locationOptions"
			label="Location"
			help="Specify the location of the pipework"
			name="location"
			validation="required"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('pipework')" secondary>Save progress</GovButton>
		</div>
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

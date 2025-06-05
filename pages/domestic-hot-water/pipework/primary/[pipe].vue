<script setup lang="ts">
import { getUrl, type SnakeToSentenceCase } from '#imports';
import type { WaterPipeContentsType, WaterPipeworkLocation } from '~/schema/api-schema.types';

const title = "Primary pipework";
const store = useEcaasStore();
const { saveToList } = useForm();

const pipeworkData = useItemToEdit('pipe', store.domesticHotWater.pipework.primaryPipework.data);
const model: Ref<PrimaryPipeworkData> = ref(pipeworkData!);

const pipeContentsOptions: Record<WaterPipeContentsType, string> = {
	water: 'Water',
	air: 'Air',
	glycol25: 'Glycol 25',
};

const locationOptions: Record<WaterPipeworkLocation, SnakeToSentenceCase<WaterPipeworkLocation>> = {
	internal: 'Internal',
	external: 'External',
};

const saveForm = (fields: PrimaryPipeworkData) => {
	store.$patch((state) => {
		const {primaryPipework} = state.domesticHotWater.pipework;

		const pipeworkItem: PrimaryPipeworkData = {
			name: fields.name,
			internalDiameter: fields.internalDiameter,
			externalDiameter: fields.externalDiameter,
			length: fields.length,
			insulationThickness: fields.insulationThickness,
			thermalConductivity: fields.thermalConductivity,
			surfaceReflectivity: fields.surfaceReflectivity,
			pipeContents: fields.pipeContents,
			hotWaterCylinder: fields.hotWaterCylinder,
			location: fields.location,
		};

		saveToList(pipeworkItem, primaryPipework);
		
		primaryPipework.complete = false;
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
						<td class="govuk-table__cell">15 - 28 mm</td>
					</tr>
					<tr class="govuk-table__row">
						<td class="govuk-table__cell">External diameter of pipework</td>
						<td class="govuk-table__cell">22 - 28 mm</td>
					</tr>
					<tr class="govuk-table__row">
						<td class="govuk-table__cell">Length of pipework</td>
						<td class="govuk-table__cell">
							5 - 20 meters (small apartment)<br>
							20 50 meters (large house)
						</td>
					</tr>
					<tr class="govuk-table__row">
						<td class="govuk-table__cell">Thermal conductivity of insulation</td>
						<td class="govuk-table__cell">
							<p>Mineral wool / fiberglass:<br>
								0.035 - 0.045 W/m.K</p>
							<p>Polyethylene foam:<br>
								0.035 - 0.0.40 W/m.K</p>
							<p>Elastomeric foam (e.g. Armaflex):<br>
								0.033 - 0.040 W/m.K</p>
						</td>
					</tr>
					<tr class="govuk-table__row">
						<td class="govuk-table__cell">Insulation thickness</td>
						<td class="govuk-table__cell">
							13 - 25 mm<br>
							32 mm+<br>
							(for high-performance or external pipework)
						</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>

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
			label="Internal diameter of pipework"
			help="Nominal internal width of pipe"
			name="internalDiameter"
			validation="required | number"
			suffix-text="mm"
		/>
		<FormKit
			id="externalDiameter"
			type="govInputWithSuffix"
			label="External diameter of pipework"
			help="Nominal external width of pipe"
			name="externalDiameter"
			validation="required | number"
			suffix-text="mm"
		/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length"
			help="Length of the pipework between the cylinder and heat source"
			name="length"
			validation="required | number | min:0 | max:200"
			suffix-text="m"
		/>
		<FormKit
			id="insulationThickness"
			type="govInputWithSuffix"
			label="Insulation thickness"
			help="The thickness of insulation around the pipe"
			name="insulationThickness"
			validation="required | number"
			suffix-text="mm"
		/>
		<FormKit
			id="thermalConductivity"
			type="govInputWithSuffix"
			label="Thermal conductivity of the insulation"
			help="The conductivity of the insulation around the pipe"
			name="thermalConductivity"
			validation="required | number"
			suffix-text="W / m.K"
		/>
		<FormKit
			id="surfaceReflectivity"
			type="govBoolean"
			true-label="Reflective"
			false-label="Not reflective"
			label="Surface reflectivity"
			help="Whether there is a reflective coating or not"
			name="surfaceReflectivity"
			validation="required"
		/>
		<FormKit
			id="pipeContents"
			type="govRadios"
			:options="pipeContentsOptions"
			label="Pipe contents"
			help="The medium distributed through the pipe"
			name="pipeContents"
			validation="required"
		/>
		<FormKit
			id="hotWaterCylinder"
			type="govRadios"
			:options="new Map(store.domesticHotWater.waterHeating.hotWaterCylinder.data.map(x => [x.id, x.name]))"
			label="Hot water cylinder"
			help="Select a hot water cylinder that this pipework is connected to"
			name="hotWaterCylinder"
			validation="required">
			<div v-if="!store.domesticHotWater.waterHeating.hotWaterCylinder.data.length">
				<p class="govuk-error-message">No hot water cylinder added.</p>
				<NuxtLink :to="getUrl('hotWaterCylinderCreate')" class="govuk-link gov-radios-add-link">
					Click here to add a hot water cylinder
				</NuxtLink>
			</div>
		</FormKit>
		<FormKit
			id="location"
			type="govRadios"
			:options="locationOptions"
			label="Location"
			help="The location of the pipe"
			name="location"
			validation="required"
		/>
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

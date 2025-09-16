<script setup lang="ts">
import { getUrl  } from "#imports";
import type { SnakeToSentenceCase } from "#imports";
import type { WaterPipeContentsType, WaterPipeworkLocation } from "~/schema/api-schema.types";
const { autoSaveElementForm, getStoreIndex } = useForm();

const title = "Primary pipework";
const store = useEcaasStore();

const pipeworkData = useItemToEdit("pipe", store.domesticHotWater.pipework.primaryPipework.data);
const model: Ref<PrimaryPipeworkData | undefined > = ref(pipeworkData?.data);

const pipeContentsOptions: Record<WaterPipeContentsType, string> = {
	water: "Water",
	air: "Air",
	glycol25: "Glycol 25",
};

const locationOptions: Record<WaterPipeworkLocation, SnakeToSentenceCase<WaterPipeworkLocation>> = {
	internal: "Internal",
	external: "External",
};

const saveForm = (fields: PrimaryPipeworkData) => {
	store.$patch((state) => {
		const { primaryPipework } = state.domesticHotWater.pipework;
		
		const index = getStoreIndex(primaryPipework.data);

		primaryPipework.data[index] = {
			data: {
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
			},
			complete: true,
		};
		primaryPipework.complete = false;
	});

	navigateTo("/domestic-hot-water/pipework");
};


autoSaveElementForm({
	model,
	storeData: store.domesticHotWater.pipework.primaryPipework,
	defaultName: "Primary pipework",
	onPatch: (state, newData, index) => {
		state.domesticHotWater.pipework.primaryPipework.data[index] = newData;
		state.domesticHotWater.pipework.primaryPipework.complete = false;
	} });

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
			validation="required:trim | length:1,50"
		/>
		<FormKit
			id="internalDiameter"
			type="govInputWithSuffix"
			label="Internal diameter of pipework"
			help="Enter the nominal internal width of the pipe. Typically between 13 and 25mm."
			name="internalDiameter"
			validation="required | number"
			suffix-text="mm"
		/>
		<FormKit
			id="externalDiameter"
			type="govInputWithSuffix"
			label="External diameter of pipework"
			help="Enter the nominal external width of the pipe. Typically between 15 and 28mm."
			name="externalDiameter"
			validation="required | number"
			suffix-text="mm"
		/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length"
			help="Enter the length of the pipework between the cylinder and the heat source. Typically 5-20m for a small apartment and 20-50m for a larger house"
			name="length"
			validation="required | number | min:0 | max:200"
			suffix-text="m"
		/>
		<FormKit
			id="insulationThickness"
			type="govInputWithSuffix"
			label="Insulation thickness"
			help="Enter the thickness of insulation around the pipe. Typically 13-25mm or 32mm plus for high performance or external pipework"
			name="insulationThickness"
			validation="required | number"
			suffix-text="mm"
		/>
		<FormKit
			id="thermalConductivity"
			type="govInputWithSuffix"
			label="Thermal conductivity of the insulation"
			help="Enter the conductivity of the insulation around the pipe"
			name="thermalConductivity"
			validation="required | number"
			suffix-text="W/(m·K)"
		>
			<GovDetails class="summary-text" :summary-text="`Help with this input`" classes="govuk-!-margin-bottom-4" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th class="govuk-table__header">Insulation type</th>
							<th class="govuk-table__header">Typical thermal conductivity</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Mineral wool / fiberglass</td>
							<td class="govuk-table__cell">0.035 - 0.045 W/(m·K)</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Polyethylene foam</td>
							<td class="govuk-table__cell">0.035 - 0.0.40 W/(m·K)</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Elastomeric foam (for example Armaflex)</td>
							<td class="govuk-table__cell">0.033 - 0.040 W/(m·K)</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="surfaceReflectivity"
			type="govBoolean"
			true-label="Reflective"
			false-label="Not reflective"
			label="Surface reflectivity"
			help="Specify whether the coating is reflective"
			name="surfaceReflectivity"
			validation="required"
		/>
		<FormKit
			id="pipeContents"
			type="govRadios"
			:options="pipeContentsOptions"
			label="Pipe contents"
			help="Specify what is distributed through the pipe"
			name="pipeContents"
			validation="required"
		/>
		<ClientOnly>
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
					<NuxtLink :to="getUrl('waterHeating')" class="govuk-link gov-radios-add-link">
						Click here to add a hot water cylinder
					</NuxtLink>
				</div>
			</FormKit>
		</ClientOnly>
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
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('pipework')" test-id="saveProgress" secondary>Save progress</GovButton>
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

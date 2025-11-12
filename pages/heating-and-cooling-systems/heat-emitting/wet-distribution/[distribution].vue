<script setup lang="ts">
import { isInteger } from "~/utils/validation";
import { getUrl, type WetDistributionData } from "#imports";
import { ecoDesignControllerOptions, uniqueName } from "#imports";

const title = "Wet distribution";
const store = useEcaasStore();
const route = useRoute();

const { autoSaveElementForm, getStoreIndex } = useForm();

const wetDistributionStoreData = store.heatingAndCoolingSystems.heatEmitting.wetDistribution.data;
const index = getStoreIndex(wetDistributionStoreData);
const wetDistributionData = useItemToEdit(
	"distribution",
	store.heatingAndCoolingSystems.heatEmitting.wetDistribution.data,
);
const model: Ref<WetDistributionData> = ref({
	...wetDistributionData?.data,
} as WetDistributionData);

const typeOfSpaceHeaterOptions: Record<"radiator", string> = {
	radiator: "Radiators",
	// remove under-floor heating (UFH) option for now
	// ufh: 'Under floor heating (UFH)',
};

const saveForm = (fields: WetDistributionData) => {

	// we only support radiators right now
	fields.typeOfSpaceHeater = "radiator";

	store.$patch((state) => {
		const { wetDistribution } = state.heatingAndCoolingSystems.heatEmitting;
		const storeData = store.heatingAndCoolingSystems.heatEmitting.wetDistribution.data;

		const commonFields = {
			name: fields.name,
			heatSource: fields.heatSource,
			thermalMass: fields.thermalMass,
			designTempDiffAcrossEmitters: fields.designTempDiffAcrossEmitters,
			designFlowTemp: fields.designFlowTemp,
			designFlowRate: fields.designFlowRate,
			convectionFractionWet: fields.convectionFractionWet,
			ecoDesignControllerClass: fields.ecoDesignControllerClass,
			minimumFlowTemp: fields.minimumFlowTemp,
			minOutdoorTemp: 0,
			maxOutdoorTemp: 15,
		};

		let item: WetDistributionData;

		switch (fields.typeOfSpaceHeater) {
			case "radiator":
				item = {
					...commonFields,
					typeOfSpaceHeater: fields.typeOfSpaceHeater,
					numberOfRadiators: fields.numberOfRadiators,
					exponent: 1.3,
					constant: 0.08,
				};
				break;

			case "ufh":
				item = {
					...commonFields,
					typeOfSpaceHeater: fields.typeOfSpaceHeater,
					emitterFloorArea: fields.emitterFloorArea,
					equivalentThermalMass: 80,
					systemPerformanceFactor: 5,
				};
				break;

			default:
				throw new Error("Unsupported type of space heater");
		};

		wetDistribution.data[index] = {
			data: item,
			complete: true,
		};

		wetDistribution.complete = false;
	});

	navigateTo("/heating-and-cooling-systems/heat-emitting");
};

autoSaveElementForm<WetDistributionData>({
	model,
	storeData: store.heatingAndCoolingSystems.heatEmitting.wetDistribution,
	defaultName: "Wet distribution",
	onPatch: (state, newData, index) => {
		// we only support radiators
		newData.data.typeOfSpaceHeater = "radiator";
		state.heatingAndCoolingSystems.heatEmitting.wetDistribution.data[index] = newData;
		state.heatingAndCoolingSystems.heatEmitting.wetDistribution.complete = false;
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
		<GovErrorSummary
			:error-list="errorMessages"
			test-id="wetDistributionErrorSummary"
		/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(wetDistributionStoreData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>

		<FieldsHeatGenerators
			id="heatSource"
			name="heatSource"
			label="Heat source"
			help="Select the relevant heat source that has been added previously"
			data-field="SpaceHeatSystem.*.HeatSource"
		/>
		<FormKit
			id="thermalMass"
			type="govInputWithSuffix"
			label="Thermal mass"
			name="thermalMass"
			validation="required | number"
			suffix-text="kWh/K"
			help="Enter the thermal mass of the entire wet distribution system including pipework. Typically between 0.1 and 0.5 kWh/K."
			data-field="SpaceHeatSystem.*.thermal_mass"
		/>
			
		<FormKit
			id="designTempDiffAcrossEmitters"
			type="govInputWithSuffix"
			label="Design temperature difference across the emitters"
			name="designTempDiffAcrossEmitters"
			validation="required | number"
			suffix-text="°C"
			help="The temperature difference between the flow and return water temperatures at each emitter. Typically between 5 and 15°C."
		/>
			
		<FormKit
			id="designFlowTemp"
			type="govInputWithSuffix"
			label="Design flow temperature"
			name="designFlowTemp"
			validation="required | number"
			suffix-text="°C"
			help="Enter the temperature at which water is delivered to the heating system during the coldest expected conditions. Typically between 35 and 55 °C."
		/>
		
		<FormKit
			id="designFlowRate"
			type="govInputWithSuffix"
			label="Design flow rate"
			help="Enter the volume of water flowing through the heater"
			name="designFlowRate"
			validation="required | number"
			suffix-text="litres per minute">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header govuk-!-width-one-third">Duct type</th>
							<th scope="col" class="govuk-table__header">Typical flow rate</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Small house or flat</th>
							<td class="govuk-table__cell">10-12 litres per minute</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Medium house</th>
							<td class="govuk-table__cell">12-15 litres per minute, as there is likely to be simultaneous use.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Large house</th>
							<td class="govuk-table__cell">15 litres per minute or more, to accomodate multiple bathrooms and higher occupancy.</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="typeOfSpaceHeater"
			type="govRadios"
			:options="typeOfSpaceHeaterOptions"
			label="Type of space heater"
			name="typeOfSpaceHeater"
			validation="required"
			help="For now, a user can only model a home with radiators. In future releases this will include under floor heating and other emitters."
		/>
		<template v-if="model.typeOfSpaceHeater === 'radiator'">
			<FormKit
				id="numberOfRadiators"
				name="numberOfRadiators"
				type="govInputInt"
				label="Number of radiators"
				help="Enter the number of radiators in this wet distribution system"
				:validation-rules="{ isInteger }"
				validation="required | isInteger | min: 1"
				:validation-messages="{
					isInteger: `Number of radiators must be an integer.`,
				}"
			/>

			<FormKit
				id="convectionFractionWet"
				type="govInputFloat"
				label="Convection fraction"
				name="convectionFractionWet"
				validation="required | number | min: 0 | max: 1 "
				help="Enter the proportion of heat the heater emits through convection">
				<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header govuk-!-width-one-third">Heat emitter type</th>
								<th scope="col" class="govuk-table__header">Typical convection fraction</th>
							</tr>
						</thead>
						<tbody class="govuk-table__body">
							<tr class="govuk-table__row">
								<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Radiators</th>
								<td class="govuk-table__cell">0.6-0.8</td>
							</tr>
							<tr class="govuk-table__row">
								<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Underfloor heating</th>
								<td class="govuk-table__cell">0.2-0.4</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</FormKit>
		</template>

		<template v-if="model.typeOfSpaceHeater === 'ufh'">
			<FormKit
				id="emitterFloorArea"
				type="govInputWithSuffix"
				label="Emitter floor area"
				name="emitterFloorArea"
				validation="required | number"
				help="The emitter floor area for an underfloor heating (UFH) system refers to the actual heated floor area that emits heat into the room. It is different from the total floor area because some areas may not have UFH installed (e.g. under kitchen units, bathtubs, or built-in furniture)."
				suffix-text="m²"
				data-field="SpaceHeatSystem.*.emitter_floor_area"
			/>
		</template>

		<h2 class="govuk-heading-l">Eco design controller</h2>
		<FormKit
			id="ecoDesignControllerClass"
			type="govDropdown"
			label="Eco design controller class"
			name="ecoDesignControllerClass"
			validation="required"
			:options="ecoDesignControllerOptions"
			data-field="SpaceHeatSystem.*.ecodesign_controller"
		>
			<GovDetails summary-text="Help with this input">
				<p class="govuk-body">
					<a href="/guidance/eco-design-control-guidance" target="_blank" class="govuk-link">
						Eco design control guidance (opens in another window)
					</a>
				</p>
			</GovDetails>
		</FormKit>

		<FormKit
			id="minimumFlowTemp"
			type="govInputWithSuffix"
			label="Minimum flow temperature"
			name="minimumFlowTemp"
			validation="required | number | min: 20 | max: 120"
			help="Minimum flow temperature when using weather compensation"
			suffix-text="°C"
		>
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<p class="govuk-hint">
					The minimum flow temperature isn't fixed but is influenced by
					the control logic and the building's heat demand. Weather
					compensation adjusts the flow temperature of water sent to
					radiators or underfloor heating based on the outdoor
					temperature.
				</p>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">System type</th>
							<th scope="col" class="govuk-table__header">
								Typical minimum flow temperature
							</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Radiator</td>
							<td class="govuk-table__cell">35-40°C</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Underfloor heating</td>
							<td class="govuk-table__cell">25-35°C</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('heatEmitting')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>

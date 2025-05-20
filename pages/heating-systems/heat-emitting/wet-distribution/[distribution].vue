<script setup lang="ts">
import type { FormKitOptionsProp } from "@formkit/inputs";
const title = "Wet distribution";
const store = useEcaasStore();
const { saveToList } = useForm();

const wetDistributionData = useItemToEdit(
	"distribution",
	store.heatingSystems.heatEmitting.wetDistribution.data
);
const model: Ref<WetDistributionData> = ref(wetDistributionData!);

const options: FormKitOptionsProp[] = [
	{
		1: "I: On/Off Room Thermostat",
		2: "II: Weather Compensator (Modulating Heaters)",
		3: "III: Weather Compensator (On/Off Heaters)",
		4: "IV: TPI Room Thermostat (On/Off Heaters)",
		5: "V: Modulating Room Thermostat",
		6: "VI: Weather Compensator + Room Sensor (Modulating)",
		7: "VII: Weather Compensator + Room Sensor (On/Off)",
		8: "VIII: Multi-Sensor Room Control (Modulating)",
	},
];

const saveForm = (fields: WetDistributionData) => {
	store.$patch((state) => {
		const { wetDistribution } = state.heatingSystems.heatEmitting;

		const item: WetDistributionData = {
			name: fields.name,
			zoneReference: fields.zoneReference,
			heatSource: fields.heatSource,
			thermalMass: fields.thermalMass,
			designTempDiffAcrossEmitters: fields.designTempDiffAcrossEmitters,
			designFlowTemp: fields.designFlowTemp,
			typeOfSpaceHeater: fields.typeOfSpaceHeater,
			convectionFractionWet: fields.convectionFractionWet,
			emitterFloorArea: fields.emitterFloorArea,
			ecoDesignControllerClass: fields.ecoDesignControllerClass,
			minimumFlowTemp: fields.minimumFlowTemp,
			minOutdoorTemp: 0,
			maxOutdoorTemp: 15
		};
		if(item.typeOfSpaceHeater === "radiators"){
			item.exponent = 1.3;
			item.constant = 0.08;
		};
		if(item.typeOfSpaceHeater === "underFloorHeating"){
			item.equivalentThermalMass = 80;
			item.systemPerformanceFactor = 5;
		};

		wetDistribution.complete = false;
		saveToList(item, wetDistribution);

	});

	navigateTo("/heating-systems/heat-emitting");
};

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
			validation="required" />

		<FormKit
			id="zoneReference"
			type="govRadios"
			:options="{
				livingSpace: 'Living space',
				restOfDwelling: 'Rest of dwelling',
			}"
			label="Zone reference"
			name="zoneReference"
			hint="Which zone is this emitter heating"
			validation="required"
		/>

		<FieldsHeatGenerators
			id="heatSource"
			name="heatSource"
			label="Heat source"
			help="Select the relevant heat source that has been added previously"
		/>
		<FormKit
			id="thermalMass"
			type="govInputWithSuffix"
			label="Thermal mass"
			name="thermalMass"
			validation="required | number"
			suffix-text="kJ/°C"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Description</th>
							<th scope="col" class="govuk-table__header">Example range</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">
								The thermal mass of a wet distribution system refers to the
								ability of the system's components (such as the floor or the
								pipes carrying the heated water) to store and release heat. In
								the context of underfloor heating (UFH) or other wet systems
								(e.g., radiators), thermal mass is primarily influenced by the
								material in which the heating pipes are embedded, such as
								concrete, screed, or timber.
							</td>
							<td class="govuk-table__cell">0.1 - 0.5</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="designTempDiffAcrossEmitters"
			type="govInputWithSuffix"
			label="Design temperature difference across the emitters"
			name="designTempDiffAcrossEmitters"
			validation="required | number"
			suffix-text="°C"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Description</th>
							<th scope="col" class="govuk-table__header">Example range</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">
								The difference between the water flow temperature (the
								temperature of the water circulating through the heating system)
								and the room air temperature (the ambient temperature in the
								room) at the point where the heating is being emitted, such as
								through radiators or underfloor heating (UFH).
							</td>
							<td class="govuk-table__cell">5 - 15</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="designFlowTemp"
			type="govInputWithSuffix"
			label="Design flow temperature"
			name="designFlowTemp"
			validation="required | number"
			suffix-text="°C"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Description</th>
							<th scope="col" class="govuk-table__header">Example range</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">
								The temperature at which water is delivered to the heating
								system during the coldest expected conditions in a building. It
								is the temperature chosen for the system's water supply to
								ensure that enough heat is delivered to maintain the desired
								indoor temperature under extreme conditions.
							</td>
							<td class="govuk-table__cell">35 - 55</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="typeOfSpaceHeater"
			type="govRadios"
			:options="{
				radiators: 'Radiators',
				underFloorHeating: 'Under floor heating (UFH)',
			}"
			label="Type of space heater"
			name="typeOfSpaceHeater"
			validation="required"
		/>
		<template v-if="model.typeOfSpaceHeater === 'radiators'">
			<FormKit
				id="convectionFractionWet"
				type="govInputFloat"
				label="Convection fraction"
				name="convectionFractionWet"
				validation="required | number | min: 0 | max: 1 "
			>
				<GovDetails summary-text="Help with this input">
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header">Example range</th>
							</tr>
						</thead>
						<tbody class="govuk-table__body">
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">
									The convection fraction for a radiator refers to the proportion
									of heat that a radiator emits through convection as opposed to
									radiation.
								</td>
								<td class="govuk-table__cell">0.2 - 0.8</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</FormKit>
		</template>

		<template v-if="model.typeOfSpaceHeater === 'underFloorHeating'">
			<FormKit
				id="emitterFloorArea"
				type="govInputWithSuffix"
				label="Emitter floor area"
				name="emitterFloorArea"
				validation="required | number"
				help="The emitter floor area for an underfloor heating (UFH) system refers to the actual heated floor area that emits heat into the room. It is different from the total floor area because some areas may not have UFH installed (e.g. under kitchen units, bathtubs, or built-in furniture)."
				suffix-text="m2"
			/>
		</template>

		<h2 class="govuk-heading-l">Eco design controller</h2>
		<FormKit
			id="ecoDesignControllerClass"
			type="govDropdown"
			label="Eco design controller class"
			name="ecoDesignControllerClass"
			validation="required"
			:options="options"
			
		>

			<p class="govuk-body">
				<a href="/guidance/eco-design-control-guidance" target="_blank" class="govuk-link">
					Eco design control guidance (opens in another window)
				</a></p>
		</FormKit>

		<FormKit
			id="minimumFlowTemp"
			type="govInputWithSuffix"
			label="Minimum flow temperature"
			name="minimumFlowTemp"
			validation="required | number | min: 20 | max: 120"
			help="Minimum flow temperature when using weather compensation. "
			suffix-text="°C"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Description</th>
							<th scope="col" class="govuk-table__header">System type</th>
							<th scope="col" class="govuk-table__header">
								Minimum flow temperature
							</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">
								The minimum flow temperature isn't fixed but is influenced by
								the control logic and the building's heat demand. Weather
								compensation adjusts the flow temperature of water sent to
								radiators or underfloor heating based on the outdoor
								temperature.
							</td>
							<td class="govuk-table__cell">Radiator</td>
							<td class="govuk-table__cell">35-40</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"/>
							<td class="govuk-table__cell">UFH</td>
							<td class="govuk-table__cell">25-35</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit> 
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>

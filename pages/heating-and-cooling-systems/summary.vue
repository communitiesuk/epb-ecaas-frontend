<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
const store = useEcaasStore();
const title = "Heating system summary";

const { heatingControlType, coolingRequired } = store.heatingAndCoolingSystems.general.data;
const generalSummary: SummarySection = {
	id: "general",
	label: "General",
	data: {
		"Type of heating control": displayCamelToSentenceCase(show(heatingControlType)),
		"Cooling required": displayBoolean(coolingRequired),
	},

	editUrl: "/heating-and-cooling-systems/general",
};

const { fuelType, exported, co2PerKwh, co2PerKwhIncludingOutOfScope, kwhPerKwhDelivered } = store.heatingAndCoolingSystems.energySupply.data;
const energySupplySummary: SummarySection = {
	id: "energySupply",
	label: "Energy supply",
	data: {
		"Fuel type": displayFuelTypes(fuelType),
		...(fuelType?.includes("electricity") && {
			Exported: displayBoolean(exported),
		}),
		...(fuelType?.includes("custom") && {
			"CO2 per kWh": dim(co2PerKwh, "CO2 per kilowatt-hour"),
			"CO2 per kWh (including out of scope)": dim(co2PerKwhIncludingOutOfScope, "CO2 per kilowatt-hour"),
			"kWh per kWh delivered": show(kwhPerKwhDelivered),
		}),
	},

	editUrl: "/heating-and-cooling-systems/energy-supply",
};

const heatGenerationUrl = "/heating-and-cooling-systems/heat-generation";
const heatPumps = store.heatingAndCoolingSystems.heatGeneration.heatPump.data;
const heatPumpSummary: SummarySection = {
	id: "heatPump",
	label: "Heat pump",
	data:
		heatPumps.map((pump) => {
			return {
				Name: show(pump.data.name),
				Product: show(pump.data.productReference),
			};
		}) || [],
	editUrl: heatGenerationUrl,
};

const boilers = store.heatingAndCoolingSystems.heatGeneration.boiler.data;
const boilerSummary: SummarySection = {
	id: "boiler",
	label: "Boiler",
	data: boilers.map((boiler) => {
		return {
			Name: show(boiler.name),
		};
	}) || [],
	editUrl: heatGenerationUrl,
};

const batteries = store.heatingAndCoolingSystems.heatGeneration.heatBattery.data;
const heatBatterySummary: SummarySection = {
	id: "heatBattery",
	label: "Heat battery",
	data: batteries.map((battery) => {
		return {
			Name: show(battery.name),
		};
	}) || [],
	editUrl: heatGenerationUrl,
};

const networks = store.heatingAndCoolingSystems.heatGeneration.heatNetwork.data;
const heatNetworkSummary: SummarySection = {
	id: "heatNetwork",
	label: "Heat network",
	data: networks.map((network) => {
		return {
			Name: show(network.name),
		};
	}) || [],
	editUrl: heatGenerationUrl,
};

const units = store.heatingAndCoolingSystems.heatGeneration.heatInterfaceUnit.data;
const heatInterfaceUnitSummary: SummarySection = {
	id: "heatInterfaceUnit",
	label: "Heat interface unit",
	data: units.map((unit) => {
		return {
			Name: show(unit.name),
		};
	}) || [],
	editUrl: heatGenerationUrl,
};

const heatGenerationSummary: SummarySection[] = [
	heatPumpSummary,
	// boilerSummary,
	// heatBatterySummary,
	// heatNetworkSummary,
	// heatInterfaceUnitSummary,
];

const { heatPump } =
	store.heatingAndCoolingSystems.heatGeneration;
const heatGenerationData = [
	heatPump.data,
	// boiler.data,
	// heatBattery.data,
	// heatNetwork.data,
	// heatInterfaceUnit.data,
]
	.flat()
	.map((x) => ({ id: x.data.id, name: x.data.name }));

const heatEmittingUrl = "/heating-and-cooling-systems/heat-emitting";

const wetDistributions = store.heatingAndCoolingSystems.heatEmitting.wetDistribution.data;
const wetDistributionSummary: SummarySection = {
	id: "wetDistribution",
	label: "Wet distribution",
	data: wetDistributions.map(({ data: wetDistribution }) => {
		const hasRadiators = wetDistribution.typeOfSpaceHeater === "radiator";
		const numberOfRadiators = "numberOfRadiators" in wetDistribution ? show(wetDistribution.numberOfRadiators) : emptyValueRendering;
		const wetDistributionData: Record<string, string | number | undefined> = {
			Name: show(wetDistribution.name),
			"Heat source": show(heatGenerationData.find(
				(x) => x.id === wetDistribution.heatSource,
			)?.name),
			"Thermal mass": dim(wetDistribution.thermalMass, "kilowatt hour per kelvin"),
			"Design temperature difference across the emitters":
				dim(wetDistribution.designTempDiffAcrossEmitters, "celsius"),
			"Design flow temperature": dim(wetDistribution.designFlowTemp, "celsius"),
			"Design flow rate": dim(wetDistribution.designFlowRate, "litres per minute"),
			"Type of space heater": "typeOfSpaceHeater" in wetDistribution
				? hasRadiators ? "Radiators" : "Underfloor heating"
				: emptyValueRendering,
			...(hasRadiators ? { "Number of radiators": `${numberOfRadiators}` } : {}),
			"Convection fraction": show(wetDistribution.convectionFractionWet),
			"Emitter floor area": "emitterFloorArea" in wetDistribution ? dim(wetDistribution.emitterFloorArea, "metres square") : undefined,
			"Eco design controller class": displayEcoDesignController(wetDistribution.ecoDesignControllerClass as EcoDesignControllerValue),
			"Minimum flow temperature": dim(wetDistribution.minimumFlowTemp, "celsius"),
		};
		return wetDistributionData;
	}) || [],

	editUrl: heatEmittingUrl,
};

const instantHeaters =
	store.heatingAndCoolingSystems.heatEmitting.instantElectricHeater.data;
const instantElectricHeaterSummary: SummarySection = {
	id: "instantElectricHeater",
	label: "Instant electric heater",
	data: instantHeaters.map((instantHeater) => {
		return {
			Name: show(instantHeater.data.name),
			"Rated power": dim(instantHeater.data.ratedPower, "kilowatt"),
			"Convective type": show(instantHeater.data.convectiveType),
		};
	}) || [],
	editUrl: heatEmittingUrl,
};

const storageHeaters =
	store.heatingAndCoolingSystems.heatEmitting.electricStorageHeater.data;
const electricStorageHeaterSummary: SummarySection = {
	id: "electricStorageHeater",
	label: "Electric storage heater",
	data: storageHeaters.map((storageHeater) => {
		return {
			Name: show(storageHeater.name),
		};
	}) || [],
	editUrl: heatEmittingUrl,
};

const warmAirHeatPumps = store.heatingAndCoolingSystems.heatEmitting.warmAirHeatPump.data;
const warmAirHeatPumpSummary: SummarySection = {
	id: "warmAirHeatPump",
	label: "Warm air heat pump",
	data: warmAirHeatPumps.map((pump) => {
		return {
			Name: show(pump.name),
		};
	}) || [],
	editUrl: heatEmittingUrl,
};

const heatEmittingSummary: SummarySection[] = [
	wetDistributionSummary,
	instantElectricHeaterSummary,
	// electricStorageHeaterSummary,
	// warmAirHeatPumpSummary,
];

const coolingUrl = "/heating-and-cooling-systems/cooling";

const airConditionings = store.heatingAndCoolingSystems.cooling.airConditioning.data;
const airConditioningSummary: SummarySection = {
	id: "airConditioning",
	label: "Air conditioning systems",
	data: airConditionings.map((airConditioning) => {
		return {
			"Name": show(airConditioning.data.name),
			"Cooling capacity": dim(airConditioning.data.coolingCapacity, "kilowatt"),
			"Seasonal energy efficiency ratio": show(airConditioning.data.seasonalEnergyEfficiencyRatio),
			"Convection fraction": show(airConditioning.data.convectionFraction),
			"Energy source": sentenceCase(show(airConditioning.data.energySupply)),
		};
	}) || [],
	editUrl: coolingUrl,
};

const coolingSummary: SummarySection[] = [
	airConditioningSummary,
];

</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([generalSummary])">
		<SummaryTab :summary="generalSummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([energySupplySummary])">
		<SummaryTab :summary="energySupplySummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems(heatGenerationSummary)">
		<SummaryTab :summary="heatPumpSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No heat pumps added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('heatPumpCreate')"> 
					Add heat pump
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems(heatEmittingSummary)">
		<SummaryTab :summary="wetDistributionSummary" :selected="tabProps.currentItem?.id === 'wetDistribution'">
			<template #empty>
				<h2 class="govuk-heading-m">No wet distribution added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('wetDistributionCreate')">
					Add wet distribution
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="instantElectricHeaterSummary" :selected="tabProps.currentItem?.id === 'instantElectricHeater'">
			<template #empty>
				<h2 class="govuk-heading-m">No instant electric heaters added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('instantElectricHeaterCreate')">
					Add instant electric heater
				</NuxtLink>
			</template>
		</SummaryTab>
		<!-- <SummaryTab :summary="electricStorageHeaterSummary" :selected="tabProps.currentItem?.id === 'electricStorageHeater'">
			<template #empty>
				<h2 class="govuk-heading-m">No electric storage heaters added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('heatEmitting')">
					Add electric storage heater
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="warmAirHeatPumpSummary" :selected="tabProps.currentItem?.id === 'warmAirHeatPump'">
			<template #empty>
				<h2 class="govuk-heading-m">No warm air heat pumps added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('heatEmitting')">
					Add warm air heat pump
				</NuxtLink>
			</template>
		</SummaryTab> -->
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems(coolingSummary)">
		<SummaryTab :summary="airConditioningSummary" :selected="tabProps.currentItem?.id === 'airConditioning'">
			<template #empty>
				<h2 class="govuk-heading-m">No air conditioning systems added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('airConditioningCreate')">
					Add air conditioning system
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>

	<GovButton href="/">Return to overview</GovButton>
</template>

<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl, type EcoDesignControllerValue } from "#imports";
import { FuelType } from "~/schema/api-schema.types";
const store = useEcaasStore();
const title = "Heating system summary";

const { fuelType, exported, co2PerKwh, co2PerKwhIncludingOutOfScope, kwhPerKwhDelivered } = store.heatingSystems.energySupply.data;
const energySupplySummary: SummarySection = {
	id: "energySupply",
	label: "Energy supply",
	data: {
		"Fuel type": displayFuelTypes(fuelType),
		...(fuelType?.includes(FuelType.electricity) && {
			Exported: displayBoolean(exported),
		}),
		...(fuelType?.includes(FuelType.custom) && {
			"CO2 per kWh": dim(co2PerKwh, "CO2 per kilowatt-hour"),
			"CO2 per kWh (including out of scope)": dim(co2PerKwhIncludingOutOfScope, "CO2 per kilowatt-hour"),
			"kWh per kWh delivered": show(kwhPerKwhDelivered),
		}),
	},

	editUrl: "/heating-and-cooling-systems/energy-supply",
};

const heatGenerationUrl = "/heating-and-cooling-systems/heat-generation";
const heatPumps = store.heatingSystems.heatGeneration.heatPump.data;
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

const boilers = store.heatingSystems.heatGeneration.boiler.data;
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

const batteries = store.heatingSystems.heatGeneration.heatBattery.data;
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

const networks = store.heatingSystems.heatGeneration.heatNetwork.data;
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

const units = store.heatingSystems.heatGeneration.heatInterfaceUnit.data;
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
].filter((x) => x.data.length);

const { heatPump } =
	store.heatingSystems.heatGeneration;
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

const wetDistributions = store.heatingSystems.heatEmitting.wetDistribution.data;
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
	store.heatingSystems.heatEmitting.instantElectricHeater.data;
const instantElectricHeaterSummary: SummarySection = {
	id: "instantElectricHeater",
	label: "Instant electric heater",
	data: instantHeaters.map((instantHeater) => {
		return {
			Name: show(instantHeater.data.name),
			"Rated power": dim(instantHeater.data.ratedPower, "kilowatt"),
			"Convection fraction": show(instantHeater.data.convectionFractionInstant),
		};
	}) || [],
	editUrl: heatEmittingUrl,
};

const storageHeaters =
	store.heatingSystems.heatEmitting.electricStorageHeater.data;
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

const warmAirHeatPumps = store.heatingSystems.heatEmitting.warmAirHeatPump.data;
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
	electricStorageHeaterSummary,
	warmAirHeatPumpSummary,
].filter((x) => x.data.length);

const coolingUrl = "/heating-and-cooling-systems/cooling";

const airConditionings = store.heatingSystems.cooling.airConditioning.data;
const airConditioningSummary: SummarySection = {
	id: "airConditioning",
	label: "Air conditioning",
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
].filter((x) => x.data.length);

</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([energySupplySummary])">
		<SummaryTab :summary="energySupplySummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems(heatGenerationSummary)">
		<TabPanel id="heatGeneration" :selected="!tabProps.currentItem">
			<h2 class="govuk-heading-m">No heat generators added</h2>
			<NuxtLink class="govuk-link" :to="getUrl('heatGeneration')">
				Add heat generators
			</NuxtLink>
		</TabPanel>
		<SummaryTab :summary="heatPumpSummary" :selected="tabProps.currentItem?.id === 'heatPump'" />
		<SummaryTab :summary="boilerSummary" :selected="tabProps.currentItem?.id === 'boiler'" />
		<SummaryTab :summary="heatBatterySummary" :selected="tabProps.currentItem?.id === 'heatBattery'" />
		<SummaryTab :summary="heatNetworkSummary" :selected="tabProps.currentItem?.id === 'heatNetwork'" />
		<SummaryTab :summary="heatInterfaceUnitSummary" :selected="tabProps.currentItem?.id === 'heatInterfaceUnit'" />
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems(heatEmittingSummary)">
		<TabPanel id="heatEmitting" :selected="!tabProps.currentItem">
			<h2 class="govuk-heading-m">No heat emitters added</h2>
			<NuxtLink class="govuk-link" :to="getUrl('heatEmitting')">
				Add heat emitters
			</NuxtLink>
		</TabPanel>
		<SummaryTab :summary="wetDistributionSummary" :selected="tabProps.currentItem?.id === 'wetDistribution'" />
		<SummaryTab
			:summary="instantElectricHeaterSummary"
			:selected="tabProps.currentItem?.id === 'instantElectricHeater'" />
		<SummaryTab
			:summary="electricStorageHeaterSummary"
			:selected="tabProps.currentItem?.id === 'electricStorageHeater'" />
		<SummaryTab :summary="warmAirHeatPumpSummary" :selected="tabProps.currentItem?.id === 'warmAirHeatPump'" />
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems(coolingSummary)">
		<TabPanel id="cooling" :selected="!tabProps.currentItem">
			<h2 class="govuk-heading-m">No cooling added</h2>
			<NuxtLink class="govuk-link" :to="getUrl('cooling')">
				Add cooling
			</NuxtLink>
		</TabPanel>
		<SummaryTab :summary="airConditioningSummary" :selected="tabProps.currentItem?.id === 'airConditioning'" />
	</GovTabs>

	<GovButton href="/">Return to overview</GovButton>
</template>

<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
const store = useEcaasStore();
const title = "Heating system summary";

const energySupplySummary: SummarySection = {
	id: "energySupply",
	label: "Energy supply",
	data: {
		"Fuel type": store.heatingSystems.energySupply.data.fuelType,
		"Exported": displayBoolean(store.heatingSystems.energySupply.data.exported),
		"CO2 per kWh": store.heatingSystems.energySupply.data.co2PerKwh,
		"CO2 per kWh (including out of scope)": store.heatingSystems.energySupply.data.co2PerKwhIncludingOutOfScope,
		"kWh per kWh delivered": store.heatingSystems.energySupply.data.kwhPerKwhDelivered,
	},
	editUrl: "/heating-systems/energy-supply",
};
const heatPumps = store.heatingSystems.heatGeneration.heatPump.data;
const heatPumpSummary: SummarySection = {
	id: "heatPump",
	label: "Heat pump",

	data: heatPumps.map(pump => {
		return {
			"Name": pump.name
		};
	}) || [],
	editUrl: "/heating-systems/heat-generation",
};

const boilers = store.heatingSystems.heatGeneration.boiler.data;
const boilerSummary: SummarySection = {
	id: "boiler",
	label: "Boiler",
	data: boilers.map(boiler => {
		return {
			"Name": boiler.name
		};
	}),
	editUrl: "/heating-systems/heat-generation",
};

const batteries = store.heatingSystems.heatGeneration.heatBattery.data;
const heatBatterySummary: SummarySection = {
	id: "heatBattery",
	label: "Heat battery",
	data: batteries.map(battery => {
		return {
			"Name": battery.name
		};
	}),
	editUrl: "/heating-systems/heat-generation",
};

const networks = store.heatingSystems.heatGeneration.heatNetwork.data;
const heatNetworkSummary: SummarySection = {
	id: "heatNetwork",
	label: "Heat network",
	data: networks.map(network => {
		return {
			"Name": network.name
		};
	}),
	editUrl: "/heating-systems/heat-generation",
};

const units = store.heatingSystems.heatGeneration.heatInterfaceUnit.data;
const heatInterfaceUnitSummary: SummarySection = {
	id: "heatInterfaceUnit",
	label: "Heat interface unit",
	data: units.map(unit => {
		return {
			"Name": unit.name
		};
	}),
	editUrl: "/heating-systems/heat-generation",
};

const heatGenerationSummary: SummarySection[] = [
	heatPumpSummary,
	boilerSummary,
	heatBatterySummary,
	heatNetworkSummary,
	heatInterfaceUnitSummary
].filter(x => x.data.length);

const { heatPump, boiler, heatBattery, heatNetwork, heatInterfaceUnit } = store.heatingSystems.heatGeneration;
const heatGenerationData = [
	heatPump.data,
	boiler.data,
	heatBattery.data,
	heatNetwork.data,
	heatInterfaceUnit.data
].flat().map(x => ({ id: x.id, name: x.name }));

const wetDistributions = store.heatingSystems.heatEmitting.wetDistribution.data;
const wetDistributionSummary: SummarySection = {
	id: "wetDistribution",
	label: "Wet distribution",
	data: wetDistributions.map(wetDistribution => {
		const wetDistributionData: Record<string, string | number | undefined> = {
			"Name": wetDistribution.name,
			"Zone reference": wetDistribution.zoneReference,
			"Heat source": heatGenerationData.find(x => x.id === wetDistribution.heatSource)?.name,
			"Thermal mass": wetDistribution.thermalMass,
			"Design temperature difference across the emitters": wetDistribution.designTempDiffAcrossEmitters,
			"Design flow temperature": wetDistribution.designFlowTemp,
			"Type of space heater": wetDistribution.typeOfSpaceHeater,
		};
		if (
			wetDistribution.typeOfSpaceHeater === "radiators" &&
			wetDistribution.convectionFractionWet !== undefined
		) {
			wetDistributionData["Convection fraction"] = wetDistribution.convectionFractionWet;
		}

		if (
			wetDistribution.typeOfSpaceHeater === "underFloorHeating" &&
			wetDistribution.emitterFloorArea !== undefined
		) {
			wetDistributionData["Emitter floor area"] = wetDistribution.emitterFloorArea;
		}

		wetDistributionData["Eco design controller class"] = wetDistribution.ecoDesignControllerClass;
		wetDistributionData["Minimum flow temperature"] = wetDistribution.minimumFlowTemp;

		return wetDistributionData;
	}),

	editUrl: "",
};

const instantHeaters = store.heatingSystems.heatEmitting.instantElectricHeater.data;
const instantElectricHeaterSummary: SummarySection = {
	id: "instantElectricHeater",
	label: "Instant electric heater",
	data: instantHeaters.map(instantHeater => {
		return {
			"Name": instantHeater.name,

		};
	}),
	editUrl: "",
};

const storageHeaters = store.heatingSystems.heatEmitting.electricStorageHeater.data;
const electricStorageHeaterSummary: SummarySection = {
	id: "electricStorageHeater",
	label: "Electric storage heater",
	data: storageHeaters.map(storageHeater => {
		return {
			"Name": storageHeater.name
		};
	}),
	editUrl: "",
};

const warmAirHeatPumps = store.heatingSystems.heatEmitting.warmAirHeatPump.data;
const warmAirHeatPumpSummary: SummarySection = {
	id: "warmAirHeatPump",
	label: "Warm air heat pump",
	data: warmAirHeatPumps.map(pump => {
		return {
			"Name": pump.name
		};
	}),
	editUrl: "",
};

const heatEmittingSummary: SummarySection[] = [
	wetDistributionSummary,
	instantElectricHeaterSummary,
	electricStorageHeaterSummary,
	warmAirHeatPumpSummary
].filter(x => x.data.length);
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

	</GovTabs>
</template>

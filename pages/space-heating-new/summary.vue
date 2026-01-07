<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl, HeatSourceType } from "#imports";
import type { SchemaFuelType } from "~/schema/aliases";

const store = useEcaasStore();
const title = "Space heating NEW summary";

const spaceHeatingUrl = "/space-heating-new";

const heatSources = store.spaceHeatingNew.heatSource.data;
const boilers = heatSources.filter(x => x.data.typeOfHeatSource === HeatSourceType.boiler);
const heatPumps = heatSources.filter(x => x.data.typeOfHeatSource === HeatSourceType.heatPump);
const heatNetworks = heatSources.filter(x => x.data.typeOfHeatSource === HeatSourceType.heatNetwork);
const heatBatteries = heatSources.filter(x => x.data.typeOfHeatSource === HeatSourceType.heatBattery);
const solarThermalSystem = heatSources.filter(x => x.data.typeOfHeatSource === HeatSourceType.solarThermalSystem);

const heatSourcesSummary: SummarySection = {
	id: "heatSourceSummary",
	label: "Heat sources",
	data: [],
	editUrl: spaceHeatingUrl,
};

const boilerSummary: SummarySection = {
	id: "boilerSummary",
	label: "Boilers",
	data:
		boilers.map(({ data: heatSource }) => {

			const summary = {
				Name: show(heatSource.name),
				"Type of heat source": displayHeatSourceType(heatSource.typeOfHeatSource),
				"Type of boiler": "typeOfBoiler" in heatSource && heatSource.typeOfBoiler? displayCamelToSentenceCase(heatSource.typeOfBoiler): emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				"Location of boiler": "locationOfBoiler" in heatSource && heatSource.locationOfBoiler ? displayCamelToSentenceCase(heatSource.locationOfBoiler): emptyValueRendering, 
			};
			return summary;
		}) || [],
	editUrl: spaceHeatingUrl,
};

const heatPumpSummary: SummarySection = {
	id: "heatPumpSummary",
	label: "Heat pumps",
	data:
		heatPumps.map(({ data: heatSource }) => {

			const summary = {
				Name: show(heatSource.name),
				"Type of heat source": displayHeatSourceType(heatSource.typeOfHeatSource),
				"Type of heat pump": "typeOfHeatPump" in heatSource && heatSource.typeOfHeatPump ? displayCamelToSentenceCase(heatSource.typeOfHeatPump) : emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference: emptyValueRendering,
			};
			return summary;
		}) || [],
	editUrl: spaceHeatingUrl,
};

const heatNetworkSummary: SummarySection = {
	id: "heatNetworkSummary",
	label: "Heat networks",
	data:
		heatNetworks.map((x) => {
			
			const heatSource = x.data as Extract<HeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
			const summary = {
				Name: show(heatSource.name),
				"Type of heat source": displayHeatSourceType(heatSource.typeOfHeatSource),
				"Type of heat network": "typeOfHeatNetwork" in heatSource && heatSource.typeOfHeatNetwork ? displayCamelToSentenceCase(heatSource.typeOfHeatNetwork): emptyValueRendering,
				"Is the heat network in the PCDB": "isHeatNetworkInPcdb" in heatSource ? displayBoolean(heatSource.isHeatNetworkInPcdb) : emptyValueRendering,
				...(heatSource.isHeatNetworkInPcdb === true && {
					"Heat network product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
					"Energy supply": "energySupply" in heatSource ? energySupplyOptions[heatSource.energySupply]: emptyValueRendering,
					"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				}),
				...(heatSource.isHeatNetworkInPcdb === false && {
					"Energy supply": "energySupply" in heatSource && heatSource.energySupply ? energySupplyOptions[heatSource.energySupply as SchemaFuelType]: emptyValueRendering,
					"Emissions factor including out of scope emissions": "emissionsFactor" in heatSource ? heatSource.emissionsFactor : emptyValueRendering,
					"Primary energy factor": "primaryEnergyFactor" in heatSource ? heatSource.primaryEnergyFactor : emptyValueRendering,
					"Can energy from the heat network be exported": "canEnergyBeExported" in heatSource ? heatSource.canEnergyBeExported : emptyValueRendering,
				}),
				...(heatSource.isHeatNetworkInPcdb !== undefined && {
					"Will the heat network use heat interface units": "usesHeatInterfaceUnits" in heatSource ? displayBoolean(heatSource.usesHeatInterfaceUnits) : emptyValueRendering,
				}),
				...(heatSource.usesHeatInterfaceUnits === true && {
					"Heat interface unit product reference": "heatInterfaceUnitProductReference" in heatSource ? heatSource.heatInterfaceUnitProductReference : emptyValueRendering,
				}),
			};
			return summary;
		}) || [],
	editUrl: spaceHeatingUrl,
};

const heatBatterySummary: SummarySection = {
	id: "heatBatterySummary",
	label: "Heat batteries",
	data:
		heatBatteries.map(({ data: heatSource }) => {

			const summary = {
				Name: show(heatSource.name),
				"Type of heat source": displayHeatSourceType(heatSource.typeOfHeatSource),
				"Type of heat battery": "typeOfHeatBattery" in heatSource && heatSource.typeOfHeatBattery? displayCamelToSentenceCase(heatSource.typeOfHeatBattery): emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference: emptyValueRendering,
				"Number of units": "numberOfUnits" in heatSource ? heatSource.numberOfUnits: emptyValueRendering,
				"Energy supply": "energySupply" in heatSource && heatSource.energySupply ? energySupplyOptions[heatSource.energySupply]: emptyValueRendering,
			};
			return summary;
		}) || [],
	editUrl: spaceHeatingUrl,
};

const solarThermalSystemSummary: SummarySection = {
	id: "solarThermalSystemSummary",
	label: "Solar thermal system",
	data:
		solarThermalSystem.map(({ data: heatSource }) => {

			const summary = {
				Name: show(heatSource.name),
				"Type of heat source": displayHeatSourceType(heatSource.typeOfHeatSource),

				"Location of collector loop piping":
				"locationOfCollectorLoopPiping" in heatSource
					&& heatSource.locationOfCollectorLoopPiping ? displayCamelToSentenceCase(heatSource.locationOfCollectorLoopPiping)
					: emptyValueRendering,

				"Collector module area": 
				"collectorModuleArea" in heatSource ? heatSource.collectorModuleArea : emptyValueRendering,

				"Number of collector modules": 
				"numberOfCollectorModules" in heatSource ? heatSource.numberOfCollectorModules : emptyValueRendering,

				"Peak collector efficiency": 
				"peakCollectorEfficiency" in heatSource ? heatSource.peakCollectorEfficiency : emptyValueRendering,

				"Incidence angle modifier": 
				"incidenceAngleModifier" in heatSource ? heatSource.incidenceAngleModifier : emptyValueRendering,

				"First order heat loss coefficient": 
				"firstOrderHeatLossCoefficient" in heatSource ? heatSource.firstOrderHeatLossCoefficient : emptyValueRendering,

				"Second order heat loss coefficient": 
				"secondOrderHeatLossCoefficient" in heatSource ? heatSource.secondOrderHeatLossCoefficient : emptyValueRendering,

				"Heat loss coefficient of solar loop piping": 
				"heatLossCoefficientOfSolarLoopPipe" in heatSource
					? heatSource.heatLossCoefficientOfSolarLoopPipe
					: emptyValueRendering,

				"Collector mass flow rate": 
				"collectorMassFlowRate" in heatSource ? heatSource.collectorMassFlowRate : emptyValueRendering,

				"Power of collector pump": 
				"powerOfCollectorPump" in heatSource ? heatSource.powerOfCollectorPump : emptyValueRendering,

				"Power of collector pump controller": 
				"powerOfCollectorPumpController" in heatSource
					? heatSource.powerOfCollectorPumpController
					: emptyValueRendering,

				"Pitch": 
				"pitch" in heatSource ? dim(heatSource.pitch, "degrees"): emptyValueRendering,

				"Orientation": 
				"orientation" in heatSource ? dim(heatSource.orientation, "degrees"): emptyValueRendering,
			};

			return summary;
		}) || [],
	editUrl: spaceHeatingUrl,
};

function getNonEmptySections(summarySections: SummarySection[]){
	return summarySections.filter(x => Array.isArray(x.data) && x.data.length > 0);
}

const heatSourceSections: SummarySection[] = [
	boilerSummary,
	heatPumpSummary,
	heatNetworkSummary,
	heatBatterySummary,
	solarThermalSystemSummary,
];
const sections = getNonEmptySections(heatSourceSections);

const heatingControlsUrl = "/space-heating-new/heating-controls";
const heatingControls = store.spaceHeatingNew.heatingControls.data;
const heatingControlsSummary: SummarySection = {
	id: "heatingControls",
	label: "Heating controls",
	data: {
		"Type of heating control": heatingControls.length ? displayCamelToSentenceCase(heatingControls[0]?.data.heatingControlType!) : emptyValueRendering,
	},
	editUrl: heatingControlsUrl,
};

</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="sections">
		<template v-if="sections.length === 0">
			<SummaryTab :summary="heatSourcesSummary" :selected="tabProps.currentTab === 0">
				<template #empty>
					<h2 class="govuk-heading-m">No heat sources added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatSourceCreate')"> 
						Add heat source
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
		<template v-for="section, i of sections">
			<SummaryTab :summary="section" :selected="tabProps.currentTab === i">
				<template #empty>
					<h2 class="govuk-heading-m">No heat sources added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatSourceCreate')"> 
						Add heat source
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([heatingControlsSummary])">
		<SummaryTab :summary="heatingControlsSummary" :selected="tabProps.currentTab === 0"/>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>

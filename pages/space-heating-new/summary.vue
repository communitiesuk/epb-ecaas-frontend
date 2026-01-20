<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl, type HeatEmittingData } from "#imports";
import type { SchemaFuelType } from "~/schema/aliases";


const store = useEcaasStore();
const title = "Space heating NEW summary";

const spaceHeatingUrl = "/space-heating-new";

const heatSources = store.spaceHeatingNew.heatSource.data;
const boilers = heatSources.filter(x => x.data.typeOfHeatSource === "boiler");
const heatPumps = heatSources.filter(x => x.data.typeOfHeatSource === "heatPump");
const heatNetworks = heatSources.filter(x => x.data.typeOfHeatSource === "heatNetwork");
const heatBatteries = heatSources.filter(x => x.data.typeOfHeatSource === "heatBattery");
const solarThermalSystem = heatSources.filter(x => x.data.typeOfHeatSource === "solarThermalSystem");

const heatEmitters = store.spaceHeatingNew.heatEmitters.data;

const radiators = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "radiator");
const underfloorHeating = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "underfloorHeating");
const fanCoils = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "fanCoil");
const warmAirHeaters = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "warmAirHeater");
const instantElectricHeaters = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "instantElectricHeater");
const electricStorageHeaters = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "electricStorageHeater");


const heatSourcesSummary: SummarySection = {
	id: "heatSourceSummary",
	label: "Heat sources",
	data: [],
	editUrl: spaceHeatingUrl,
};
const heatEmitterSummary: SummarySection = {
	id: "heatEmitterSummary",
	label: "Heat emitters",
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
				"Type of boiler": "typeOfBoiler" in heatSource && heatSource.typeOfBoiler ? displayCamelToSentenceCase(heatSource.typeOfBoiler) : emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				"Location of boiler": "locationOfBoiler" in heatSource && heatSource.locationOfBoiler ? displayCamelToSentenceCase(heatSource.locationOfBoiler) : emptyValueRendering,
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
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
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
				"Type of heat network": "typeOfHeatNetwork" in heatSource && heatSource.typeOfHeatNetwork ? displayCamelToSentenceCase(heatSource.typeOfHeatNetwork) : emptyValueRendering,
				"Is the heat network in the PCDB": "isHeatNetworkInPcdb" in heatSource ? displayBoolean(heatSource.isHeatNetworkInPcdb) : emptyValueRendering,
				...(heatSource.isHeatNetworkInPcdb === true && {
					"Heat network product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
					"Energy supply": "energySupply" in heatSource ? energySupplyOptions[heatSource.energySupply] : emptyValueRendering,
					"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				}),
				...(heatSource.isHeatNetworkInPcdb === false && {
					"Energy supply": "energySupply" in heatSource && heatSource.energySupply ? energySupplyOptions[heatSource.energySupply as SchemaFuelType] : emptyValueRendering,
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
				"Type of heat battery": "typeOfHeatBattery" in heatSource && heatSource.typeOfHeatBattery ? displayCamelToSentenceCase(heatSource.typeOfHeatBattery) : emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				"Number of units": "numberOfUnits" in heatSource ? heatSource.numberOfUnits : emptyValueRendering,
				"Energy supply": "energySupply" in heatSource && heatSource.energySupply ? energySupplyOptions[heatSource.energySupply] : emptyValueRendering,
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
					"pitch" in heatSource ? dim(heatSource.pitch, "degrees") : emptyValueRendering,

				"Orientation":
					"orientation" in heatSource ? dim(heatSource.orientation, "degrees") : emptyValueRendering,
			};

			return summary;
		}) || [],
	editUrl: spaceHeatingUrl,
};

const radiatorSummary: SummarySection = {
	id: "radiatorSummary",
	label: "Radiators",
	data: radiators.map((x) => {
		const radiator = x.data as Extract<HeatEmittingData, { typeOfHeatEmitter: "radiator" }>;
		const heatGenerationData = store.spaceHeatingNew.heatSource.data;
		const heatSource = heatGenerationData.find(hs => hs.data.id === radiator.heatSource);
		return { 
			Name: show(radiator.name),
			"Type of heat emitter": "typeOfHeatEmitter" in radiator && radiator.typeOfHeatEmitter ? displayCamelToSentenceCase(radiator.typeOfHeatEmitter) : emptyValueRendering,
			"Type of radiator": "typeOfRadiator" in radiator && radiator.typeOfRadiator ? displayCamelToSentenceCase(radiator.typeOfRadiator) : emptyValueRendering,
			"Product reference": "productReference" in radiator ? radiator.productReference : emptyValueRendering,
			"Heat source": heatSource ? heatSource.data.name : emptyValueRendering,
			"Eco design controller class": "ecoDesignControllerClass" in radiator && radiator.ecoDesignControllerClass ? displayCamelToSentenceCase(radiator.ecoDesignControllerClass) : emptyValueRendering,
			"Design flow temperature": "designFlowTemp" in radiator ? dim(radiator.designFlowTemp, "celsius") : emptyValueRendering,
			"Minimum flow temperature": "minFlowTemp" in radiator ? dim(radiator.minFlowTemp, "celsius") : emptyValueRendering,
			"Design temperature difference across emitters": "designTempDiffAcrossEmitters" in radiator ? dim(radiator.designTempDiffAcrossEmitters, "celsius") : emptyValueRendering,
			"Is there a variable flow rate?": "hasVariableFlowRate" in radiator ? displayBoolean(radiator.hasVariableFlowRate) : emptyValueRendering,
			"Maximum flow rate": "maxFlowRate" in radiator ? dim(radiator.maxFlowRate, "litres per second") : emptyValueRendering,
			"Minimum flow rate": "minFlowRate" in radiator ? dim(radiator.minFlowRate, "litres per second") : emptyValueRendering,
			"Design flow rate": "designFlowRate" in radiator ? dim(radiator.designFlowRate, "litres per second") : emptyValueRendering,
			"Number of radiators": "numOfRadiators" in radiator ? radiator.numOfRadiators : emptyValueRendering,
		};
	}),
	editUrl: spaceHeatingUrl,
};

const ufhSummary: SummarySection = {
	id: "underfloorHeatingSummary",
	label: "Underfloor heating",
	data: underfloorHeating.map((x) => {
		const ufh = x.data as Extract<HeatEmittingData, { typeOfHeatEmitter: "underfloorHeating" }>;
		const heatGenerationData = store.spaceHeatingNew.heatSource.data;
		const heatSource = heatGenerationData.find(hs => hs.data.id === ufh.heatSource);
		
		return { 
			Name: show(ufh.name),
			"Type of heat emitter": "typeOfHeatEmitter" in ufh && ufh.typeOfHeatEmitter ? displayCamelToSentenceCase(ufh.typeOfHeatEmitter) : emptyValueRendering,
			"Product reference": "productReference" in ufh ? ufh.productReference : emptyValueRendering,
			"Heat source": heatSource ? heatSource.data.name : emptyValueRendering,
			"Eco design controller class": "ecoDesignControllerClass" in ufh && ufh.ecoDesignControllerClass ? displayCamelToSentenceCase(ufh.ecoDesignControllerClass) : emptyValueRendering,
			"Design flow temperature": "designFlowTemp" in ufh ? dim(ufh.designFlowTemp, "celsius") : emptyValueRendering,
			"Minimum flow temperature": "minFlowTemp" in ufh ? dim(ufh.minFlowTemp, "celsius") : emptyValueRendering,
			"Design temperature difference across emitters": "designTempDiffAcrossEmitters" in ufh ? dim(ufh.designTempDiffAcrossEmitters, "celsius") : emptyValueRendering,
			"Is there a variable flow rate?": "hasVariableFlowRate" in ufh ? displayBoolean(ufh.hasVariableFlowRate) : emptyValueRendering,
			"Maximum flow rate": "maxFlowRate" in ufh ? dim(ufh.maxFlowRate, "litres per second") : emptyValueRendering,
			"Minimum flow rate": "minFlowRate" in ufh ? dim(ufh.minFlowRate, "litres per second") : emptyValueRendering,
			"Design flow rate": "designFlowRate" in ufh ? dim(ufh.designFlowRate, "litres per second") : emptyValueRendering,
			"Area of underfloor heating": ufh.areaOfUnderfloorHeating ? dim(ufh.areaOfUnderfloorHeating, "metres square") : emptyValueRendering,
		};
	}),
	editUrl: "/space-heating-new/heat-emitters",
};
const fanCoilSummary: SummarySection = {
	id: "fanCoilSummary",
	label: "Fan coils",
	data: fanCoils.map((x) => {
		const fanCoil = x.data as Extract<HeatEmittingData, { typeOfHeatEmitter: "fanCoil" }>;
		const heatGenerationData = store.spaceHeatingNew.heatSource.data;
		const heatSource = heatGenerationData.find(hs => hs.data.id === fanCoil.heatSource);
		
		return { 
			Name: show(fanCoil.name),
			"Type of heat emitter": "typeOfHeatEmitter" in fanCoil && fanCoil.typeOfHeatEmitter ? displayCamelToSentenceCase(fanCoil.typeOfHeatEmitter) : emptyValueRendering,
			"Product reference": "productReference" in fanCoil ? fanCoil.productReference : emptyValueRendering,
			"Heat source": heatSource ? heatSource.data.name : emptyValueRendering,
			"Eco design controller class": "ecoDesignControllerClass" in fanCoil && fanCoil.ecoDesignControllerClass ? displayCamelToSentenceCase(fanCoil.ecoDesignControllerClass) : emptyValueRendering,
			"Design flow temperature": "designFlowTemp" in fanCoil ? dim(fanCoil.designFlowTemp, "celsius") : emptyValueRendering,
			"Minimum flow temperature": "minFlowTemp" in fanCoil ? dim(fanCoil.minFlowTemp, "celsius") : emptyValueRendering,
			"Design temperature difference across emitters": "designTempDiffAcrossEmitters" in fanCoil ? dim(fanCoil.designTempDiffAcrossEmitters, "celsius") : emptyValueRendering,
			"Is there a variable flow rate?": "hasVariableFlowRate" in fanCoil ? displayBoolean(fanCoil.hasVariableFlowRate) : emptyValueRendering,
			"Maximum flow rate": "maxFlowRate" in fanCoil ? dim(fanCoil.maxFlowRate, "litres per second") : emptyValueRendering,
			"Minimum flow rate": "minFlowRate" in fanCoil ? dim(fanCoil.minFlowRate, "litres per second") : emptyValueRendering,
			"Design flow rate": "designFlowRate" in fanCoil ? dim(fanCoil.designFlowRate, "litres per second") : emptyValueRendering,
			"Number of fan coils": "numOfFanCoils" in fanCoil ? fanCoil.numOfFanCoils : emptyValueRendering,
		};
	}),
	editUrl: spaceHeatingUrl,
};
const warmAirHeaterSummary: SummarySection = {
	id: "warmAirHeaterSummary",
	label: "Warm air heaters",	
	data: warmAirHeaters.map((x) => {
		const warmAirHeater = x.data as Extract<HeatEmittingData, { typeOfHeatEmitter: "warmAirHeater" }>;
		const heatGenerationData = store.spaceHeatingNew.heatSource.data;
		const heatSource = heatGenerationData.find(hs => hs.data.id === warmAirHeater.heatSource);
		
		return { 
			Name: show(warmAirHeater.name),
			"Type of heat emitter": "typeOfHeatEmitter" in warmAirHeater && warmAirHeater.typeOfHeatEmitter ? displayCamelToSentenceCase(warmAirHeater.typeOfHeatEmitter) : emptyValueRendering,
			"Design temperature difference across emitters": "designTempDiffAcrossEmitters" in warmAirHeater ? dim(warmAirHeater.designTempDiffAcrossEmitters, "celsius") : emptyValueRendering,
			"Convection fraction": "convectionFraction" in warmAirHeater ? warmAirHeater.convectionFraction : emptyValueRendering,
			"Heat source": heatSource ? heatSource.data.name : emptyValueRendering,
			"Number of warm air heaters": "numOfWarmAirHeaters" in warmAirHeater ? warmAirHeater.numOfWarmAirHeaters : emptyValueRendering,
		};
	}),
	editUrl: spaceHeatingUrl,
};
const instantElectricHeaterSummary: SummarySection = {
	id: "instantElectricHeaterSummary",
	label: "Instant electric heaters",
	data: instantElectricHeaters.map((x) => {
		const instantElectricHeater = x.data as Extract<HeatEmittingData, { typeOfHeatEmitter: "instantElectricHeater" }>;
		return { 
			Name: show(instantElectricHeater.name),
			"Type of heat emitter": "typeOfHeatEmitter" in instantElectricHeater && instantElectricHeater.typeOfHeatEmitter ? displayCamelToSentenceCase(instantElectricHeater.typeOfHeatEmitter) : emptyValueRendering,
			"Rated power": "ratedPower" in instantElectricHeater ? dim(instantElectricHeater.ratedPower, "kilowatt") : emptyValueRendering,
			"Convection fraction for heating": "convectionFractionForHeating" in instantElectricHeater ? instantElectricHeater.convectionFractionForHeating : emptyValueRendering,
			"Number of heaters with this spec": "numOfHeatersWithThisSpec" in instantElectricHeater ? instantElectricHeater.numOfHeatersWithThisSpec : emptyValueRendering,
		};
	}),
	editUrl: spaceHeatingUrl,
};
const electricStorageHeaterSummary: SummarySection = {
	id: "electricStorageHeaterSummary",
	label: "Electric storage heaters",
	data: electricStorageHeaters.map((x) => {
		const electricStorageHeater = x.data as Extract<HeatEmittingData, { typeOfHeatEmitter: "electricStorageHeater" }>;
		return { 
			Name: show(electricStorageHeater.name),
			"Type of heat emitter": "typeOfHeatEmitter" in electricStorageHeater && electricStorageHeater.typeOfHeatEmitter ? displayCamelToSentenceCase(electricStorageHeater.typeOfHeatEmitter) : emptyValueRendering,
			"Product reference": "productReference" in electricStorageHeater ? electricStorageHeater.productReference : emptyValueRendering,
			"Number of storage heaters": "numOfStorageHeaters" in electricStorageHeater ? electricStorageHeater.numOfStorageHeaters : emptyValueRendering,
		};
	}),
	editUrl: spaceHeatingUrl,
};

function getNonEmptySections(summarySections: SummarySection[]) {
	return summarySections.filter(x => Array.isArray(x.data) && x.data.length > 0);
}

const heatSourceSections: SummarySection[] = [
	boilerSummary,
	heatPumpSummary,
	heatNetworkSummary,
	heatBatterySummary,
	solarThermalSystemSummary,
];
const populatedHeatSourceSections = getNonEmptySections(heatSourceSections);

const heatEmitterSections: SummarySection[] = [
	radiatorSummary,
	ufhSummary,
	fanCoilSummary,
	warmAirHeaterSummary,
	instantElectricHeaterSummary,
	electricStorageHeaterSummary,
];
const populatedHeatEmitterSections = getNonEmptySections(heatEmitterSections);


const heatingControlsUrl = "/space-heating-new/heating-controls";
const heatingControls = store.spaceHeatingNew.heatingControls.data;

const heatingControlsSummary: SummarySection = {
	id: "heatingControls",
	label: "Heating controls",
	data: {
		"Type of heating control": heatingControls[0]?.data?.heatingControlType ? displayCamelToSentenceCase(heatingControls[0]?.data.heatingControlType) : emptyValueRendering,
	},
	editUrl: heatingControlsUrl,
};

</script>
<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="populatedHeatSourceSections">
		<template v-if="populatedHeatSourceSections.length === 0">
			<SummaryTab :summary="heatSourcesSummary" :selected="tabProps.currentTab === 0">
				<template #empty>
					<h2 class="govuk-heading-m">No heat sources added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatSourceCreate')">
						Add heat source
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
		<template v-for="section, i of populatedHeatSourceSections" :key="i">
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
	<GovTabs v-slot="tabProps" :items="populatedHeatEmitterSections">
		<template v-if="populatedHeatEmitterSections.length === 0">
			<SummaryTab :summary="heatEmitterSummary" :selected="tabProps.currentTab === 0">
				<template #empty>
					<h2 class="govuk-heading-m">No heat emitters added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatEmittersCreate')">
						Add heat emitter
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
		<template v-for="section, i of populatedHeatEmitterSections" :key="i">
			<SummaryTab :summary="section" :selected="tabProps.currentTab === i">
				<template #empty>
					<h2 class="govuk-heading-m">No heat emitters added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatEmittersCreate')">
						Add heat emitter
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([heatingControlsSummary])">
		<SummaryTab :summary="heatingControlsSummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>

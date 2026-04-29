<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl, type HeatEmittingData, type WetDistributionSystemData, type WetDistributionEmitterData } from "#imports";
import { displayBoilerLocation, displayConvectiveType } from "~/utils/display";
import { useProductReferences } from "~/composables/productReferences";
import { getHeatNetworkProductName } from "~/utils/getHeatNetworkProductName";

const store = useEcaasStore();
const title = "Space heating summary";

const spaceHeatingUrl = "/space-heating";

const heatSources = store.spaceHeating.heatSource.data;
const boilers = heatSources.filter(x => x.data.typeOfHeatSource === "boiler");
const heatPumps = heatSources.filter(x => x.data.typeOfHeatSource === "heatPump");
const heatNetworks = heatSources.filter(x => x.data.typeOfHeatSource === "heatNetwork");
const heatInterfaceUnits = heatSources.filter(x => x.data.typeOfHeatSource === "heatInterfaceUnit");
const heatBatteries = heatSources.filter(x => x.data.typeOfHeatSource === "heatBattery");

const heatEmitters = store.spaceHeating.heatEmitters.data;

const wetDistributionSystems = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "wetDistributionSystem");
const warmAirHeaters = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "warmAirHeater");
const instantElectricHeaters = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "instantElectricHeater");
const electricStorageHeaters = heatEmitters.filter(x => x.data.typeOfHeatEmitter === "electricStorageHeater");

const heatSourceModelNames = await useProductReferences(heatSources, productData => productData.modelName);
const heatNetworkProductNamesById: Record<string, string> = {};
await Promise.all(heatNetworks.map(async ({ data }) => {
	const heatNetwork = data as Extract<HeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
	heatNetworkProductNamesById[heatNetwork.id] = await getHeatNetworkProductName(
		heatNetwork.productReference,
		heatNetwork.subHeatNetworkId,
	);
}));

const heatEmitterModelNames = await useProductReferences(heatEmitters, productData => productData.modelName);
const nestedEmitterModelNames = await useProductReferences(
	wetDistributionSystems.flatMap(({ data }) =>
		(data as WetDistributionSystemData).emitters.map(e => ({ data: e })),
	) as EcaasForm<WetDistributionEmitterData>[],
	productData => productData.modelName,
);

function formatEmitterRowsForSummary(emitters: WetDistributionEmitterData[]): Record<string, string | number> {
	const rows: Record<string, string | number> = {};
	emitters.forEach((emitter, i) => {
		const n = i + 1;
		rows[`Name of emitter ${n}`] = show(emitter.name);
		rows[`Type of emitter ${n}`] = emitter.typeOfHeatEmitter ? displayCamelToSentenceCase(emitter.typeOfHeatEmitter as string) : emptyValueRendering;
		rows[`Product reference of emitter ${n}`] = emitter.productReference ? emitter.productReference : emptyValueRendering;
		rows[`Product name of emitter ${n}`] = emitter.productReference ? (nestedEmitterModelNames[emitter.productReference] || emptyValueRendering) : emptyValueRendering;
		if (emitter.typeOfHeatEmitter === "radiator") {
			rows[`Number of radiators ${n}`] = emitter.numOfRadiators != null ? emitter.numOfRadiators : emptyValueRendering;
			rows[`Number of fan coils ${n}`] = emptyValueRendering;
			rows[`Area of underfloor heating ${n}`] = emptyValueRendering;
		} else if (emitter.typeOfHeatEmitter === "fanCoil") {
			rows[`Number of radiators ${n}`] = emptyValueRendering;
			rows[`Number of fan coils ${n}`] = emitter.numOfFanCoils != null ? emitter.numOfFanCoils : emptyValueRendering;
			rows[`Area of underfloor heating ${n}`] = emptyValueRendering;
		} else if (emitter.typeOfHeatEmitter === "underfloorHeating") {
			rows[`Number of radiators ${n}`] = emptyValueRendering;
			rows[`Number of fan coils ${n}`] = emptyValueRendering;
			rows[`Area of underfloor heating ${n}`] = emitter.areaOfUnderfloorHeating != null ? dim(emitter.areaOfUnderfloorHeating , "metres square") : emptyValueRendering;
		} else {
			rows[`Number of radiators ${n}`] = emptyValueRendering;
			rows[`Number of fan coils ${n}`] = emptyValueRendering;
			rows[`Area of underfloor heating ${n}`] = emptyValueRendering;
		}
	});
	return rows;
}

const emptyHeatSourcesSummary: SummarySection = {
	id: "heatSourceSummary",
	label: "Heat sources",
	data: [],
	editUrl: spaceHeatingUrl,
};
const emptyHeatEmitterSummary: SummarySection = {
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
				"Product name": "productReference" in heatSource && heatSource.productReference ? heatSourceModelNames[heatSource.productReference] : emptyValueRendering,
				"Location of boiler": "specifiedLocation" in heatSource && heatSource.specifiedLocation ? displayBoilerLocation(heatSource.specifiedLocation) : emptyValueRendering,
				"Maximum flow temperature": "maxFlowTemp" in heatSource ? dim(heatSource.maxFlowTemp) : emptyValueRendering,
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
			const heatNetWorkFields = "isConnectedToHeatNetwork" in heatSource && heatSource.isConnectedToHeatNetwork === true ? {
				"Associated heat network": store.spaceHeating.heatSource.data.find(hs => hs.data.id === (heatSource as Extract<HeatSourceData, { isConnectedToHeatNetwork: true }>).associatedHeatNetworkId)?.data.name ?? emptyValueRendering,
			} : {
				"Energy supply": "energySupply" in heatSource && (heatSource as Extract<HeatSourceData, { isConnectedToHeatNetwork: false }>).energySupply ? energySupplyOptions[(heatSource as Extract<HeatSourceData, { isConnectedToHeatNetwork: false }>).energySupply] : emptyValueRendering,
			};
			const summary = {
				Name: show(heatSource.name),
				"Type of heat source": displayHeatSourceType(heatSource.typeOfHeatSource),
				"Type of heat pump": "typeOfHeatPump" in heatSource && heatSource.typeOfHeatPump ? displayCamelToSentenceCase(heatSource.typeOfHeatPump) : emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				"Product name": "productReference" in heatSource && heatSource.productReference ? heatSourceModelNames[heatSource.productReference] : emptyValueRendering,
				"Maximum flow temperature": "maxFlowTemp" in heatSource ? dim(heatSource.maxFlowTemp) : emptyValueRendering,
				"Is connected to a heat network": "isConnectedToHeatNetwork" in heatSource ? displayBoolean(heatSource.isConnectedToHeatNetwork) : emptyValueRendering,
				...heatNetWorkFields,
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
			const productReference = "productReference" in heatSource ? heatSource.productReference : undefined;
			const summary = {
				Name: show(heatSource.name),
				"Type of heat source": displayHeatSourceType(heatSource.typeOfHeatSource),
				"Type of heat network": "typeOfHeatNetwork" in heatSource && heatSource.typeOfHeatNetwork ? displayCamelToSentenceCase(heatSource.typeOfHeatNetwork) : emptyValueRendering,
				"Product name": heatNetworkProductNamesById[heatSource.id] ?? emptyValueRendering,
				"Product reference": productReference ?? emptyValueRendering,
				"Sub-heat network ID": "subHeatNetworkId" in heatSource ? (heatSource.subHeatNetworkId ?? emptyValueRendering) : emptyValueRendering,
			};
			return summary;
		}) || [],
	editUrl: spaceHeatingUrl,
};

const heatInterfaceUnitSummary: SummarySection = {
	id: "heatInterfaceUnitSummary",
	label: "Heat interface units",
	data:
		heatInterfaceUnits.map(({ data: heatSource }) => {
			const associatedHeatNetwork = store.spaceHeating.heatSource.data.find(hs => hs.data.id === (heatSource as Extract<HeatSourceData, { typeOfHeatSource: "heatInterfaceUnit" }>).associatedHeatNetworkId);
			const summary = {
				Name: show(heatSource.name),
				"Type of heat source": displayHeatSourceType(heatSource.typeOfHeatSource),
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				"Product name": "productReference" in heatSource && heatSource.productReference ? heatSourceModelNames[heatSource.productReference] : emptyValueRendering,
				"Associated heat network": associatedHeatNetwork ? associatedHeatNetwork.data.name : emptyValueRendering,
				"Maximum flow temperature": "maxFlowTemp" in heatSource ? dim(heatSource.maxFlowTemp) : emptyValueRendering,
				"Building level losses": "buildingLevelLosses" in heatSource ? dim(heatSource.buildingLevelLosses) : emptyValueRendering,
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
				"Product name": "productReference" in heatSource && heatSource.productReference ? heatSourceModelNames[heatSource.productReference] : emptyValueRendering,
				"Maximum flow temperature": "maxFlowTemp" in heatSource ? dim(heatSource.maxFlowTemp) : emptyValueRendering,
				"Number of units": "numberOfUnits" in heatSource ? heatSource.numberOfUnits : emptyValueRendering,
				"Energy supply": "energySupply" in heatSource && heatSource.energySupply ? energySupplyOptions[heatSource.energySupply] : emptyValueRendering,
			};
			return summary;
		}) || [],
	editUrl: spaceHeatingUrl,
};

const wetDistributionSystemSummary: SummarySection = {
	id: "wetDistributionSystemSummary",
	label: "Wet distribution systems",
	data: wetDistributionSystems.map((x) => {
		const wetDist = x.data as WetDistributionSystemData;
		const heatSource = store.spaceHeating.heatSource.data.find(hs => hs.data.id === wetDist.heatSource);
		return {
			Name: show(wetDist.name),
			"Type of heat emitter": displayHeatEmitterType(wetDist.typeOfHeatEmitter),
			"Heat source": heatSource ? heatSource.data.name : emptyValueRendering,
			"Eco design controller class": "ecoDesignControllerClass" in wetDist && wetDist.ecoDesignControllerClass ? displayCamelToSentenceCase(wetDist.ecoDesignControllerClass) : emptyValueRendering,
			...("minOutdoorTemp" in wetDist ? { "Minimum outdoor temperature": dim(wetDist.minOutdoorTemp, "celsius") } : {}),
			...("maxOutdoorTemp" in wetDist ? { "Maximum outdoor temperature": dim(wetDist.maxOutdoorTemp, "celsius") } : {}),
			...("minFlowTemp" in wetDist ? { "Minimum flow temperature": dim(wetDist.minFlowTemp, "celsius") } : {}),
			"Design flow temperature": "designFlowTemp" in wetDist ? dim(wetDist.designFlowTemp, "celsius") : emptyValueRendering,
			"Design temperature difference across emitters": "designTempDiffAcrossEmitters" in wetDist ? dim(wetDist.designTempDiffAcrossEmitters, "celsius") : emptyValueRendering,
			"Is there a variable flow rate?": "hasVariableFlowRate" in wetDist ? displayBoolean(wetDist.hasVariableFlowRate) : emptyValueRendering,
			...("maxFlowRate" in wetDist ? { "Maximum flow rate": dim(wetDist.maxFlowRate, "litres per minute") } : {}),
			...("minFlowRate" in wetDist ? { "Minimum flow rate": dim(wetDist.minFlowRate, "litres per minute") } : {}),
			...("designFlowRate" in wetDist ? { "Design flow rate": dim(wetDist.designFlowRate, "litres per minute") } : {}),
			"Percentage recirculated": "percentageRecirculated" in wetDist && wetDist.percentageRecirculated != null ? `${wetDist.percentageRecirculated} %` : emptyValueRendering,
			...formatEmitterRowsForSummary(wetDist.emitters as WetDistributionEmitterData[]),
		};
	}),
	editUrl: spaceHeatingUrl,
};
const warmAirHeaterSummary: SummarySection = {
	id: "warmAirHeaterSummary",
	label: "Warm air heaters",	
	data: warmAirHeaters.map((x) => {
		const warmAirHeater = x.data as Extract<HeatEmittingData, { typeOfHeatEmitter: "warmAirHeater" }>;
		const heatGenerationData = store.spaceHeating.heatSource.data;
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
			"Type of convection": "convectiveType" in instantElectricHeater ? displayConvectiveType(instantElectricHeater.convectiveType) : emptyValueRendering,
			"Number of heaters": "numOfHeaters" in instantElectricHeater ? instantElectricHeater.numOfHeaters : emptyValueRendering,
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
			"Product name": "productReference" in electricStorageHeater && electricStorageHeater.productReference ? heatEmitterModelNames[electricStorageHeater.productReference] : emptyValueRendering,
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
	heatInterfaceUnitSummary,
	heatBatterySummary,
];
const populatedHeatSourceSections = getNonEmptySections(heatSourceSections);

const heatEmitterSections: SummarySection[] = [
	wetDistributionSystemSummary,
	warmAirHeaterSummary,
	instantElectricHeaterSummary,
	electricStorageHeaterSummary,
];
const populatedHeatEmitterSections = getNonEmptySections(heatEmitterSections);


const heatingControlsUrl = "/space-heating/heating-controls";
const heatingControls = store.spaceHeating.heatingControls.data;

const getHeatEmitterLabel = (heatEmitter: EcaasForm<HeatEmittingData>) => {
	const name = heatEmitter.data.name?.trim();
	if (name) {
		return name;
	}

	return displayHeatEmitterType(heatEmitter.data.typeOfHeatEmitter) || "Heat emitter";
};

const heatingSystemRankLabels = [
	"Primary heating system",
	"Secondary heating system",
	"3rd heating system",
	"4th heating system",
	"5th heating system",
	"6th heating system",
	"7th heating system",
	"8th heating system",
	"9th heating system",
] as const;

const getHeatingSystemLabel = (rank: number) => heatingSystemRankLabels[rank - 1] ?? `${rank}th heating system`;

const getHeatingSystemSummaryRows = () => {
	const rankedHeatEmitters = [...heatEmitters]
		.filter((heatEmitter) => heatEmitter.data.heatingRank != null)
		.sort((a, b) => (a.data.heatingRank ?? 0) - (b.data.heatingRank ?? 0));

	return rankedHeatEmitters.reduce<Record<string, string>>((rows, heatEmitter) => {
		const rank = heatEmitter.data.heatingRank;
		if (!rank) {
			return rows;
		}

		rows[getHeatingSystemLabel(rank)] = getHeatEmitterLabel(heatEmitter as EcaasForm<HeatEmittingData>);
		return rows;
	}, {});
};

const heatingControlsSummary: SummarySection = {
	id: "heatingControls",
	label: "Heating controls",
	data: {
		"Type of heating control": heatingControls[0]?.data?.heatingControlType ? displayCamelToSentenceCase(heatingControls[0]?.data.heatingControlType) : emptyValueRendering,
		...getHeatingSystemSummaryRows(),
	},
	editUrl: heatingControlsUrl,
};

</script>
<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="populatedHeatSourceSections.length === 0? [emptyHeatSourcesSummary] : populatedHeatSourceSections">
		<template v-if="populatedHeatSourceSections.length === 0">
			<SummaryTab :summary="emptyHeatSourcesSummary" :selected="tabProps.currentTab === 0">
				<template #empty>
					<h2 class="govuk-heading-m">No heat sources added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatSourceCreate')">
						Add heat source
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
		<template v-for="section, i of populatedHeatSourceSections" :key="i">
			<SummaryTab :summary="section" :selected="tabProps.currentTab === i" />
		</template>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="populatedHeatEmitterSections.length === 0 ? [emptyHeatEmitterSummary] : populatedHeatEmitterSections">
		<template v-if="populatedHeatEmitterSections.length === 0">
			<SummaryTab :summary="emptyHeatEmitterSummary" :selected="tabProps.currentTab === 0">
				<template #empty>
					<h2 class="govuk-heading-m">No heat emitters added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatEmittersCreate')">
						Add heat emitter
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
		<template v-for="section, i of populatedHeatEmitterSections" :key="i">
			<SummaryTab :summary="section" :selected="tabProps.currentTab === i" />
		</template>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([heatingControlsSummary])">
		<SummaryTab :summary="heatingControlsSummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>

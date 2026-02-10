<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
import type { SchemaFuelType } from "~/schema/aliases";
import type { DomesticHotWaterHeatSourceData } from "~/stores/ecaasStore.schema";
import { displayDHWHeatSourceType } from "~/utils/display";

const title = "Domestic hot water summary";
const store = useEcaasStore();

const domesticHotWaterUrl = "/domestic-hot-water-new";

const heatSources = store.domesticHotWater.heatSources.data;
const boilers = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "boiler");
const heatPumps = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "heatPump");
const heatNetworks = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "heatNetwork");
const heatBatteries = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "heatBattery");
const solarThermalSystem = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "solarThermalSystem");
const immersionHeaters = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "immersionHeater");
const pointOfUse = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "pointOfUse");

const emptyHeatSourcesSummary: SummarySection = {
	id: "emptyHeatSourcesSummary",
	label: "Heat sources",
	data: [],
	editUrl: domesticHotWaterUrl,
};

const boilerSummary: SummarySection = {
	id: "boilerSummary",
	label: "Boilers",
	data:
		boilers.map((x) => {
			const heatSource = x.data as Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "boiler" }>;

			const summary = {
				Name: "name" in heatSource ? show(heatSource.name) : emptyValueRendering,
				"Cold water source": "coldWaterSource" in heatSource ? displayCamelToSentenceCase(heatSource.coldWaterSource) : emptyValueRendering,
				"Type of heat source": "typeOfHeatSource" in heatSource ? displayDHWHeatSourceType(heatSource.typeOfHeatSource) : emptyValueRendering,
				"Type of boiler": "typeOfBoiler" in heatSource && heatSource.typeOfBoiler ? displayCamelToSentenceCase(heatSource.typeOfBoiler) : emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				"Location of boiler": "locationOfBoiler" in heatSource && heatSource.locationOfBoiler ? displayCamelToSentenceCase(heatSource.locationOfBoiler) : emptyValueRendering,
			};
			return summary;
		}) || [],
	editUrl: domesticHotWaterUrl,
};

const heatPumpSummary: SummarySection = {
	id: "heatPumpSummary",
	label: "Heat pumps",
	data:
		heatPumps.map((x) => {
			const heatSource = x.data as Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatPump" }>;

			const summary = {
				Name: "name" in heatSource ? show(heatSource.name) : emptyValueRendering,
				"Cold water source": "coldWaterSource" in heatSource ? displayCamelToSentenceCase(heatSource.coldWaterSource) : emptyValueRendering,
				"Type of heat source": "typeOfHeatSource" in heatSource ? displayDHWHeatSourceType(heatSource.typeOfHeatSource) : emptyValueRendering,
				"Type of heat pump": "typeOfHeatPump" in heatSource && heatSource.typeOfHeatPump ? displayCamelToSentenceCase(heatSource.typeOfHeatPump) : emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
			};
			return summary;
		}) || [],
	editUrl: domesticHotWaterUrl,
};

const heatNetworkSummary: SummarySection = {
	id: "heatNetworkSummary",
	label: "Heat networks",
	data:
		heatNetworks.map((x) => {

			const heatSource = x.data as Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
			const summary = {
				Name: "name" in heatSource ? show(heatSource.name) : emptyValueRendering,
				"Cold water source": "coldWaterSource" in heatSource ? displayCamelToSentenceCase(heatSource.coldWaterSource) : emptyValueRendering,
				"Type of heat source": displayDHWHeatSourceType(heatSource.typeOfHeatSource) ?? emptyValueRendering,
				"Type of heat network": heatSource.typeOfHeatNetwork ? displayCamelToSentenceCase(heatSource.typeOfHeatNetwork) : emptyValueRendering,
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
	editUrl: domesticHotWaterUrl,
};

const heatBatterySummary: SummarySection = {
	id: "heatBatterySummary",
	label: "Heat batteries",
	data:
		heatBatteries.map((x) => {
			const heatSource = x.data as Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatBattery" }>;

			const summary = {
				Name: show(heatSource.name) ?? emptyValueRendering,
				"Cold water source": "coldWaterSource" in heatSource ? displayCamelToSentenceCase(heatSource.coldWaterSource) : emptyValueRendering,
				"Type of heat source": displayDHWHeatSourceType(heatSource.typeOfHeatSource) ?? emptyValueRendering,
				"Type of heat battery": "typeOfHeatBattery" in heatSource && heatSource.typeOfHeatBattery ? displayCamelToSentenceCase(heatSource.typeOfHeatBattery) : emptyValueRendering,
				"Product reference": "productReference" in heatSource ? heatSource.productReference : emptyValueRendering,
				"Number of units": "numberOfUnits" in heatSource ? heatSource.numberOfUnits : emptyValueRendering,
				"Energy supply": "energySupply" in heatSource && heatSource.energySupply ? energySupplyOptions[heatSource.energySupply] : emptyValueRendering,
			};
			return summary;
		}) || [],
	editUrl: domesticHotWaterUrl,
};

const solarThermalSystemSummary: SummarySection = {
	id: "solarThermalSystemSummary",
	label: "Solar thermal systems",
	data:
		solarThermalSystem.map(({ data: heatSource }) => {

			const summary = {
				Name: "name" in heatSource ? show(heatSource.name) : emptyValueRendering,
				"Cold water source": "coldWaterSource" in heatSource ? displayCamelToSentenceCase(heatSource.coldWaterSource) : emptyValueRendering,
				"Type of heat source": "typeOfHeatSource" in heatSource ? displayDHWHeatSourceType(heatSource.typeOfHeatSource) : emptyValueRendering,
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
	editUrl: domesticHotWaterUrl,
};


const immersionHeaterSummary: SummarySection = {
	id: "immersionHeaterSummary",
	label: "Immersion heaters",
	data:
		immersionHeaters.map((x) => {
			const heatSource = x.data as Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "immersionHeater" }>;

			const summary = {
				Name: "name" in heatSource ? show(heatSource.name) : emptyValueRendering,
				"Cold water source": "coldWaterSource" in heatSource ? displayCamelToSentenceCase(heatSource.coldWaterSource) : emptyValueRendering,
				"Type of heat source": "typeOfHeatSource" in heatSource ? displayDHWHeatSourceType(heatSource.typeOfHeatSource) : emptyValueRendering,
				"Power": "power" in heatSource && dim(heatSource.power, "kilowatt"),
			};
			return summary;
		}) || [],
	editUrl: domesticHotWaterUrl,
};


const pointOfUseSummary: SummarySection = {
	id: "pointOfUseSummary",
	label: "Point of use",
	data:
		pointOfUse.map((x) => {
			const heatSource = x.data as Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "pointOfUse" }>;

			const summary = {
				Name: "name" in heatSource ? show(heatSource.name) : emptyValueRendering,
				"Cold water source": "coldWaterSource" in heatSource ? displayCamelToSentenceCase(heatSource.coldWaterSource) : emptyValueRendering,
				"Type of heat source": "typeOfHeatSource" in heatSource ? displayDHWHeatSourceType(heatSource.typeOfHeatSource) : emptyValueRendering,
				"Energy supply": "energySupply" in heatSource ? energySupplyOptions[heatSource.energySupply] : emptyValueRendering,
				"Heater efficiency": "heaterEfficiency" in heatSource ? heatSource.heaterEfficiency : emptyValueRendering,

			};
			return summary;
		}) || [],
	editUrl: domesticHotWaterUrl,
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
	immersionHeaterSummary,
	pointOfUseSummary,
];

const waterStorage = store.domesticHotWater.waterStorage.data;
const hotWaterCylinders = waterStorage.filter(x => x.data.typeOfWaterStorage === "hotWaterCylinder");

const emptyWaterStorageSummary: SummarySection = {
	id: "waterStorageSummary",
	label: "Water storage",
	data: [],
	editUrl: getUrl("waterStorageCreate"),
};

function getHWHeatSourceName(hwHeatSourceId: string | undefined) {
	if (!hwHeatSourceId) {
		return emptyValueRendering;
	}

	const hwHeatSourceData = store.domesticHotWater.heatSources.data
		.find(x => x.data.id === hwHeatSourceId)?.data;

	if (!hwHeatSourceData) {
		return "Invalid heat source";
	}

	if (hwHeatSourceData.isExistingHeatSource) {
		return store.spaceHeating.heatSource.data
			.find((x) => x.data.id === hwHeatSourceData.heatSourceId)?.data.name
					?? "Invalid space heating heat source";
	} else {
		return hwHeatSourceData.name ?? "Invalid hot water heat source name";
	}
}
	
const hotWaterCylinderSummary: SummarySection = {
	id: "hotWaterCylinder",
	label: "Hot water cylinders",
	data: hotWaterCylinders.map(({ data: hwCylData }) => {
		return {
			"Name": show(hwCylData.name),
			"Storage cylinder volume": "storageCylinderVolume" in hwCylData ? dim(hwCylData.storageCylinderVolume, "litres") : emptyValueRendering,
			"Initial temperature": "initialTemperature" in hwCylData ? dim(hwCylData.initialTemperature, "celsius") : emptyValueRendering,
			"Daily energy loss": "dailyEnergyLoss" in hwCylData ? dim(hwCylData.dailyEnergyLoss, "kilowatt-hour") : emptyValueRendering,
			"Heat source": show(getHWHeatSourceName(hwCylData.dhwHeatSourceId)),
			"Area of heat exchanger installed": "areaOfHeatExchanger" in hwCylData ? dim(hwCylData.areaOfHeatExchanger, "metres square") : emptyValueRendering,
			"Heater position in the cylinder": "heaterPosition" in hwCylData ? show(hwCylData.heaterPosition) : emptyValueRendering,
			"Thermostat position in the cylinder": "thermostatPosition" in hwCylData ? show(hwCylData.thermostatPosition) : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWater"),
};

const smartHotWaterCylinders = waterStorage.filter(x => x.data.typeOfWaterStorage === "smartHotWaterTank");

const smartHotWaterCylinderSummary: SummarySection = {
	id: "smartHotWaterCylinder",
	label: "Smart hot water cylinders",
	data: smartHotWaterCylinders.map(({ data: smartHWCylData }) => {

		return {
			"Name": show(smartHWCylData.name),
			"Product reference": "productReference" in smartHWCylData ? show(smartHWCylData.productReference) : emptyValueRendering,
			"Heat source": show(getHWHeatSourceName(smartHWCylData.dhwHeatSourceId)),
			"Heater position in the cylinder": "heaterPosition" in smartHWCylData ? show(smartHWCylData.heaterPosition) : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWater"),
};

const waterStorageSummarySections: SummarySection[] = [
	hotWaterCylinderSummary,
	smartHotWaterCylinderSummary,
];
const populatedHeatSourceSections = getNonEmptySections(heatSourceSections);


const hotWaterOutletsAll = store.domesticHotWater.hotWaterOutlets.data;

const mixedShowerData = hotWaterOutletsAll.filter(x => x.data?.typeOfHotWaterOutlet === "mixedShower") as EcaasForm<MixedShowerDataNew>[];
const mixedShowerSummary: SummarySection = {
	id: "mixedShower",
	label: "Mixer showers",
	data: mixedShowerData.map(({ data }) => {
		
		const heatSourceName = getHWHeatSourceName("dhwHeatSourceId" in data ? data.dhwHeatSourceId : undefined);
		return {
			"Name": show(data.name),
			"Type of hot water outlet": "typeOfHotWaterOutlet" in data && data.typeOfHotWaterOutlet ? displayCamelToSentenceCase(data.typeOfHotWaterOutlet) : emptyValueRendering,
			"Hot water source": heatSourceName ? heatSourceName : emptyValueRendering,
			"Flow rate": "flowRate" in data ? dim(data.flowRate, "litres per second") : emptyValueRendering,
			"WWHRS installed": "wwhrs" in data ? displayBoolean(data.wwhrs) : emptyValueRendering,
			"WWHRS type": "wwhrsType" in data && data.wwhrsType ? displayCamelToSentenceCase(String(data.wwhrsType)) : emptyValueRendering,
			"WWHRS product": "wwhrsProductReference" in data ? show(data.wwhrsProductReference) : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWater"),
};

const electricShowerData = hotWaterOutletsAll.filter(x => x.data?.typeOfHotWaterOutlet === "electricShower") as EcaasForm<ElectricShowerDataNew>[];
const electricShowerSummary: SummarySection = {
	id: "electricShower",
	label: "Electric showers",
	data: electricShowerData.map(({ data }) => {
		return {
			"Name": show(data.name),
			"Type of hot water outlet": "typeOfHotWaterOutlet" in data && data.typeOfHotWaterOutlet ? displayCamelToSentenceCase(data.typeOfHotWaterOutlet) : emptyValueRendering,
			"Rated power": "ratedPower" in data ? dim(data.ratedPower, "kilowatt") : emptyValueRendering,
			"WWHRS installed": "wwhrs" in data ? displayBoolean(data.wwhrs) : emptyValueRendering,
			"WWHRS type": "wwhrsType" in data && data.wwhrsType ? displayCamelToSentenceCase(String(data.wwhrsType)) : emptyValueRendering,
			"WWHRS product": "wwhrsProductReference" in data ? show(data.wwhrsProductReference) : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWater"),
};

const bathData = hotWaterOutletsAll.filter(x => x.data?.typeOfHotWaterOutlet === "bath") as EcaasForm<BathDataNew>[];
const bathSummary: SummarySection = {
	id: "bath",
	label: "Baths",
	data: bathData.map(d => {
		return {
			"Name": show(d.data.name),
			"Type of hot water outlet": "typeOfHotWaterOutlet" in d.data && d.data.typeOfHotWaterOutlet ? displayCamelToSentenceCase(d.data.typeOfHotWaterOutlet) : emptyValueRendering,
			"Size": "size" in d.data ? dim(d.data.size, "litres") : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWater"),
};

const otherOutletsData = hotWaterOutletsAll.filter(x => x.data?.typeOfHotWaterOutlet === "otherHotWaterOutlet") as EcaasForm<OtherHotWaterOutletDataNew>[];
const otherOutletsSummary: SummarySection = {
	id: "otherOutlets",
	label: "Other",
	data: otherOutletsData.map(d => {
		return {
			"Name": show(d.data.name),
			"Type of hot water outlet": "typeOfHotWaterOutlet" in d.data && d.data.typeOfHotWaterOutlet ? displayCamelToSentenceCase(d.data.typeOfHotWaterOutlet) : emptyValueRendering,
			"Flow rate": "flowRate" in d.data ? dim(d.data.flowRate, "litres per second") : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWater"),
};

const hotWaterOutletsSummarySections: SummarySection[] = [
	mixedShowerSummary,
	electricShowerSummary,
	bathSummary,
	otherOutletsSummary,
];



const pipeworkData = store.domesticHotWater.pipework.data;
const pipeworkSummary: SummarySection = {
	id: "pipework",
	label: "Pipework",
	data: pipeworkData.map(d => {
		return {
			"Name": show(d.data.name),
			"Location": displayCamelToSentenceCase(show(d.data.location)),
			"Pipe contents": displayCamelToSentenceCase(show(d.data.pipeContents)),
			"Internal diameter": dim(d.data.internalDiameter, "millimetres"),
			"External diameter": dim(d.data.externalDiameter, "millimetres"),
			"Length": dim(d.data.length, "metres"),
			"Insulation thickness": dim(d.data.insulationThickness, "millimetres"),
			"Thermal conductivity": dim(d.data.thermalConductivity, "watts per metre kelvin") ,
			"Surface reflectivity": displayReflectivity(d.data.surfaceReflectivity),
		};
	}) || [],
	editUrl: getUrl("domesticHotWater"),
};

const pipeworkSummarySections: SummarySection[] = [
	pipeworkSummary,
];

const populatedWaterStorageSections = getNonEmptySections(waterStorageSummarySections);

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="populatedHeatSourceSections.length === 0 ? [emptyHeatSourcesSummary] : getTabItems(populatedHeatSourceSections)">
		<template v-if="populatedHeatSourceSections.length === 0">
			<SummaryTab :summary="emptyHeatSourcesSummary" :selected="tabProps.currentTab === 0">
				<template #empty>
					<h2 class="govuk-heading-m">No heat sources added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatSourcesCreate')">
						Add heat source
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
		<template v-for="section, i of populatedHeatSourceSections" :key="i">
			<SummaryTab :summary="section" :selected="tabProps.currentTab === i"/>
		</template>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="populatedWaterStorageSections.length === 0 ? [emptyWaterStorageSummary] : getTabItems(populatedWaterStorageSections)">
		<template v-if="populatedWaterStorageSections.length === 0">
			<SummaryTab :summary="emptyWaterStorageSummary" :selected="tabProps.currentTab === 0">
				<template #empty>
					<h2 class="govuk-heading-m">No water storage added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('waterStorage')">
						Add water storage
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
		<template v-for="section, i of populatedWaterStorageSections" :key="i">
			<SummaryTab :summary="section" :selected="tabProps.currentTab === i"/>
		</template>
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems(hotWaterOutletsSummarySections)">
		<SummaryTab :summary="mixedShowerSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No mixer shower added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('hotWaterOutletsCreate')">
					Add mixer shower
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="electricShowerSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No electric shower added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('hotWaterOutletsCreate')">
					Add electric shower
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="bathSummary" :selected="tabProps.currentTab === 2">
			<template #empty>
				<h2 class="govuk-heading-m">No bath added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('hotWaterOutletsCreate')">
					Add bath
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="otherOutletsSummary" :selected="tabProps.currentTab === 3">
			<template #empty>
				<h2 class="govuk-heading-m">No outlet added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('hotWaterOutletsCreate')">
					Add outlet
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems(pipeworkSummarySections)">
		<SummaryTab :summary="pipeworkSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No pipework added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pipeworkCreate')">
					Add pipework
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>

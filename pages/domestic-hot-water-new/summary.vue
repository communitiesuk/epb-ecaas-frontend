<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
import type { SchemaFuelType } from "~/schema/aliases";
import type { DomesticHotWaterHeatSourceData } from "~/stores/ecaasStore.schema";
import { displayDHWHeatSourceType } from "~/utils/display";

const title = "Domestic hot water summary";
const store = useEcaasStore();

const domesticHotWaterUrl = "/domestic-hot-water-new";

const heatSources = store.domesticHotWaterNew.heatSources.data;
const boilers = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "boiler");
const heatPumps = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "heatPump");
const heatNetworks = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "heatNetwork");
const heatBatteries = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "heatBattery");
const solarThermalSystem = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "solarThermalSystem");
const immersionHeaters = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "immersionHeater");
const pointOfUse = heatSources.filter(({ data: x }) => x.isExistingHeatSource === false && x.typeOfHeatSource === "pointOfUse");

const heatSourcesSummary: SummarySection = {
	id: "heatSourceSummary",
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

const waterStorage = store.domesticHotWaterNew.waterStorage.data;
const hotWaterCylinders = waterStorage.filter(x => x.data.typeOfWaterStorage === "hotWaterCylinder");

const emptyWaterStorageSummary: SummarySection = {
	id: "waterStorageSummary",
	label: "Water storage",
	data: [],
	editUrl: getUrl("waterStorageCreate"),
};
	
const hotWaterCylinderSummary: SummarySection = {
	id: "hotWaterCylinder",
	label: "Hot water cylinders",
	data: hotWaterCylinders.map(({ data }) => {
		return {
			"Name": show(data.name),
			"Storage cylinder volume": "storageCylinderVolume" in data ? dim(data.storageCylinderVolume, "litres") : emptyValueRendering,
			"Initial temperature": "initialTemperature" in data ? dim(data.initialTemperature, "celsius") : emptyValueRendering,
			"Daily energy loss": "dailyEnergyLoss" in data ? dim(data.dailyEnergyLoss, "kilowatt-hour") : emptyValueRendering,
			"Heat source": show(heatSources.find(x => x.data.id === data.heatSource)?.data.name),
			"Area of heat exchanger installed": "areaOfHeatExchanger" in data ? dim(data.areaOfHeatExchanger, "metres square") : emptyValueRendering,
			"Heater position in the cylinder": "heaterPosition" in data ? show(data.heaterPosition) : emptyValueRendering,
			"Thermostat position in the cylinder": "thermostatPosition" in data ? show(data.thermostatPosition) : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWaterNew"),
};

const smartHotWaterCylinders = waterStorage.filter(x => x.data.typeOfWaterStorage === "smartHotWaterTank");

const smartHotWaterCylinderSummary: SummarySection = {
	id: "smartHotWaterCylinder",
	label: "Smart hot water cylinders",
	data: smartHotWaterCylinders.map(({ data }) => {
		return {
			"Name": show(data.name),
			"Product reference": "productReference" in data ? show(data.productReference) : emptyValueRendering,
			"Heat source": show(heatSources.find(x => x.data.id === data.heatSource)?.data.name),
			"Heater position in the cylinder": "heaterPosition" in data ? show(data.heaterPosition) : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWaterNew"),
};

const waterStorageSummarySections: SummarySection[] = [
	hotWaterCylinderSummary,
	smartHotWaterCylinderSummary,
];
const populatedHeatSourceSections = getNonEmptySections(heatSourceSections);


const hotWaterOutletsAll = store.domesticHotWaterNew.hotWaterOutlets.data;
const hotWaterSources = store.domesticHotWaterNew.heatSources.data;

const mixedShowerData = hotWaterOutletsAll.filter(x => x.data?.typeOfHotWaterOutlet === "mixedShower") as EcaasForm<MixedShowerDataNew>[];
const mixedShowerSummary: SummarySection = {
	id: "mixedShower",
	label: "Mixer showers",
	data: mixedShowerData.map((d) => {
		const heatSourceName = hotWaterSources.find(h => h.data.id === d.data.hotWaterSource)?.data.name;
		return {
			"Name": show(d.data.name),
			"Type of hot water outlet": "typeOfHotWaterOutlet" in d.data && d.data.typeOfHotWaterOutlet ? displayCamelToSentenceCase(d.data.typeOfHotWaterOutlet) : emptyValueRendering,
			"Hot water source": heatSourceName ? heatSourceName : emptyValueRendering,
			"Flow rate": "flowRate" in d.data ? dim(d.data.flowRate, "litres per second") : emptyValueRendering,
			"WWHRS installed": "wwhrs" in d.data ? displayBoolean(d.data.wwhrs) : emptyValueRendering,
			"WWHRS type": "wwhrsType" in d.data && d.data.wwhrsType ? displayCamelToSentenceCase(String(d.data.wwhrsType)) : emptyValueRendering,
			"WWHRS product": "wwhrsProductReference" in d.data ? show(d.data.wwhrsProductReference) : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWaterNew"),
};

const electricShowerData = hotWaterOutletsAll.filter(x => x.data?.typeOfHotWaterOutlet === "electricShower") as EcaasForm<ElectricShowerDataNew>[];
const electricShowerSummary: SummarySection = {
	id: "electricShower",
	label: "Electric showers",
	data: electricShowerData.map(d => {
		return {
			"Name": show(d.data.name),
			"Type of hot water outlet": "typeOfHotWaterOutlet" in d.data && d.data.typeOfHotWaterOutlet ? displayCamelToSentenceCase(d.data.typeOfHotWaterOutlet) : emptyValueRendering,
			"Rated power": "ratedPower" in d.data ? dim(d.data.ratedPower, "kilowatt") : emptyValueRendering,
			"WWHRS installed": "wwhrs" in d.data ? displayBoolean(d.data.wwhrs) : emptyValueRendering,
			"WWHRS type": "wwhrsType" in d.data && d.data.wwhrsType ? displayCamelToSentenceCase(String(d.data.wwhrsType)) : emptyValueRendering,
			"WWHRS product": "wwhrsProductReference" in d.data ? show(d.data.wwhrsProductReference) : emptyValueRendering,
		};
	}),
	editUrl: getUrl("domesticHotWaterNew"),
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
	editUrl: getUrl("domesticHotWaterNew"),
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
	editUrl: getUrl("domesticHotWaterNew"),
};

const hotWaterOutletsSummarySections: SummarySection[] = [
	mixedShowerSummary,
	electricShowerSummary,
	bathSummary,
	otherOutletsSummary,
];



const pipeworkData = store.domesticHotWaterNew.pipework.data;
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
	editUrl: getUrl("domesticHotWaterNew"),
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
	<GovTabs v-slot="tabProps" :items="populatedHeatSourceSections">
		<template v-if="populatedHeatSourceSections.length === 0">
			<SummaryTab :summary="heatSourcesSummary" :selected="tabProps.currentTab === 0">
				<template #empty>
					<h2 class="govuk-heading-m">No heat sources added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatSourcesCreate')">
						Add heat source
					</NuxtLink>
				</template>
			</SummaryTab>
		</template>
		<template v-for="section, i of populatedHeatSourceSections" :key="i">
			<SummaryTab :summary="section" :selected="tabProps.currentTab === i">
				<template #empty>
					<h2 class="govuk-heading-m">No heat sources added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('heatSourcesCreate')">
						Add heat source
					</NuxtLink>
				</template>
			</SummaryTab>
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
				<NuxtLink class="govuk-link" :to="getUrl('hotWaterOutletsNewCreate')">
					Add mixer shower
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="electricShowerSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No electric shower added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('hotWaterOutletsNewCreate')">
					Add electric shower
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="bathSummary" :selected="tabProps.currentTab === 2">
			<template #empty>
				<h2 class="govuk-heading-m">No bath added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('hotWaterOutletsNewCreate')">
					Add bath
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="otherOutletsSummary" :selected="tabProps.currentTab === 3">
			<template #empty>
				<h2 class="govuk-heading-m">No outlet added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('hotWaterOutletsNewCreate')">
					Add outlet
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems(pipeworkSummarySections)">
		<SummaryTab :summary="pipeworkSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No pipework added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pipeworkNewCreate')">
					Add pipework
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>

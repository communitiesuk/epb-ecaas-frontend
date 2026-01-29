<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl, type MixedShowerDataNew } from "#imports";

const title = "Domestic hot water";
const store = useEcaasStore();

const heatPumps = store.spaceHeating.heatSource.data.filter(x => x.data?.typeOfHeatSource === "heatPump");
const heatGenerationData = [
	heatPumps,
	// boiler.data,
	// heatBattery.data,
	// heatNetwork.data,
	// heatInterfaceUnit.data
].flat().filter(x => !!x.data).map(x => ({ id: x.data.id, name: x.data.name }));

const hotWaterCylinderData = store.domesticHotWater.waterHeating.hotWaterCylinder.data;
const hotWaterCylinderSummary: SummarySection = {
	id: "hotWaterCylinder",
	label: "Hot water cylinders",
	data: hotWaterCylinderData.map(d => {
		return {
			"Name": show(d.data.name),
			"Heat source": show(heatGenerationData.find(x => x.id === d.data.heatSource)?.name),
			"Storage cylinder volume": dim(d.data.storageCylinderVolume, "litres"),
			"Daily energy loss": dim(d.data.dailyEnergyLoss, "kilowatt-hour"),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

// const immersionHeaterData = store.domesticHotWater.waterHeating.immersionHeater.data;
// const immersionHeaterSummary: SummarySection = {
// 	id: "immersionHeater",
// 	label: "Immersion heaters",
// 	data: immersionHeaterData.map(d => {
// 		return {
// 			"Name": show(d.data.name),
// 			"Rated power": dim(d.data.ratedPower, "kilowatt"),
// 			"Heater position": displayHeaterPosition(d.data.heaterPosition),
// 			"Thermostat position": displayHeaterPosition(d.data.thermostatPosition),
// 		};
// 	}),
// 	editUrl: getUrl("waterHeating"),
// };

// const solarThermalData = store.domesticHotWater.waterHeating.solarThermal.data;
// const solarThermalSummary: SummarySection = {
// 	id: "solarThermal",
// 	label: "Solar thermal",
// 	data: solarThermalData.map(d => {
// 		return {
// 			"Name": show(d.data.name),
// 		};
// 	}),
// 	editUrl: getUrl("waterHeating"),
// };

// const pointOfUseData = store.domesticHotWater.waterHeating.pointOfUse.data;
// const pointOfUseSummary: SummarySection = {
// 	id: "pointOfUse",
// 	label: "Point of use",
// 	data: pointOfUseData.map(d => {
// 		return {
// 			"Name": show(d.data.name),
// 			"Setpoint temperature": dim(d.data.setpointTemperature, "celsius"),
// 			"Heater efficiency": show(d.data.heaterEfficiency),
// 		};
// 	}),
// 	editUrl: getUrl("waterHeating"),
// };

// const heatPumpData = store.domesticHotWater.waterHeating.heatPump.data;
// const heatPumpSummary: SummarySection = {
// 	id: "heatPump",
// 	label: "Heat pumps",
// 	data: heatPumpData.map(d => {
// 		return {
// 			"Name": show(d.data.name),
// 		};
// 	}),
// 	editUrl: getUrl("waterHeating"),
// };

// const combiBoilerData = store.domesticHotWater.waterHeating.combiBoiler.data;
// const combiBoilerSummary: SummarySection = {
// 	id: "combiBoiler",
// 	label: "Combi boilers",
// 	data: combiBoilerData.map(d => {
// 		return {
// 			"Name": show(d.data.name),
// 		};
// 	}),
// 	editUrl: getUrl("waterHeating"),
// };

// const heatBatteryData = store.domesticHotWater.waterHeating.heatBattery.data;
// const heatBatterySummary: SummarySection = {
// 	id: "heatBattery",
// 	label: "Heat batteries",
// 	data: heatBatteryData.map(d => {
// 		return {
// 			"Name": show(d.data.name),
// 		};
// 	}),
// 	editUrl: getUrl("waterHeating"),
// };

// const smartHotWaterTankData = store.domesticHotWater.waterHeating.smartHotWaterTank.data;
// const smartHotWaterTankSummary: SummarySection = {
// 	id: "smartHotWaterTank",
// 	label: "Smart hot water tanks",
// 	data: smartHotWaterTankData.map(d => {
// 		return {
// 			"Name": show(d.data.name),
// 		};
// 	}),
// 	editUrl: getUrl("waterHeating"),
// };

// const heatInterfaceUnitData = store.domesticHotWater.waterHeating.heatInterfaceUnit.data;
// const heatInterfaceUnitSummary: SummarySection = {
// 	id: "heatInterfaceUnit",
// 	label: "Heat interface units",
// 	data: heatInterfaceUnitData.map(d => {
// 		return {
// 			"Name": show(d.data.name),
// 		};
// 	}),
// 	editUrl: getUrl("waterHeating"),
// };

const waterHeatingSummarySections: SummarySection[] = [
	hotWaterCylinderSummary,
	// immersionHeaterSummary,
	// solarThermalSummary,
	// pointOfUseSummary,
	// heatPumpSummary,
	// combiBoilerSummary,
	// heatBatterySummary,
	// smartHotWaterTankSummary,
	// heatInterfaceUnitSummary,
];

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
			"Flow rate": "flowRate" in d.data ? dim(d.data.flowRate, "litres per hour") : emptyValueRendering,
			"WWHRS installed": "wwhrs" in d.data ? displayBoolean(d.data.wwhrs) : emptyValueRendering,
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
			"Flow rate": "flowRate" in d.data ? dim(d.data.flowRate, "litres per minute") : emptyValueRendering,
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

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<!-- <GovTabs v-slot="tabProps" :items="getTabItems(waterHeatingSummarySections)">
		<TabPanel id="waterHeating" :selected="!tabProps.currentItem">
			<h2 class="govuk-heading-m">No water heating added</h2>
			<NuxtLink class="govuk-link" :to="getUrl('waterHeating')">
				Add water heating
			</NuxtLink>
		</TabPanel>
		<SummaryTab :summary="immersionHeaterSummary" :selected="tabProps.currentItem?.id === 'immersionHeater'" />
		<SummaryTab :summary="solarThermalSummary" :selected="tabProps.currentItem?.id === 'solarThermal'" />
		<SummaryTab :summary="pointOfUseSummary" :selected="tabProps.currentItem?.id === 'pointOfUse'" />
		<SummaryTab :summary="heatPumpSummary" :selected="tabProps.currentItem?.id === 'heatPump'" />
		<SummaryTab :summary="combiBoilerSummary" :selected="tabProps.currentItem?.id === 'combiBoiler'" />
		<SummaryTab :summary="heatBatterySummary" :selected="tabProps.currentItem?.id === 'heatBattery'" />
		<SummaryTab :summary="smartHotWaterTankSummary" :selected="tabProps.currentItem?.id === 'smartHotWaterTank'" />
		<SummaryTab :summary="heatInterfaceUnitSummary" :selected="tabProps.currentItem?.id === 'heatInterfaceUnit'" />
	</GovTabs> -->
	<GovTabs v-slot="tabProps" :items="getTabItems(waterHeatingSummarySections)">
		<SummaryTab :summary="hotWaterCylinderSummary" :selected="tabProps.currentItem?.id === 'hotWaterCylinder'">
			<template #empty>
				<h2 class="govuk-heading-m">No hot water cylinders added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('waterHeating')"> 
					Add hot water cylinder
				</NuxtLink>
			</template>
		</SummaryTab>
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

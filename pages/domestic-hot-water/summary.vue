<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl  } from "#imports";

const title = "Domestic hot water";
const store = useEcaasStore();

const { heatPump } = store.heatingSystems.heatGeneration;
const heatGenerationData = [
	heatPump.data,
	// boiler.data,
	// heatBattery.data,
	// heatNetwork.data,
	// heatInterfaceUnit.data
].flat().filter(x => !!x.data).map(x => ({ id: x.data.id, name: x.data.name }));

const hotWaterCylinderData = store.domesticHotWater.waterHeating.hotWaterCylinder.data;
const hotWaterCylinderSummary: SummarySection = {
	id: "hotWaterCylinder",
	label: "Hot Water Cylinder",
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

const immersionHeaterData = store.domesticHotWater.waterHeating.immersionHeater.data;
const immersionHeaterSummary: SummarySection = {
	id: "immersionHeater",
	label: "Immersion heater",
	data: immersionHeaterData.map(d => {
		return {
			"Name": show(d.name),
			"Rated power": dim(d.ratedPower, "kilowatt"),
			"Heater position": displayHeaterPosition(d.heaterPosition),
			"Thermostat position": displayHeaterPosition(d.thermostatPosition),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

const solarThermalData = store.domesticHotWater.waterHeating.solarThermal.data;
const solarThermalSummary: SummarySection = {
	id: "solarThermal",
	label: "Solar thermal",
	data: solarThermalData.map(d => {
		return {
			"Name": show(d.name),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

const pointOfUseData = store.domesticHotWater.waterHeating.pointOfUse.data;
const pointOfUseSummary: SummarySection = {
	id: "pointOfUse",
	label: "Point of use",
	data: pointOfUseData.map(d => {
		return {
			"Name": show(d.name),
			"Setpoint temperature": dim(d.setpointTemperature, "celsius"),
			"Heater efficiency": show(d.heaterEfficiency),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

const heatPumpData = store.domesticHotWater.waterHeating.heatPump.data;
const heatPumpSummary: SummarySection = {
	id: "heatPump",
	label: "Heat pump",
	data: heatPumpData.map(d => {
		return {
			"Name": show(d.data.name),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

const combiBoilerData = store.domesticHotWater.waterHeating.combiBoiler.data;
const combiBoilerSummary: SummarySection = {
	id: "combiBoiler",
	label: "Combi boiler",
	data: combiBoilerData.map(d => {
		return {
			"Name": show(d.name),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

const heatBatteryData = store.domesticHotWater.waterHeating.heatBattery.data;
const heatBatterySummary: SummarySection = {
	id: "heatBattery",
	label: "Heat battery",
	data: heatBatteryData.map(d => {
		return {
			"Name": show(d.name),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

const smartHotWaterTankData = store.domesticHotWater.waterHeating.smartHotWaterTank.data;
const smartHotWaterTankSummary: SummarySection = {
	id: "smartHotWaterTank",
	label: "Smart hot water tank",
	data: smartHotWaterTankData.map(d => {
		return {
			"Name": show(d.name),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

const heatInterfaceUnitData = store.domesticHotWater.waterHeating.heatInterfaceUnit.data;
const heatInterfaceUnitSummary: SummarySection = {
	id: "heatInterfaceUnit",
	label: "Heat interface unit",
	data: heatInterfaceUnitData.map(d => {
		return {
			"Name": show(d.name),
		};
	}),
	editUrl: getUrl("waterHeating"),
};

const waterHeatingSummarySections: SummarySection[] = [
	hotWaterCylinderSummary,
	immersionHeaterSummary,
	solarThermalSummary,
	pointOfUseSummary,
	heatPumpSummary,
	combiBoilerSummary,
	heatBatterySummary,
	smartHotWaterTankSummary,
	heatInterfaceUnitSummary,
].filter(x => x.data.length);

const mixedShowerData = store.domesticHotWater.hotWaterOutlets.mixedShower.data;
const mixedShowerSummary: SummarySection = {
	id: "mixedShower",
	label: "Mixer shower",
	data: mixedShowerData.map(d => { 
		return {
			"Name": show(d.data.name),
			"Flow rate": dim(d.data.flowRate, "litres per hour"),
		};
	}),
	editUrl: getUrl("hotWaterOutlets"),
};

const electricShowerData = store.domesticHotWater.hotWaterOutlets.electricShower.data;
const electricShowerSummary: SummarySection = {
	id: "electricShower",
	label: "Electric shower",
	data: electricShowerData.map(d => {   
		return {
			"Name": show(d.data.name),
			"Rated power": dim(d.data.ratedPower, "kilowatt"),
		};
	}),
	editUrl: getUrl("hotWaterOutlets"),
};

const bathData = store.domesticHotWater.hotWaterOutlets.bath.data;
const bathSummary: SummarySection = {
	id: "bath",
	label: "Bath",
	data: bathData.map(d => {
		return {
			"Name": show(d.data.name),
			"Size": dim(d.data.size, "litres"),
			"Flow rate": dim(d.data.flowRate, "litres per minute"),
		};
	}),
	editUrl: getUrl("hotWaterOutlets"),
};

const otherOutletsData = store.domesticHotWater.hotWaterOutlets.otherOutlets.data;
const otherOutletsSummary: SummarySection = {
	id: "otherOutlets",
	label: "Other",
	data: otherOutletsData.map(d => {
		return {
			"Name": show(d.data.name),
			"Flow rate": dim(d.data.flowRate, "litres per minute"),
		};
	}),
	editUrl: getUrl("hotWaterOutlets"),
};

const hotWaterOutletsSummarySections: SummarySection[] = [
	mixedShowerSummary,
	electricShowerSummary,
	bathSummary,
	otherOutletsSummary,
];

const primaryPipeworkData = store.domesticHotWater.pipework.primaryPipework.data;
const primaryPipeworkSummary: SummarySection = {
	id: "primaryPipework",
	label: "Primary pipework",
	data: primaryPipeworkData.map(d => {
		return {
			"Name": show(d.data.name),
			"Internal diameter": dim(d.data.internalDiameter, "millimetres"),
			"External diameter": dim(d.data.externalDiameter, "millimetres"),
			"Length": dim(d.data.length, "metres"),
			"Insulation thickness": dim(d.data.insulationThickness, "millimetres"),
			"Thermal conductivity": dim(d.data.thermalConductivity, "watts per metre kelvin") ,
			"Surface reflectivity": displayReflectivity(d.data.surfaceReflectivity),
			"Pipe contents": displayCamelToSentenceCase(show(d.data.pipeContents)),
			"Hot water cylinder": show(hotWaterCylinderData.find(x => x && x.data.id === d.data.hotWaterCylinder)?.data.name),
			"Location": displayCamelToSentenceCase(show(d.data.location)),
		};
	}) || [],
	editUrl: getUrl("pipework"),
};

const secondaryPipeworkData = store.domesticHotWater.pipework.secondaryPipework.data;
const secondaryPipeworkSummary: SummarySection = {
	id: "secondaryPipework",
	label: "Secondary pipework",
	data: secondaryPipeworkData.map(d => {
		return {
			"Name": show(d.data.name),
			"Internal diameter": dim(d.data.internalDiameter, "millimetres"),
			"Length": dim(d.data.length, "metres"),
			"Location": displayCamelToSentenceCase(show(d.data.location)),
		};
	}) || [],
	editUrl: getUrl("pipework"),
};

const pipeworkSummarySections: SummarySection[] = [
	primaryPipeworkSummary,
	secondaryPipeworkSummary,
];

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<h2 class="govuk-heading-m">Water heating</h2>
	<GovTabs v-slot="tabProps" :items="getTabItems(waterHeatingSummarySections)">
		<TabPanel id="waterHeating" :selected="!tabProps.currentItem">
			<h2 class="govuk-heading-m">No water heating added</h2>
			<NuxtLink class="govuk-link" :to="getUrl('waterHeating')">
				Add water heating
			</NuxtLink>
		</TabPanel>
		<SummaryTab :summary="hotWaterCylinderSummary" :selected="tabProps.currentItem?.id === 'hotWaterCylinder'" />
		<SummaryTab :summary="immersionHeaterSummary" :selected="tabProps.currentItem?.id === 'immersionHeater'" />
		<SummaryTab :summary="solarThermalSummary" :selected="tabProps.currentItem?.id === 'solarThermal'" />
		<SummaryTab :summary="pointOfUseSummary" :selected="tabProps.currentItem?.id === 'pointOfUse'" />
		<SummaryTab :summary="heatPumpSummary" :selected="tabProps.currentItem?.id === 'heatPump'" />
		<SummaryTab :summary="combiBoilerSummary" :selected="tabProps.currentItem?.id === 'combiBoiler'" />
		<SummaryTab :summary="heatBatterySummary" :selected="tabProps.currentItem?.id === 'heatBattery'" />
		<SummaryTab :summary="smartHotWaterTankSummary" :selected="tabProps.currentItem?.id === 'smartHotWaterTank'" />
		<SummaryTab :summary="heatInterfaceUnitSummary" :selected="tabProps.currentItem?.id === 'heatInterfaceUnit'" />
	</GovTabs>
	<h2 class="govuk-heading-m">Hot water outlets</h2>
	<GovTabs v-slot="tabProps" :items="getTabItems(hotWaterOutletsSummarySections)">
		<SummaryTab :summary="mixedShowerSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No mixer shower added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('mixedShowerCreate')">
					Add mixer shower
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="electricShowerSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No electric shower added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('electricShowerCreate')">
					Add electric shower
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="bathSummary" :selected="tabProps.currentTab === 2">
			<template #empty>
				<h2 class="govuk-heading-m">No bath added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('bathCreate')">
					Add bath
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="otherOutletsSummary" :selected="tabProps.currentTab === 3">
			<template #empty>
				<h2 class="govuk-heading-m">No outlet added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('otherOutletsCreate')">
					Add outlet
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<h2 class="govuk-heading-m">Pipework</h2>
	<GovTabs v-slot="tabProps" :items="getTabItems(pipeworkSummarySections)">
		<SummaryTab :summary="primaryPipeworkSummary" :selected="tabProps.currentTab === 0" :edit-url="getUrl('pipework')!">
			<template #empty>
				<h2 class="govuk-heading-m">No pipework added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('primaryPipeworkCreate')">
					Add pipework
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="secondaryPipeworkSummary" :selected="tabProps.currentTab === 1" :edit-url="getUrl('pipework')!">
			<template #empty>
				<h2 class="govuk-heading-m">No pipework added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('secondaryPipeworkCreate')">
					Add pipework
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>

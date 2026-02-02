<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl, type MixedShowerDataNew } from "#imports";

const title = "Domestic hot water summary";
const store = useEcaasStore();

const heatSources = store.spaceHeating.heatSource.data;
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

function getNonEmptySections(summarySections: SummarySection[]) {
	return summarySections.filter(x => Array.isArray(x.data) && x.data.length > 0);
}

const populatedWaterStorageSections = getNonEmptySections(waterStorageSummarySections);

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
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

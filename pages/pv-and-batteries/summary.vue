<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";

const title = "PV and electric batteries summary";
const store = useEcaasStore();

const pvArrays = store.pvAndBatteries.pvArrays.data;
const pvSummary: SummarySection = {
	id: "pvArrays",
	label: "PV arrays",
	data: pvArrays.map(({ data: x }) => {
		return {
			"Name": x.name,
			"Peak power": dim(x.peakPower, "kilowatt peak"),
			"Ventilation strategy": displaySnakeToSentenceCase(show(x.ventilationStrategy)),
			"Pitch": dim(x.pitch, "degrees"),
			"Orientation": dim(x.orientation, "degrees"),
			"Elevational height of PV": dim(x.elevationalHeight, "metres"),
			"Length of PV": dim(x.lengthOfPV, "metres"),
			"Width of PV": dim(x.widthOfPV, "metres"),
			"Inverter peak power AC": dim(x.inverterPeakPowerAC, "kilowatt"),
			"Inverter peak power DC": dim(x.inverterPeakPowerDC, "kilowatt"),
			"Inverter is inside": displayBoolean(x.inverterIsInside),
			"Inverter type": displaySnakeToSentenceCase(show(x.inverterType)),
		};
	}),
	editUrl: "/pv-and-batteries",
};

const electricBattery = store.pvAndBatteries.electricBattery.data;
const batterySummary: SummarySection = {
	id: "electricBattery",
	label: "Electric batteries",
	data: electricBattery.map(({ data: x }) => {
		return {
			"Name": x.name,
			"Capacity": dim(x.capacity, "kilowatt-hour"),
			"Charge efficiency": show(x.chargeEfficiency),
			"Location": displayCamelToSentenceCase(show(x.location)),
			"Maximum charge rate": dim(x.maximumChargeRate, "kilowatt"),
			"Minimum charge rate": dim(x.minimumChargeRate, "kilowatt"),
			"Maximum discharge rate": dim(x.maximumDischargeRate, "kilowatt"),
		};
	}),
	editUrl: "/pv-and-batteries",
};

const diverters = store.pvAndBatteries.diverters.data;
const diverterSummary: SummarySection = {
	id: "diverters",
	label: "Diverters",
	data: diverters.map(({ data: x }) => {
		return {
			"Name": show(x.name),
			"Associated hot water cylinder": show(store.domesticHotWater.waterStorage.data.find(y => y && y.data.id === x.hotWaterCylinder)?.data.name),
		};
	}),
	editUrl: "/pv-and-batteries",
};

</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([pvSummary])">
		<SummaryTab :summary="pvSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No PV arrays added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pvAndBatteries')">
					Add PV arrays
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([batterySummary])">
		<SummaryTab :summary="batterySummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No electric batteries added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pvAndBatteries')">
					Add electric battery
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([diverterSummary])">
		<SummaryTab :summary="diverterSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No diverters added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pvAndBatteries')">
					Add diverter
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>
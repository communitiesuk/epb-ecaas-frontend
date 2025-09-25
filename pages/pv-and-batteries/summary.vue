<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
import { kilowatt, kilowattHour, kilowattPeak } from "~/utils/units/power";
import { degrees } from "~/utils/units/angle";
import { metre } from "~/utils/units/length";

const title = "PV and electric batteries summary";
const store = useEcaasStore();

const pvSystems = store.pvAndBatteries.pvSystems.data;
const pvSummary: SummarySection = {
	id: "pvSystems",
	label: "PV systems",
	data: pvSystems.map(({ data: x }) => {
		return {
			"Name": x.name,
			"Peak power": dim(x.peakPower, kilowattPeak.name),
			"Ventilation strategy": displaySnakeToSentenceCase(show(x.ventilationStrategy)),
			"Pitch": dim(x.pitch, degrees.name),
			"Orientation": dim(x.orientation, degrees.name),
			"Elevational height of PV": dim(x.elevationalHeight, metre.name),
			"Length of PV": dim(x.lengthOfPV, metre.name),
			"Width of PV": dim(x.widthOfPV, metre.name),
			"Inverter peak power AC": dim(x.inverterPeakPowerAC, kilowatt.name),
			"Inverter peak power DC": dim(x.inverterPeakPowerDC, kilowatt.name),
			"Inverter is inside": displayBoolean(x.inverterIsInside),
			"Inverter type": displaySnakeToSentenceCase(show(x.inverterType)),
		};
	}),
	editUrl: "/pv-and-batteries",
};

const electricBattery = store.pvAndBatteries.electricBattery.data;
const batterySummary: SummarySection = {
	id: "electricBattery",
	label: "Electric battery",
	data: electricBattery.map(({ data: x }) => {
		return {
			"Name": x.name,
			"Capacity": dim(x.capacity, kilowattHour.name),
			"Battery age": x.batteryAge ? `${show(x.batteryAge)} years` : show(x.batteryAge),
			"Charge efficiency": show(x.chargeEfficiency),
			"Location": displayCamelToSentenceCase(show(x.location)),
			"Grid charging possible": displayBoolean(x.gridChargingPossible),
			"Maximum charge rate": dim(x.maximumChargeRate, kilowatt.name),
			"Minimum charge rate": dim(x.minimumChargeRate, kilowatt.name),
			"Maximum discharge rate": dim(x.maximumDischargeRate, kilowatt.name),
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
				<h2 class="govuk-heading-m">No PV systems added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pvAndBatteries')">
					Add PV systems
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([batterySummary])">
		<SummaryTab :summary="batterySummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No electric battery added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pvAndBatteries')">
					Add electric battery
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>
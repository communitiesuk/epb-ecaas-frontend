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
			"Peak power": `${x.peakPower} ${kilowattPeak.suffix}`,
			"Ventilation strategy": displaySnakeToSentenceCase(show(x.ventilationStrategy)),
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Orientation": `${x.orientation} ${degrees.suffix}`,
			"Elevational height of PV": `${x.elevationalHeight} ${metre.suffix}`,
			"Length of PV": `${x.lengthOfPV} ${metre.suffix}`,
			"Width of PV": `${x.widthOfPV} ${metre.suffix}`,
			"Inverter peak power AC": `${x.inverterPeakPowerAC} ${kilowatt.suffix}`,
			"Inverter peak power DC": `${x.inverterPeakPowerDC} ${kilowatt.suffix}`,
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
			"Capacity": `${x.capacity} ${kilowattHour.suffix}`,
			"Battery age": `${x.batteryAge} years`,
			"Charge efficiency": x.chargeEfficiency,
			"Location": displayCamelToSentenceCase(show(x.location)),
			"Grid charging possible": displayBoolean(x.gridChargingPossible),
			"Maximum charge rate": `${x.maximumChargeRate} ${kilowatt.suffix}`,
			"Minimum charge rate": `${x.minimumChargeRate} ${kilowatt.suffix}`,
			"Maximum discharge rate": `${x.maximumDischargeRate} ${kilowatt.suffix}`,
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
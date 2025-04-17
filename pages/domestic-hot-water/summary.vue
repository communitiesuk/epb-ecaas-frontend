<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';

definePageMeta({ layout: false });

const title = "Domestic hot water";
const store = useEcaasStore();

const { heatPump, boiler, heatBattery, heatNetwork, heatInterfaceUnit } = store.heatingSystems.heatGeneration;
const heatGenerationData = [
	heatPump.data,
	boiler.data,
	heatBattery.data,
	heatNetwork.data,
	heatInterfaceUnit.data
].flat().map(x => ({ id: x.id, name: x.name }));

const storageTankData = store.domesticHotWater.waterHeating.storageTank.data;
const storageTankSummary: SummarySection = {
	id: 'storageTank',
	label: 'Storage tank',
	data: storageTankData.map(d => {
		return {
			"Name": d.name,
			"Heat source": heatGenerationData.find(x => x.id === d.heatSource)?.name,
			"Tank volume": d.tankVolume,
			"Daily energy loss": d.dailyEnergyLoss
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const immersionHeaterData = store.domesticHotWater.waterHeating.immersionHeater.data;
const immersionHeaterSummary: SummarySection = {
	id: 'immersionHeater',
	label: 'Immersion heater',
	data: immersionHeaterData.map(d => {
		return {
			"Name": d.name,
			"Rated power": d.ratedPower,
			"Heater position": d.heaterPosition,
			"Thermostat position": d.thermostatPosition
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const solarThermalData = store.domesticHotWater.waterHeating.solarThermal.data;
const solarThermalSummary: SummarySection = {
	id: 'solarThermal',
	label: 'Solar thermal',
	data: solarThermalData.map(d => {
		return {
			"Name": d.name
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const pointOfUseData = store.domesticHotWater.waterHeating.pointOfUse.data;
const pointOfUseSummary: SummarySection = {
	id: 'pointOfUse',
	label: 'Point of use',
	data: pointOfUseData.map(d => {
		return {
			"Name": d.name,
			"Set point temperature": d.setPointTemperature,
			"Heater efficiency": d.heaterEfficiency
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const heatPumpData = store.domesticHotWater.waterHeating.heatPump.data;
const heatPumpSummary: SummarySection = {
	id: 'heatPump',
	label: 'Heat pump',
	data: heatPumpData.map(d => {
		return {
			"Name": d.name
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const combiBoilerData = store.domesticHotWater.waterHeating.combiBoiler.data;
const combiBoilerSummary: SummarySection = {
	id: 'combiBoiler',
	label: 'Combi boiler',
	data: combiBoilerData.map(d => {
		return {
			"Name": d.name
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const heatBatteryData = store.domesticHotWater.waterHeating.heatBattery.data;
const heatBatterySummary: SummarySection = {
	id: 'heatBattery',
	label: 'Heat battery',
	data: heatBatteryData.map(d => {
		return {
			"Name": d.name
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const smartHotWaterTankData = store.domesticHotWater.waterHeating.smartHotWaterTank.data;
const smartHotWaterTankSummary: SummarySection = {
	id: 'smartHotWaterTank',
	label: 'Smart hot water tank',
	data: smartHotWaterTankData.map(d => {
		return {
			"Name": d.name
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const heatInterfaceUnitData = store.domesticHotWater.waterHeating.heatInterfaceUnit.data;
const heatInterfaceUnitSummary: SummarySection = {
	id: 'heatInterfaceUnit',
	label: 'Heat interface unit',
	data: heatInterfaceUnitData.map(d => {
		return {
			"Name": d.name
		};
	}),
	editUrl: getUrl('waterHeating')!
};

const waterHeatingSummarySections: SummarySection[] = [
	storageTankSummary,
	immersionHeaterSummary,
	solarThermalSummary,
	pointOfUseSummary,
	heatPumpSummary,
	combiBoilerSummary,
	heatBatterySummary,
	smartHotWaterTankSummary,
	heatInterfaceUnitSummary
].filter(x => x.data.length);

const mixedShowerData = store.domesticHotWater.hotWaterOutlets.mixedShower.data;
const mixedShowerSummary: SummarySection = {
	id: 'mixedShower',
	label: 'Mixed shower',
	data: mixedShowerData.map(d => {
		return {
			"Name": d.name,
			"Flow rate": d.flowRate
		};
	}),
	editUrl: getUrl('hotWaterOutlets')!
};

const electricShowerData = store.domesticHotWater.hotWaterOutlets.electricShower.data;
const electricShowerSummary: SummarySection = {
	id: 'electricShower',
	label: 'Electric shower',
	data: electricShowerData.map(d => {
		return {
			"Name": d.name,
			"Rated power": d.ratedPower
		};
	}),
	editUrl: getUrl('hotWaterOutlets')!
};

const bathData = store.domesticHotWater.hotWaterOutlets.bath.data;
const bathSummary: SummarySection = {
	id: 'bath',
	label: 'Bath',
	data: bathData.map(d => {
		return {
			"Name": d.name,
			"Size": d.size,
			"Flow rate": d.flowRate
		};
	}),
	editUrl: getUrl('hotWaterOutlets')!
};

const otherOutletsData = store.domesticHotWater.hotWaterOutlets.otherOutlets.data;
const otherOutletsSummary: SummarySection = {
	id: 'otherOutlets',
	label: 'Other',
	data: otherOutletsData.map(d => {
		return {
			"Name": d.name,
			"Flow rate": d.flowRate
		};
	}),
	editUrl: getUrl('hotWaterOutlets')!
};

const hotWaterOutletsSummarySections: SummarySection[] = [
	mixedShowerSummary,
	electricShowerSummary,
	bathSummary,
	otherOutletsSummary
];

const primaryPipeworkData = store.domesticHotWater.pipework.primaryPipework.data;
const primaryPipeworkSummary: SummarySection = {
	id: 'primaryPipework',
	label: "Primary pipework",
	data: primaryPipeworkData.map(d => {
		return {
			"Name": d.name,
			"Internal diameter": d.internalDiameter,
			"External diameter": d.externalDiameter,
			"Length": d.length,
			"Insulation thickness": d.insulationThickness,
			"Thermal conductivity": d.thermalConductivity,
			"Surface reflectivity": d.surfaceReflectivity,
			"Pipe contents": d.pipeContents,
			"Storage tank": storageTankData.find(x => x.id === d.storageTank)?.name,
			"Location": d.location,
		};
	}) || [],
	editUrl: getUrl('pipework')!
};

const secondaryPipeworkData = store.domesticHotWater.pipework.secondaryPipework.data;
const secondaryPipeworkSummary: SummarySection = {
	id: 'secondaryPipework',
	label: "Secondary pipework",
	data: secondaryPipeworkData.map(d => {
		return {
			"Name": d.name,
			"Location": d.location,
			"Length": d.length,
			"Internal diameter": d.internalDiameter
		};
	}) || [],
	editUrl: getUrl('pipework')!
};

const pipeworkSummarySections: SummarySection[] = [
	primaryPipeworkSummary,
	secondaryPipeworkSummary
];

const { mixedShower, electricShower, bath, otherOutlets } = store.domesticHotWater.hotWaterOutlets;
const hotWaterOutletsData = [
	mixedShower.data,
	electricShower.data,
	bath.data,
	otherOutlets.data
].flat().map(x => ({ id: x.id, name: x.name }));

const wwhrsData = store.domesticHotWater.wwhrs.data;
const wwhrsSummary: SummarySection = {
	id: 'wwhrs',
	label: 'WWHRS',
	data: wwhrsData.map(d => {
		return {
			"Name": d.name,
			"Outlet": hotWaterOutletsData.find(x => x.id === d.outlet)?.name,
			"Type": d.type,
			"Flow rate": d.flowRate,
			"Efficiency": d.efficiency,
			"Proportion of use": d.proportionOfUse
		};
	}),
	editUrl: getUrl('wwhrs')!
};
</script>

<template>
	<div>
		<NuxtLayout name="one-column">
			<Head>
				<Title>{{ title }}</Title>
			</Head>
			<h1 class="govuk-heading-l">{{ title }}</h1>
			<h2 class="govuk-heading-m">Water heating</h2>
			<GovTabs v-slot="tabProps" :items="getTabItems(waterHeatingSummarySections)">
				<GovSummaryTab :summary="storageTankSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No storage tanks added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('storageTankCreate')">
							Add storage tank
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="immersionHeaterSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No immersion heaters added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('immersionHeaterCreate')">
							Add immersion heater
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="solarThermalSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No solar thermal added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('solarThermalCreate')">
							Add solar thermal
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="pointOfUseSummary" :selected="tabProps.currentTab === 3">
					<template #empty>
						<h2 class="govuk-heading-m">No point of use added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('pointOfUseCreate')">
							Add point of use
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="heatPumpSummary" :selected="tabProps.currentTab === 4">
					<template #empty>
						<h2 class="govuk-heading-m">No heat pump added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('hotWaterheatPumpCreate')">
							Add heat pump
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="combiBoilerSummary" :selected="tabProps.currentTab === 5">
					<template #empty>
						<h2 class="govuk-heading-m">No combi boiler added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('combiBoilerCreate')">
							Add combi boiler
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="heatBatterySummary" :selected="tabProps.currentTab === 6">
					<template #empty>
						<h2 class="govuk-heading-m">No heat battery added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('hotWaterHeatBatteryCreate')">
							Add heat battery
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="smartHotWaterTankSummary" :selected="tabProps.currentTab === 7">
					<template #empty>
						<h2 class="govuk-heading-m">No smart hot water tank added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('smartHotWaterTankCreate')">
							Add smart hot water tank
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="heatInterfaceUnitSummary" :selected="tabProps.currentTab === 8">
					<template #empty>
						<h2 class="govuk-heading-m">No heat interface unit added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('hotWaterHeatInterfaceUnitCreate')">
							Add heat interface unit
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
			<h2 class="govuk-heading-m">Hot water outlets</h2>
			<GovTabs v-slot="tabProps" :items="getTabItems(hotWaterOutletsSummarySections)">
				<GovSummaryTab :summary="mixedShowerSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No mixed shower added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('mixedShowerCreate')">
							Add mixed shower
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="electricShowerSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No electric shower added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('electricShowerCreate')">
							Add electric shower
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="bathSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No bath added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('bathCreate')">
							Add bath
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="otherOutletsSummary" :selected="tabProps.currentTab === 3">
					<template #empty>
						<h2 class="govuk-heading-m">No outlet added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('otherOutletsCreate')">
							Add outlet
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
			<h2 class="govuk-heading-m">Pipework</h2>
			<GovTabs v-slot="tabProps" :items="getTabItems(pipeworkSummarySections)">
				<GovSummaryTab :summary="primaryPipeworkSummary" :selected="tabProps.currentTab === 0" :edit-url="getUrl('pipework')!">
					<template #empty>
						<h2 class="govuk-heading-m">No pipework added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('primaryPipeworkCreate')">
							Add pipework
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="secondaryPipeworkSummary" :selected="tabProps.currentTab === 1" :edit-url="getUrl('pipework')!">
					<template #empty>
						<h2 class="govuk-heading-m">No pipework added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('secondaryPipeworkCreate')">
							Add pipework
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
			<h2 class="govuk-heading-m">Waste water heat recovery (WWHRS)</h2>
			<GovTabs v-slot="tabProps" :items="getTabItems([wwhrsSummary])">
				<GovSummaryTab :summary="wwhrsSummary" :selected="tabProps.currentTab === 0" :edit-url="getUrl('wwhrs')!">
					<template #empty>
						<h2 class="govuk-heading-m">No WWHRS added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(wwhrsSummary.id)}/create`">
							Add WWHRS
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>

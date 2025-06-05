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
			"Setpoint temperature": d.setpointTemperature,
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
			"Surface reflectivity": d.surfaceReflectivity ? 'Reflective' : 'Not reflective',
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
			"Type": displayWwhrsType(d.type),
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
				<TabPanel id="waterHeating" :selected="!tabProps.currentItem">
					<h2 class="govuk-heading-m">No water heating added</h2>
					<NuxtLink class="govuk-link" :to="getUrl('waterHeating')">
						Add water heating
					</NuxtLink>
				</TabPanel>
				<SummaryTab :summary="storageTankSummary" :selected="tabProps.currentItem?.id === 'storageTank'" />
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
						<h2 class="govuk-heading-m">No mixed shower added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('mixedShowerCreate')">
							Add mixed shower
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
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>

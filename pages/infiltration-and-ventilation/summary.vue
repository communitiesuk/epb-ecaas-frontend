<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';

const title = "Infiltration and ventilation summary";
const store = useEcaasStore();

definePageMeta({ layout: false });

const mechanicalVentilationData = store.infiltrationAndVentilation.mechanicalVentilation.data;

const mechanicalVentilationSummary: SummarySection = {
	id: 'mechanicalVentilation',
	label: 'Mechanical ventilation',
	data: mechanicalVentilationData?.map(x => {
		return {
			"Name": x.name,
			"Type of mechanical ventilation": x.typeOfMechanicalVentilationOptions,
			"Control for the supply airflow": x.controlForSupplyAirflow,
			"Supply air temperature control": x.supplyAirTemperatureControl,
			"Air flow rate": x.airFlowRate,
			"MVHR location": x.mvhrLocation,
			"MVHR efficiency": x.mvhrEfficiency,
			"Ductwork cross sectional shape": x.ductworkCrossSectionalShape,
			"Duct type": x.ductType,
			"Internal diameter of ductwork": x.internalDiameterOfDuctwork,
			"External diameter of ductwork": x.externalDiameterOfDuctwork,
			"Thermal insulation conductivity of ductwork": x.thermalInsulationConductivityOfDuctwork,
			"Surface reflectivity": x.surfaceReflectivity
		};
	}) || []
};

const ventData = store.infiltrationAndVentilation.vents.data;

const ventSummary: SummarySection = {
	id: 'vents',
	label: 'Vents',
	data: ventData.map(x => {
		return {
			"Name": x.name,
			"Type of vent": x.typeOfVent,
			"Effective ventilation area": x.effectiveVentilationArea,
			"Vent opening ratio": x.openingRatio,
			"Mid height of zone": x.midHeightOfZone,
			"Pressure difference": x.pressureDifference,
			"Orientation": x.orientation,
			"Pitch": x.pitch
		};
	})
};

const ventilationData = store.infiltrationAndVentilation.ventilation.data;

const ventilationSummary: SummarySection = {
	id: 'ventilation',
	label: 'Ventilation',
	data: {
		"Zone elevational level at base": ventilationData.zoneElevationalLevelAtBase,
		"Cross vent factor": ventilationData.crossVentFactor,
		"Maximum required air change rate": ventilationData.maxRequiredAirChangeRate
	}
};

const airPermeabilityData = store.infiltrationAndVentilation.airPermeability.data;

const airPermeabilitySummary: SummarySection = {
	id: 'airPermeability',
	label: 'Air permeability',
	data: {
		"Zone height": airPermeabilityData.zoneHeight,
		"Zone envelope area": airPermeabilityData.zoneEnvelopeArea,
		"Test pressure": airPermeabilityData.testPressure,
		"Air tightness test result": airPermeabilityData.airTightnessTestResult
	}
};

function getCombustionApplianceData(data: CombustionApplianceData[]) {
	return data.map(x => {
		return {
			"Name": x.name,
			"Air supply to appliance": x.airSupplyToAppliance,
			"Exhaust method from appliance": x.exhaustMethodFromAppliance,
			"Type of fuel": x.typeOfFuel
		};
	});
}

const openFireplaceData = store.infiltrationAndVentilation.combustionAppliances.openFireplace.data;

const openFireplaceSummary: SummarySection = {
	id: 'combustionAppliances',
	label: 'Open fireplace',
	data: getCombustionApplianceData(openFireplaceData)
};

const closedFireplaceWithFanData = store.infiltrationAndVentilation.combustionAppliances.closedFireplaceWithFan.data;

const closedFireplaceWithFanSummary: SummarySection = {
	id: 'combustionAppliances',
	label: 'Closed fireplace with fan',
	data: getCombustionApplianceData(closedFireplaceWithFanData)
};

const openGasFlueBalancerData = store.infiltrationAndVentilation.combustionAppliances.openGasFlueBalancer.data;

const openGasFlueBalancerSummary: SummarySection = {
	id: 'combustionAppliances',
	label: 'Open gas flue balancer',
	data: getCombustionApplianceData(openGasFlueBalancerData)
};

const openGasKitchenStoveData = store.infiltrationAndVentilation.combustionAppliances.openGasKitchenStove.data;

const openGasKitchenStoveSummary: SummarySection = {
	id: 'combustionAppliances',
	label: 'Open gas kitchen stove',
	data: getCombustionApplianceData(openGasKitchenStoveData)
};

const openGasFireData = store.infiltrationAndVentilation.combustionAppliances.openGasFire.data;

const openGasFireSummary: SummarySection = {
	id: 'combustionAppliances',
	label: 'Open gas fire',
	data: getCombustionApplianceData(openGasFireData)
};

const closedFireData = store.infiltrationAndVentilation.combustionAppliances.closedFire.data;

const closedFireSummary: SummarySection = {
	id: 'combustionAppliances',
	label: 'Closed fire',
	data: getCombustionApplianceData(closedFireData)
};

const summarySections: SummarySection[] = [
	mechanicalVentilationSummary,
	ventSummary,
	ventilationSummary,
	airPermeabilitySummary
];

const combustionApplianceSummarySections: SummarySection[] = [
	openFireplaceSummary,
	closedFireplaceWithFanSummary,
	openGasFlueBalancerSummary,
	openGasKitchenStoveSummary,
	openGasFireSummary,
	closedFireSummary
];
</script>

<template>
	<div>
		<NuxtLayout name="one-column">
			<Head>
				<Title>{{ title }}</Title>
			</Head>
			<h1 class="govuk-heading-l">{{ title }}</h1>
			<GovTabs v-slot="tabProps" :items="getTabItems(summarySections)">
				<GovSummaryTab :summary="mechanicalVentilationSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No mechanical ventilation added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(mechanicalVentilationSummary.id)}/create`">
							Add mechanical ventilation
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="ventSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No vents added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(ventSummary.id)}/create`">
							Add vents
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="ventilationSummary" :selected="tabProps.currentTab === 2" />
				<GovSummaryTab :summary="airPermeabilitySummary" :selected="tabProps.currentTab === 3" />
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(combustionApplianceSummarySections)">
				<GovSummaryTab :summary="openFireplaceSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No open fireplaces added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(openFireplaceSummary.id)}/open-fireplace/create`">
							Add open fireplace
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="closedFireplaceWithFanSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No closed fireplaces added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(closedFireplaceWithFanSummary.id)}/closed-fireplace-with-fan/create`">
							Add closed fireplace
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="openGasFlueBalancerSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No open gas flue balancers added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(openGasFlueBalancerSummary.id)}/open-gas-flue-balancer/create`">
							Add open gas flue balancer
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="openGasKitchenStoveSummary" :selected="tabProps.currentTab === 3">
					<template #empty>
						<h2 class="govuk-heading-m">No open gas kitchen stoves added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(openGasKitchenStoveSummary.id)}/open-gas-kitchen-stove/create`">
							Add open gas kitchen stove
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="openGasFireSummary" :selected="tabProps.currentTab === 4">
					<template #empty>
						<h2 class="govuk-heading-m">No open gas fires added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(openGasFireSummary.id)}/open-gas-fire/create`">
							Add open gas fire
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="closedFireSummary" :selected="tabProps.currentTab === 5">
					<template #empty>
						<h2 class="govuk-heading-m">No closed fires added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(closedFireSummary.id)}/closed-fire/create`">
							Add closed fire
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
		</NuxtLayout>
	</div>
</template>
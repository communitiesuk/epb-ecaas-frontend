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
		};
	}) || [],
	editUrl: getUrl('mechanicalVentilation')!
};

const ductworkData = store.infiltrationAndVentilation.ductwork.data;

const ductworkSummary: SummarySection = {
	id: 'ductwork',
	label: 'Ductwork',
	data: ductworkData?.map(x => {
		const mvhr = store.infiltrationAndVentilation.mechanicalVentilation.data.filter(ventilation => ventilation.id === x.mvhrUnit);

		return {
			"Name": x.name,
			"MVHR unit": mvhr[0]?.name,
			"Ductwork cross sectional shape": x.ductworkCrossSectionalShape,
			"Duct type": x.ductType,
			"Internal diameter of ductwork": x.internalDiameterOfDuctwork,
			"External diameter of ductwork": x.externalDiameterOfDuctwork,
			"Thermal insulation conductivity of ductwork": x.thermalInsulationConductivityOfDuctwork,
			"Surface reflectivity": x.surfaceReflectivity,
		};
	}) || [],
	editUrl: getUrl('ductwork')!
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
	}),
	editUrl: getUrl('vents')!
};

const ventilationData = store.infiltrationAndVentilation.ventilation.data;

const ventilationSummary: SummarySection = {
	id: 'ventilation',
	label: 'Ventilation',
	data: {
		"Dwelling height": ventilationData.dwellingHeight,
		"Dwelling envelope area": ventilationData.dwellingEnvelopeArea,
		"Elevational height of dwelling at its base": ventilationData.dwellingElevationalLevelAtBase,
		"Cross vent factor": ventilationData.crossVentFactor,
		"Maximum required air change rate": ventilationData.maxRequiredAirChangeRate
	},
	editUrl: getUrl('ventilation')!
};

const airPermeabilityData = store.infiltrationAndVentilation.airPermeability.data;

const airPermeabilitySummary: SummarySection = {
	id: 'airPermeability',
	label: 'Air permeability',
	data: {
		"Test pressure": airPermeabilityData.testPressure,
		"Air tightness test result": airPermeabilityData.airTightnessTestResult
	},
	editUrl: getUrl('airPermeability')!
};

const { combustionAppliances } = store.infiltrationAndVentilation;

function getCombustionApplianceData(type: string, data: CombustionApplianceData[]) {
	return data.map(x => {
		return {
			"Type": type,
			"Name": x.name,
			"Air supply to appliance": x.airSupplyToAppliance,
			"Exhaust method from appliance": x.exhaustMethodFromAppliance,
			"Type of fuel": x.typeOfFuel
		};
	});
}

const combustionAppliancesSummary: SummarySection = {
	id: 'combustionAppliances',
	label: 'Combustion appliances',
	data: [
		getCombustionApplianceData('Closed fire', combustionAppliances.closedFire.data),
		getCombustionApplianceData('Closed fireplace with fan', combustionAppliances.closedFireplaceWithFan.data),
		getCombustionApplianceData('Open fireplace', combustionAppliances.openFireplace.data),
		getCombustionApplianceData('Open gas fire', combustionAppliances.openGasFire.data),
		getCombustionApplianceData('Open gas flue balancer', combustionAppliances.openGasFlueBalancer.data),
		getCombustionApplianceData('Open gas kitchen stove', combustionAppliances.openGasKitchenStove.data)
	].flat(),
	editUrl: getUrl('combustionAppliances')!
};

const summarySections: SummarySection[] = [
	mechanicalVentilationSummary,
	ductworkSummary,
	ventSummary,
	ventilationSummary,
	airPermeabilitySummary,
	combustionAppliancesSummary
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
						<NuxtLink class="govuk-link" :to="getUrl('mechanicalVentilationCreate')">
							Add mechanical ventilation
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="ductworkSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No ductwork added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('ductworkCreate')">
							Add ductwork
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="ventSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No vents added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('ventCreate')">
							Add vents
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="ventilationSummary" :selected="tabProps.currentTab === 2" />
				<GovSummaryTab :summary="airPermeabilitySummary" :selected="tabProps.currentTab === 3" />

				<GovSummaryTab :summary="combustionAppliancesSummary" :selected="tabProps.currentTab === 4">
					<template #empty>
						<h2 class="govuk-heading-m">No combustion appliances added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('combustionAppliances')">
							Add combustion appliance
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
		</NuxtLayout>
	</div>
</template>
<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';
import { DuctShape, VentType } from '~/schema/api-schema.types';

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
			"Air flow rate": x.airFlowRate,
			...(x.typeOfMechanicalVentilationOptions == VentType.MVHR ? {
				"MVHR location": x.mvhrLocation,
				"MVHR efficiency": x.mvhrEfficiency,
			} : {})
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
			"Internal diameter of ductwork": x.ductworkCrossSectionalShape === DuctShape.circular ? x.internalDiameterOfDuctwork : undefined,
			"External diameter of ductwork": x.ductworkCrossSectionalShape === DuctShape.circular ? x.externalDiameterOfDuctwork : undefined,
			"Perimeter of ductwork": x.ductworkCrossSectionalShape === DuctShape.rectangular ? x.ductPerimeter : undefined,
			"Thermal insulation conductivity of ductwork": x.thermalInsulationConductivityOfDuctwork,
			"Surface reflectivity": x.surfaceReflectivity ? "reflective" : "not reflective",
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
			"Orientation": x.orientation,
			"Pitch": x.pitch
		};
	}),
	editUrl: getUrl('vents')!
};

const ventilationData = store.infiltrationAndVentilation.naturalVentilation.data;

const ventilationSummary: SummarySection = {
	id: 'ventilation',
	label: 'Ventilation',
	data: {
		"Ventilation zone height": ventilationData.ventilationZoneHeight,
		"Dwelling envelope area": ventilationData.dwellingEnvelopeArea,
		"Elevational height of dwelling at its base": ventilationData.dwellingElevationalLevelAtBase,
		"Cross vent factor": displayBoolean(ventilationData.crossVentilation),
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

// const { combustionAppliances } = store.infiltrationAndVentilation;

// function getCombustionApplianceData(type: string, data: CombustionApplianceData[]) {
// 	return data.map(x => {
// 		return {
// 			"Type": type,
// 			"Name": x.name,
// 			"Air supply to appliance": sentenceCase(x.airSupplyToAppliance),
// 			"Exhaust method from appliance": displayFlueGasExhaustSituation(x.exhaustMethodFromAppliance),
// 			"Type of fuel": x.typeOfFuel
// 		};
// 	});
// }

// const combustionAppliancesSummary: SummarySection = {
// 	id: 'combustionAppliances',
// 	label: 'Combustion appliances',
// 	data: [
// 		getCombustionApplianceData('Closed fire', combustionAppliances[CombustionApplianceType.closed_fire].data),
// 		getCombustionApplianceData('Closed fireplace with fan', combustionAppliances[CombustionApplianceType.closed_with_fan].data),
// 		getCombustionApplianceData('Open fireplace', combustionAppliances[CombustionApplianceType.open_fireplace].data),
// 		getCombustionApplianceData('Open gas fire', combustionAppliances[CombustionApplianceType.open_gas_fire].data),
// 		getCombustionApplianceData('Open gas flue balancer', combustionAppliances[CombustionApplianceType.open_gas_flue_balancer].data),
// 		getCombustionApplianceData('Open gas kitchen stove', combustionAppliances[CombustionApplianceType.open_gas_kitchen_stove].data)
// 	].flat(),
// 	editUrl: getUrl('combustionAppliances')!
// };

const summarySections: SummarySection[] = [
	mechanicalVentilationSummary,
	ductworkSummary,
	ventSummary,
	ventilationSummary,
	airPermeabilitySummary,
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
				
				<SummaryTab :summary="mechanicalVentilationSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No mechanical ventilation added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('mechanicalVentilationCreate')">
							Add mechanical ventilation
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="ductworkSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No ductwork added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('ductworkCreate')">
							Add ductwork
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="ventSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No vents added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('ventCreate')">
							Add vents
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="ventilationSummary" :selected="tabProps.currentTab === 3" />
				<SummaryTab :summary="airPermeabilitySummary" :selected="tabProps.currentTab === 4" />

				<!-- <SummaryTab :summary="combustionAppliancesSummary" :selected="tabProps.currentTab === 5">
					<template #empty>
						<h2 class="govuk-heading-m">No combustion appliances added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('combustionAppliances')">
							Add combustion appliance
						</NuxtLink>
					</template>
				</SummaryTab> -->
			</GovTabs>
		</NuxtLayout>
	</div>
</template>
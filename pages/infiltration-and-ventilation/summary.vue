<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
import { DuctShape, VentType } from "~/schema/api-schema.types";
import { cubicMetrePerHourPerSquareMetre, litrePerSecond } from "~/utils/units/flowRate";
import { metre, millimetre } from "~/utils/units/length";
import { wattsPerMeterKelvin } from "~/utils/units/thermalConductivity";
import { centimetresSquare, metresSquare } from "~/utils/units/area";
import { degrees } from "~/utils/units/angle";
import { pascal } from "~/utils/units/pressure";

const title = "Infiltration and ventilation summary";
const store = useEcaasStore();

const mechanicalVentilationData = store.infiltrationAndVentilation.mechanicalVentilation.data;

const mechanicalVentilationSummary: SummarySection = {
	id: "mechanicalVentilation",
	label: "Mechanical ventilation",
	data: mechanicalVentilationData?.map(x => {
		return {
			"Name": x.data.name,
			"Type of mechanical ventilation": x.data.typeOfMechanicalVentilationOptions,
			"Air flow rate": typeof x.data.airFlowRate === "number" ? `${x.data.airFlowRate} ${litrePerSecond.suffix}` : `${x.data.airFlowRate.amount} ${litrePerSecond.suffix}`,
			...(x.data.typeOfMechanicalVentilationOptions == VentType.MVHR ? {
				"MVHR location": displayCamelToSentenceCase(x.data.mvhrLocation),
				"MVHR efficiency": x.data.mvhrEfficiency,
			} : {})
		};
	}) || [],
	editUrl: getUrl("mechanicalVentilation")
};

const ductworkData = store.infiltrationAndVentilation.ductwork.data;

const ductworkSummary: SummarySection = {
	id: "ductwork",
	label: "Ductwork",
	data: ductworkData?.map(x => {
		const mvhr = store.infiltrationAndVentilation.mechanicalVentilation.data.filter(ventilation => ventilation.data.id === x.data.mvhrUnit);

		return {
			"Name": x.data.name,
			"MVHR unit": mvhr[0]?.data.name,
			"Duct type": displayCamelToSentenceCase(x.data.ductType),
			"Ductwork cross sectional shape": displayCamelToSentenceCase(x.data.ductworkCrossSectionalShape),
			"Internal diameter of ductwork": x.data.ductworkCrossSectionalShape === DuctShape.circular ? `${x.data.internalDiameterOfDuctwork} ${millimetre.suffix}` : undefined,
			"External diameter of ductwork": x.data.ductworkCrossSectionalShape === DuctShape.circular ? `${x.data.externalDiameterOfDuctwork} ${millimetre.suffix}` : undefined,
			"Perimeter of ductwork": x.data.ductworkCrossSectionalShape === DuctShape.rectangular ? `${x.data.ductPerimeter} ${millimetre.suffix}` : undefined,
			"Length of ductwork": `${x.data.lengthOfDuctwork} ${metre.suffix}`,
			"Insulation thickness": `${x.data.insulationThickness} ${millimetre.suffix}`,
			"Thermal conductivity of ductwork insulation": `${x.data.thermalInsulationConductivityOfDuctwork} ${wattsPerMeterKelvin.suffix}`,
			"Surface reflectivity": x.data.surfaceReflectivity ? "Reflective" : "Not reflective"
		};
	}) || [],
	editUrl: getUrl("ductwork")
};

const ventData = store.infiltrationAndVentilation.vents.data;

const ventSummary: SummarySection = {
	id: "vents",
	label: "Vents",
	data: ventData.map(x => {
		return {
			"Name": x.data.name,
			"Type of vent": displayCamelToSentenceCase(x.data.typeOfVent),
			"Effective ventilation area": `${x.data.effectiveVentilationArea} ${centimetresSquare.suffix}`,
			"Vent opening ratio": x.data.openingRatio,
			"Mid height of zone": `${x.data.midHeightOfZone} ${metre.suffix}`,
			"Orientation": `${x.data.orientation} ${degrees.suffix}`,
			"Pitch": `${x.data.pitch} ${degrees.suffix}`
		};
	}),
	editUrl: getUrl("vents")
};

const ventilationData = store.infiltrationAndVentilation.naturalVentilation.data;

const ventilationSummary: SummarySection = {
	id: "ventilation",
	label: "Natural ventilation",
	data: {
		"Ventilation zone height": `${ventilationData.ventilationZoneHeight} ${metre.suffix}`,
		"Dwelling envelope area": `${ventilationData.dwellingEnvelopeArea} ${metresSquare.suffix}`,
		"Elevational height of dwelling at its base": `${ventilationData.dwellingElevationalLevelAtBase} ${metre.suffix}`,
		"Cross ventilation possible": displayBoolean(ventilationData.crossVentilationPossible)
	},
	editUrl: getUrl("naturalVentilation")
};

const airPermeabilityData = store.infiltrationAndVentilation.airPermeability.data;

const airPermeabilitySummary: SummarySection = {
	id: "airPermeability",
	label: "Air permeability",
	data: {
		"Test pressure": `${airPermeabilityData.testPressure} ${pascal.suffix}`,
		"Air tightness test result": `${airPermeabilityData.airTightnessTestResult} ${cubicMetrePerHourPerSquareMetre.suffix}`
	},
	editUrl: getUrl("airPermeability")
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
// 	editUrl: getUrl('combustionAppliances')
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
	<GovButton href="/">Return to overview</GovButton>
</template>
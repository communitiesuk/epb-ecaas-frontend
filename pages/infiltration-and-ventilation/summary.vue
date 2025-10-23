<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";

const title = "Infiltration and ventilation summary";
const store = useEcaasStore();

const mechanicalVentilationData = store.infiltrationAndVentilation.mechanicalVentilation.data;

const mechanicalVentilationSummary: SummarySection = {
	id: "mechanicalVentilation",
	label: "Mechanical ventilation",
	data: mechanicalVentilationData?.map(({ data: x }) => {
		const isMvhr = x.typeOfMechanicalVentilationOptions === "MVHR";
		const mvhrLocation = "mvhrLocation" in x ? displayCamelToSentenceCase(show(x.mvhrLocation)) : emptyValueRendering;
		const mvhrEfficiency = "mvhrEfficiency" in x ? show(x.mvhrEfficiency) : emptyValueRendering;
		return {
			"Name": show(x.name),
			"Type of mechanical ventilation": show(x.typeOfMechanicalVentilationOptions),
			"Air flow rate": dim(x.airFlowRate, "litres per second"),
			"MVHR location": isMvhr ? mvhrLocation : undefined,
			"MVHR efficiency": isMvhr ? mvhrEfficiency : undefined,
		};
	}) || [],
	editUrl: getUrl("mechanicalVentilation"),
};

const ductworkData = store.infiltrationAndVentilation.ductwork.data;

const ductworkSummary: SummarySection = {
	id: "ductwork",
	label: "Ductwork",
	data: ductworkData?.map(({ data: x }) => {
		const mvhr = store.infiltrationAndVentilation.mechanicalVentilation.data.filter(ventilation => ventilation.data.id === x.mvhrUnit);

		const internalDiameterOfDuctwork = "internalDiameterOfDuctwork" in x ? dim(x.internalDiameterOfDuctwork, "millimetres") : emptyValueRendering;
		const externalDiameterOfDuctwork = "externalDiameterOfDuctwork" in x ? dim(x.externalDiameterOfDuctwork, "millimetres") : emptyValueRendering;

		return {
			"Name": x.name,
			"MVHR unit": show(mvhr[0]?.data.name),
			"Duct type": displayCamelToSentenceCase(show(x.ductType)),
			"Ductwork cross sectional shape": displayCamelToSentenceCase(show(x.ductworkCrossSectionalShape)),
			"Internal diameter of ductwork": internalDiameterOfDuctwork, 
			"External diameter of ductwork": externalDiameterOfDuctwork,
			"Length of ductwork": dim(x.lengthOfDuctwork, "metres"),
			"Insulation thickness": dim(x.insulationThickness, "millimetres"),
			"Thermal conductivity of ductwork insulation": dim(x.thermalInsulationConductivityOfDuctwork, "watts per metre kelvin"),
			"Surface reflectivity": displayReflectivity(x.surfaceReflectivity),
		};
	}) || [],
	editUrl: getUrl("ductwork"),
};

const ventData = store.infiltrationAndVentilation.vents.data;

const ventSummary: SummarySection = {
	id: "vents",
	label: "Vents",
	data: ventData.map(({ data: x }) => {
		return {
			"Name": x.name,
			"Type of vent": displayCamelToSentenceCase(show(x.typeOfVent)),
			"Effective ventilation area": dim(x.effectiveVentilationArea, "centimetres square"),
			"Mid height of zone": dim(x.midHeightOfZone, "metres"),
			"Orientation": dim(x.orientation, "degrees"),
			"Pitch": dim(x.pitch, "degrees"),
		};
	}),
	editUrl: getUrl("vents"),
};

const ventilationData = store.infiltrationAndVentilation.naturalVentilation.data;

const ventilationSummary: SummarySection = {
	id: "ventilation",
	label: "Natural ventilation",
	data: {
		"Ventilation zone height": dim(ventilationData.ventilationZoneHeight, "metres"),
		"Dwelling envelope area": dim(ventilationData.dwellingEnvelopeArea, "metres square"),
		"Elevational height of dwelling at its base": dim(ventilationData.dwellingElevationalLevelAtBase, "metres"),
		"Cross ventilation possible": displayBoolean(ventilationData.crossVentilationPossible),
	},
	editUrl: getUrl("naturalVentilation"),
};

const airPermeabilityData = store.infiltrationAndVentilation.airPermeability.data;

const airPermeabilitySummary: SummarySection = {
	id: "airPermeability",
	label: "Air permeability",
	data: {
		"Test pressure": dim(airPermeabilityData.testPressure, "pascal"),
		"Air tightness test result": dim(airPermeabilityData.airTightnessTestResult, "cubic metres per hour per square metre"),
	},
	editUrl: getUrl("airPermeability"),
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
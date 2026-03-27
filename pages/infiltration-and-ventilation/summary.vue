<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl, type VentData } from "#imports";
import { useProductReference } from "~/composables/productReference";
import { installationLocationOptions, installationTypeOptions } from "~/utils/display";

const title = "Infiltration and ventilation summary";
const store = useEcaasStore();

const mechanicalVentilationData = store.infiltrationAndVentilation.mechanicalVentilation.data;

const mechanicalVentilationProductData = await useProductReference(
	mechanicalVentilationData,
	productData => productData.modelName,
);

const associatedItems = Object.fromEntries(useAssociatedItems(["wall", "roof", "window"]));

const mechanicalVentilationSummary: SummarySection = {
	id: "mechanicalVentilation",
	label: "Mechanical ventilation",
	data: mechanicalVentilationData?.map(({ data }) => {
		const x = data as MechanicalVentilationData;
		const isMvhr = x.typeOfMechanicalVentilationOptions === "MVHR";
		const mvhrLocation = "mvhrLocation" in x ? displayCamelToSentenceCase(show(x.mvhrLocation)) : emptyValueRendering;
		return {
			"Name": show(x.name),
			"Type of mechanical ventilation": show(x.typeOfMechanicalVentilationOptions),
			"Design air flow rate": dim(x.airFlowRate, "litres per second"),
			"MVHR location": isMvhr ? mvhrLocation : undefined,
			...(x.typeOfMechanicalVentilationOptions !== "Intermittent MEV" ? {
				"Product reference": x.productReference,
				"Product name": mechanicalVentilationProductData[x.productReference],
			} : {}),
			...((x.typeOfMechanicalVentilationOptions === "MVHR" || x.typeOfMechanicalVentilationOptions === "Centralised continuous MEV") && x.measuredFanPowerAndAirFlowRateKnown ? {
				"Measured fan power": dim(x.measuredFanPower, "watt"),
				"Measured air flow rate": dim(x.measuredAirFlowRate, "litres per second"),
			} : {}),
			...(x.typeOfMechanicalVentilationOptions === "MVHR" ? {
				"MVHR location": displayCamelToSentenceCase(x.mvhrLocation),
				"Mid-height of airflow path for intake": dim(x.midHeightOfAirFlowPathForIntake, "metres"),
				"Orientation of intake": dim(x.orientationOfIntake, "degrees"),
				"Pitch of intake": dim(x.pitchOfIntake, "degrees"),
				"Mid-height of airflow path for exhaust": dim(x.midHeightOfAirFlowPathForExhaust, "metres"),
				"Orientation of exhaust": dim(x.orientationOfExhaust, "degrees"),
				"Pitch of exhaust": dim(x.pitchOfExhaust, "degrees"),
			} : {}),
			...(x.typeOfMechanicalVentilationOptions === "Intermittent MEV" ? {
				"Specific fan power": dim(x.specificFanPower, "watts per litre per second"),
			} : {}),
			...(x.typeOfMechanicalVentilationOptions === "Decentralised continuous MEV" ? {
				"Where is the vent installed?": installationTypeOptions[x.installationType],
				"Room where the vent is installed": installationLocationOptions[x.installationLocation],
			} : {}),
			"Associated wall, roof or window": associatedItems[x.associatedItemId],
			...(!x.hasAssociatedItem ? {
				"Pitch of vent": dim(x.pitch, "degrees"),
				"Orientation of vent": dim(x.orientation, "degrees"),
			} : {}),
			"Is the vent installed under an approved installation scheme?": displayBoolean(x.installedUnderApprovedScheme),
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
const walls = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceWindows } = store.dwellingFabric;

const ventSummary: SummarySection = {
	id: "vents",
	label: "Vents",
	data: ventData.map((vent) => {
		const x = vent.data as VentData;

		const taggedItem = store.getTaggedItem([walls.dwellingSpaceExternalWall, dwellingSpaceWindows], x.associatedItemId);
		const orientation = x.hasAssociatedItem === true ? taggedItem!.orientation : x.orientation;
		const pitch = x.hasAssociatedItem === true ? taggedItem!.pitch : x.pitch;

		return {
			"Name": x.name,
			"Effective ventilation area": dim(x.effectiveVentilationArea, "centimetres square"),
			"Mid height of zone": dim(x.midHeightOfZone, "metres"),
			"Orientation": orientation !== undefined ? dim(orientation, "degrees") : emptyValueRendering,
			"Pitch": pitch !== undefined ? dim(pitch, "degrees") : emptyValueRendering,
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
		"Base height of ventilation zone": dim(ventilationData.baseHeightOfVentilationZone, "metres"),
	},
	editUrl: getUrl("naturalVentilation"),
};

const airPermeabilityData = store.infiltrationAndVentilation.airPermeability.data;

const airPermeabilitySummary: SummarySection = {
	id: "airPermeability",
	label: "Air permeability",
	data: {
		"Type of infiltration pressure test": displayTypeOfInfiltrationPressureTest(airPermeabilityData.testPressure),
		"Air tightness test result": dim(airPermeabilityData.airTightnessTestResult, "cubic metres per hour per square metre"),
	},
	editUrl: getUrl("airPermeability"),
};

const numOfMvhrItems = mechanicalVentilationData.filter(x => x.data.typeOfMechanicalVentilationOptions === "MVHR").length;
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([mechanicalVentilationSummary])">		
		<SummaryTab :summary="mechanicalVentilationSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No mechanical ventilation added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('mechanicalVentilationCreate')">
					Add mechanical ventilation
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-if="numOfMvhrItems > 0" v-slot="tabProps" :items="getTabItems([ductworkSummary])">
		<SummaryTab :summary="ductworkSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No ductwork added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('ductworkCreate')">
					Add ductwork
				</NuxtLink>
			</template>
		</SummaryTab>	
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([ventSummary])">
		<SummaryTab :summary="ventSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No vents added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('ventCreate')">
					Add vents
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([ventilationSummary])">
		<SummaryTab :summary="ventilationSummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([airPermeabilitySummary])">
		<SummaryTab :summary="airPermeabilitySummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>
	<!-- <GovTabs v-slot="tabProps" :items="getTabItems([combustionAppliancesSummary])">
		<SummaryTab :summary="combustionAppliancesSummary" :selected="tabProps.currentTab === 5">
			<template #empty>
				<h2 class="govuk-heading-m">No combustion appliances added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('combustionAppliances')">
					Add combustion appliance
				</NuxtLink>
			</template>
		</SummaryTab> 
	</GovTabs> -->
	<GovButton href="/">Return to overview</GovButton>
</template>
<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';

const title = "Infiltration and ventilation summary";
const store = useEcaasStore();

definePageMeta({ layout: false });

const mechanicalVentilationData = store.infiltrationAndVentilation.mechanicalVentilation.data.mechanicalVentilationObjects;

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
			"Duct tape": x.ductTape,
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
			"Air flow at mid height level": x.airFlowAtMidHeightLevel,
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

const summarySections: SummarySection[] = [
	mechanicalVentilationSummary,
	ventSummary,
	ventilationSummary,
	airPermeabilitySummary
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
		</NuxtLayout>
	</div>
</template>
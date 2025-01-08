<script setup lang="ts">
	import type { SummarySection } from '~/components/GovSummaryCard.vue';

	definePageMeta({ layout: false });

	const title = "Dwelling details summary";
	const store = useEcaasStore();

	const generalSpecificationsData = store.dwellingDetails.generalSpecifications.data;
	const appliancesAndElectricityData = store.dwellingDetails.appliancesAndElectricity.data;

	const generalSpecificationsSummary: SummarySection = {
		id: 'generalSpecifications',
		label: "General specifications",
		data: {
			"Type of residence": generalSpecificationsData.typeOfResidence,
			"Weather data location": generalSpecificationsData.weatherDataLocation,
			"Size of ground floor area": generalSpecificationsData.sizeGroundFloorArea ?
				`${generalSpecificationsData.sizeGroundFloorArea} m²` : undefined,
			"Number of bedrooms": generalSpecificationsData.numOfBedrooms,
			"Number of stories in dwelling": generalSpecificationsData.storiesInDwelling,
			"Shelter": generalSpecificationsData.levelOfShelter,
			"Separate temperature control": generalSpecificationsData.heatingControlType,
			"Cooking fuel type": generalSpecificationsData.cookingFuelType,
			"Cold water source": generalSpecificationsData.coldWaterSource,
			"Number of ADF wet rooms": generalSpecificationsData.numOfADFWetRooms
		}
	};

	const appliancesAndElectricitySummary: SummarySection = {
		id: 'appliancesAndElectricity',
		label: "Appliances and electricity",
		data: {
			"Fridge/freezer energy rating": appliancesAndElectricityData.fridgeFreezerEnergyRating,
			"Dishwasher energy rating": appliancesAndElectricityData.dishwasherEnergyRating,
			"Oven/cooker energy rating": appliancesAndElectricityData.ovenCookerEnergyRating,
			"Washing machine energy rating": appliancesAndElectricityData.washingMachineEnergyRating,
			"Tumble dryer energy rating": appliancesAndElectricityData.tumbleDryerEnergyRating,
			"Electric vehicle charger": appliancesAndElectricityData.electricVehicleCharger,
			"Electricity grid connection": appliancesAndElectricityData.electricityGridConnection,
			"Electricity tariff": appliancesAndElectricityData.electricityTariff
		}
	};

	const hotWaterDistributionSummary: SummarySection = {
		id: 'hotWaterDistribution',
		label: "Hot water distribution",
		data: {}
	}

	const shadingSummary: SummarySection = {
		id: 'shading',
		label: "Shading",
		data: {}
	}

	const summarySections: SummarySection[] = [
		generalSpecificationsSummary,
		appliancesAndElectricitySummary,
		hotWaterDistributionSummary,
		shadingSummary
	];
</script>

<template>
	<div>
		<NuxtLayout name="one-column">
			<Head>
				<Title>{{ title }}</Title>
			</Head>
			<h1 class="govuk-heading-l">{{ title }}</h1>
			<GovSummaryCard :summarySections="summarySections" />
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>

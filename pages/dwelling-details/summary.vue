<script setup lang="ts">
const title = "Dwelling details summary";
const store = useEcaasStore();

const generalSpecificationsData: GeneralSpecificationsData = store.dwellingDetails.generalSpecifications.data;
const appliancesAndElectricityData: AppliancesAndElectricityData = store.dwellingDetails.appliancesAndElectricity.data;

// unsure about types here
// multiple objects or just one object with nested objects 

type summaryData = {
	[key: string]: string | number | boolean | undefined;
};


interface summarySection {
	label: string,
	data: summaryData
}

const generalSpecificationsSummary = {
	label: "General specifications",
	data: {
		"Type of residence": generalSpecificationsData.typeOfResidence,
		"Weather data location": generalSpecificationsData.weatherDataLocation,
		"Size of ground floor area": generalSpecificationsData.sizeGroundFloorArea + " m²",
		"Number of bedrooms": generalSpecificationsData.numOfBedrooms,
		"Number of stories in dwelling": generalSpecificationsData.storiesInDwelling,
		"Shelter": generalSpecificationsData.levelOfShelter,
		"Separate temperature control": generalSpecificationsData.heatingControlType,
		"Cooking fuel type": generalSpecificationsData.cookingFuelType,
		"Cold water source": generalSpecificationsData.coldWaterSource,
		"Number of ADF wet rooms": generalSpecificationsData.numOfADFWetRooms
	}
};

const appliancesAndElectricitySummary = {
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

const hotWaterDistributionSummary = {
	label: "Hot water distribution",
	data: {}
}

const shadingSummary = {
	label: "Shading",
	data: {}

}

const forms: summarySection[] = [generalSpecificationsSummary, appliancesAndElectricitySummary, hotWaterDistributionSummary, shadingSummary]
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovSummaryCard :sectionSummary="forms">
	</GovSummaryCard>
	<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
</template>

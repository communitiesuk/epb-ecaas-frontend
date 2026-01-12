<script setup lang="ts">
import { isEcaasForm } from '#imports';
import formStatus from '~/constants/formStatus';

const title = "Domestic Hot Water";

const page = usePage();
const store = useEcaasStore();

type domesticHotWaterType = keyof typeof store.domesticHotWater;

function handleRemove(domesticHotWaterType: domesticHotWaterType, index: number) {
	
}

/**
    hotWaterCylinder:		Water Storage
	immersionHeater: 		Heat Source
	solarThermal: 			Heat Source
	pointOfUse:				Heat Source
	heatPump: 				Heat Source
	combiBoiler: 			Heat Source
	heatBattery: 			Heat Source
	smartHotWaterTank: 		Water Storage
	heatInterfaceUnit:	    Property of Heat Network

	mixedShower: 		    Outlet
	electricShower: 		Outlet
	bath: 					Outlet
	otherOutlets: 			Outlet

	primaryPipework: 		Pipework

	wwhrs: 					Property of outlets

	//HEAT GENERATION

	
 */


const hwCylinder1: EcaasForm<HotWaterCylinderData> = {
	data: {
		name: "Jasper's Cylinder",
		id: "what",
		heatSource: "weeeeee",
		storageCylinderVolume: {
			amount: 100,
			unit: "litres",
		},
		dailyEnergyLoss: 69,
	},
};

const immersion1: EcaasForm<ImmersionHeaterData> = {
	data: {
		name: "Jasper's Immersion Heater",
		ratedPower: 69,
		heaterPosition: "top",
		thermostatPosition: "middle",
	}
};

store.$patch({
	domesticHotWater: {
		waterHeating: {
			hotWaterCylinder: {
				complete: true,
				data: [hwCylinder1],
			},
			immersionHeater: {
				complete: true,
				data: [immersion1]
			}
		},
	},
});
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<CustomList 
		id="heatSources"
		title="Heat Sources"
		:form-url="`${page?.url!}/heat-sources`"
		:items="Object.values(store.domesticHotWater.waterHeating)
			.flatMap(x=>x.data)
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
	/>
</template>
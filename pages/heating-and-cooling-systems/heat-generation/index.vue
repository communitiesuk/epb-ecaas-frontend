<script setup lang="ts">
import formStatus from "~/constants/formStatus";

const title = "Heat generation";
const page = usePage();
const store = useEcaasStore();

type HeatGenerationType = keyof typeof store.heatingAndCoolingSystems.heatGeneration;

function handleRemove(outletType: HeatGenerationType, index: number) {
	const outlets = store.heatingAndCoolingSystems.heatGeneration[outletType]?.data;

	let heatPumpId;
	if(outletType === "heatPump"){
		heatPumpId = store.heatingAndCoolingSystems.heatGeneration.heatPump?.data[index]?.data.id;
	}

	if (outlets) {
		outlets.splice(index, 1);

		store.$patch((state) => {
			state.heatingAndCoolingSystems.heatGeneration[outletType].data = outlets.length ? outlets : [];
			state.heatingAndCoolingSystems.heatGeneration[outletType].complete = false;
		});

		if(heatPumpId) {
			removeHeatSourceReference(store.domesticHotWater.waterHeating.hotWaterCylinder, heatPumpId);
			removeHeatSourceReference(store.heatingAndCoolingSystems.heatEmitting.wetDistribution, heatPumpId);
		}
	}
} 

function handleComplete() {
	store.$patch({
		heatingAndCoolingSystems: {
			heatGeneration: {
				heatPump: { complete: true },
				boiler: { complete: true },
				heatBattery: { complete: true },
				heatNetwork: { complete: true },
				heatInterfaceUnit: { complete: true },
			},
		},
	});

	navigateTo("/heating-and-cooling-systems");
}

function checkIsComplete(){
	const generators = store.heatingAndCoolingSystems.heatGeneration;
	return Object.values(generators).every(generator => generator.complete);
}

function hasIncompleteEntries() {
	const heatGenerationTypes = store.heatingAndCoolingSystems.heatGeneration;
	
	return Object.values(heatGenerationTypes).some(
		generators => generators.data.some(
			generator => isEcaasForm(generator) ? !generator.complete : false));
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-hint">For now, this service only allows homes to be modelled with a heat pump. In future releases there will be further options.</p>
	<CustomList
		id="heatPump"
		title="Heat pump"
		:form-url="`${page?.url!}/heat-pump`"
		:items="store.heatingAndCoolingSystems.heatGeneration.heatPump.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('heatPump', index)"
	/>
	<!--	<CustomList-->
	<!--		id="boiler"-->
	<!--		title="Boiler"-->
	<!--		:form-url="`${page?.url!}/boiler`"-->
	<!--		:items="store.heatingAndCoolingSystems.heatGeneration.boiler.data.map(x => x.name)"-->
	<!--		@remove="(index: number) => handleRemove('boiler', index)"-->
	<!--	/>-->
	<!--	<CustomList-->
	<!--		id="heatBattery"-->
	<!--		title="Heat battery"-->
	<!--		:form-url="`${page?.url!}/heat-battery`"-->
	<!--		:items="store.heatingAndCoolingSystems.heatGeneration.heatBattery.data.map(x => x.name)"-->
	<!--		@remove="(index: number) => handleRemove('heatBattery', index)"-->
	<!--	/>-->
	<!--	<CustomList-->
	<!--		id="heatNetwork"-->
	<!--		title="Heat network"-->
	<!--		:form-url="`${page?.url!}/heat-network`"-->
	<!--		:items="store.heatingAndCoolingSystems.heatGeneration.heatNetwork.data.map(x => x.name)"-->
	<!--		@remove="(index: number) => handleRemove('heatNetwork', index)"-->
	<!--	/>-->
	<!--	<CustomList-->
	<!--		id="heatInterfaceUnit"-->
	<!--		title="Heat interface unit"-->
	<!--		:form-url="`${page?.url!}/heat-interface-unit`"-->
	<!--		:items="store.heatingAndCoolingSystems.heatGeneration.heatInterfaceUnit.data.map(x => x.name)"-->
	<!--		@remove="(index: number) => handleRemove('heatInterfaceUnit', index)"-->
	<!--	/>-->
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/heating-and-cooling-systems"
			secondary
		>
			Return to heating systems
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" :disabled="hasIncompleteEntries()" @completed="handleComplete"/>
	</div>
</template>

<script setup lang="ts">
import formStatus from "~/constants/formStatus";

const title = "Heat generation";
const page = usePage();
const store = useEcaasStore();

type HeatGenerationType = keyof typeof store.heatingSystems.heatGeneration;

function handleRemove(outletType: HeatGenerationType, index: number) {
	const outlets = store.heatingSystems.heatGeneration[outletType]?.data;

	let heatPumpId;
	if (outletType === "heatPump") {
		heatPumpId = store.heatingSystems.heatGeneration.heatPump?.data[index]?.data.id;
	}

	if (outlets) {
		outlets.splice(index, 1);

		store.$patch((state) => {
			state.heatingSystems.heatGeneration[outletType].data = outlets.length ? outlets : [];
			state.heatingSystems.heatGeneration[outletType].complete = false;
		});

		if (heatPumpId) {
			removeTaggedItemReference(store.domesticHotWater.waterHeating.hotWaterCylinder, heatPumpId, "heatSource");
			removeTaggedItemReference(store.heatingSystems.heatEmitting.wetDistribution, heatPumpId, "heatSource");
		}
	}
}

function handleComplete() {
	store.$patch({
		heatingSystems: {
			heatGeneration: {
				heatPump: { complete: true },
				boiler: { complete: true },
				heatBattery: { complete: true },
				heatNetwork: { complete: true },
				heatInterfaceUnit: { complete: true },
			},
		},
	});

	navigateTo("/heating-systems");
}

function checkIsComplete() {
	const generators = store.heatingSystems.heatGeneration;
	return Object.values(generators).every(generator => generator.complete);
}

function hasIncompleteEntries() {
	const heatGenerationTypes = store.heatingSystems.heatGeneration;

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
	<p class="govuk-hint">For now, this service only allows homes to be modelled with a heat pump. In future releases
		there will be further options.</p>
	<CustomList id="heatPump" title="Heat pump" :form-url="`${page?.url!}/heat-pump`" :items="store.heatingSystems.heatGeneration.heatPump.data.map(x => ({
		name: x.data.name,
		status: x.complete ? formStatus.complete : formStatus.inProgress
	}))" :show-status="true" @remove="(index: number) => handleRemove('heatPump', index)" />
	<!--	<CustomList-->
	<!--		id="boiler"-->
	<!--		title="Boiler"-->
	<!--		:form-url="`${page?.url!}/boiler`"-->
	<!--		:items="store.heatingSystems.heatGeneration.boiler.data.map(x => x.name)"-->
	<!--		@remove="(index: number) => handleRemove('boiler', index)"-->
	<!--	/>-->
	<!--	<CustomList-->
	<!--		id="heatBattery"-->
	<!--		title="Heat battery"-->
	<!--		:form-url="`${page?.url!}/heat-battery`"-->
	<!--		:items="store.heatingSystems.heatGeneration.heatBattery.data.map(x => x.name)"-->
	<!--		@remove="(index: number) => handleRemove('heatBattery', index)"-->
	<!--	/>-->
	<!--	<CustomList-->
	<!--		id="heatNetwork"-->
	<!--		title="Heat network"-->
	<!--		:form-url="`${page?.url!}/heat-network`"-->
	<!--		:items="store.heatingSystems.heatGeneration.heatNetwork.data.map(x => x.name)"-->
	<!--		@remove="(index: number) => handleRemove('heatNetwork', index)"-->
	<!--	/>-->
	<!--	<CustomList-->
	<!--		id="heatInterfaceUnit"-->
	<!--		title="Heat interface unit"-->
	<!--		:form-url="`${page?.url!}/heat-interface-unit`"-->
	<!--		:items="store.heatingSystems.heatGeneration.heatInterfaceUnit.data.map(x => x.name)"-->
	<!--		@remove="(index: number) => handleRemove('heatInterfaceUnit', index)"-->
	<!--	/>-->
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/heating-systems" secondary>
			Return to heating systems
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" :disabled="hasIncompleteEntries()" @completed="handleComplete" />
	</div>
</template>

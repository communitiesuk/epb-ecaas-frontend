<script setup lang="ts">

const title = "Heat generation";
const page = usePage();
const store = useEcaasStore();

type HeatGenerationType = keyof typeof store.heatingSystems.heatGeneration;

function handleRemove(outletType: HeatGenerationType, index: number) {
	const outlets = store.heatingSystems.heatGeneration[outletType]?.data;

	if (outlets) {
		outlets.splice(index, 1);

		store.$patch((state) => {
			state.heatingSystems.heatGeneration[outletType]!.data = outlets.length ? outlets : [];
			state.heatingSystems.heatGeneration[outletType]!.complete = outlets.length > 0;
		});
	}
} 


</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<GovCustomList
		id="heatPump"
		title="Heat pump"
		:form-url="`${page?.url!}/heat-pump`"
		:items="store.heatingSystems.heatGeneration.heatPump.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('heatPump', index)"
	/>
	<GovCustomList
		id="boiler"
		title="Boiler"
		:form-url="`${page?.url!}/boiler`"
		:items="store.heatingSystems.heatGeneration.boiler.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('boiler', index)"
	/>
	<GovCustomList
		id="heatBattery"
		title="Heat battery"
		:form-url="`${page?.url!}/heat-battery`"
		:items="store.heatingSystems.heatGeneration.heatBattery.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('heatBattery', index)"
	/>
	<GovCustomList
		id="heatNetwork"
		title="Heat network"
		:form-url="`${page?.url!}/heat-network`"
		:items="store.heatingSystems.heatGeneration.heatNetwork.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('heatNetwork', index)"
	/>
	<GovCustomList
		id="heatInterfaceUnit"
		title="Heat interface unit"
		:form-url="`${page?.url!}/heat-interface-unit`"
		:items="store.heatingSystems.heatGeneration.heatInterfaceUnit.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('heatInterfaceUnit', index)"
	/>
	<GovButton
		href="/heating-systems"
		secondary
	>
		Return to overview
	</GovButton>
</template>

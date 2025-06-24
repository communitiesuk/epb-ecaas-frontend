<script lang="ts" setup>
import type { TabItem } from '~/components/gov/Tabs.vue';

const store = useEcaasStore();
const { lastResult: result } = store.$state;
const tabs: TabItem[] = [
	{id: 'primary_tab', label: 'Primary outputs'},
	{id: 'energy_demand_tab', label: 'Energy demand'},
	{id: 'delivered_energy_use_tab', label: 'Delivered energy use'},
	{id: 'energy_use_by_fuel', label: 'Energy use by fuel'}
];
</script>

<template>
	<template v-if="!result">
		<p class="govuk-body">There are no results yet to show.</p>
	</template>
	<template v-if="result?.resultType === 'ok'">
		<p class="govuk-body">The figures shown are per year.</p>
		<GovTabs v-slot="tabProps" :items="tabs">
			<ResultPrimaryOutputTab :selected="tabProps.currentTab === 0" :data="result.response" />
			<ResultEnergyDemandTab :selected="tabProps.currentTab === 1" :data="result?.response?.energy_demand!" />
			<ResultDeliveredEnergyUseTab :selected="tabProps.currentTab === 2" :data="result?.response?.delivered_energy_use!" />
			<ResultEnergyUseByFuelTab :selected="tabProps.currentTab === 3" :data="result?.response?.energy_use_by_fuel!" />
		</GovTabs>
	</template>
	<template v-if="result?.resultType === 'err'">
		<p class="govuk-body">There were errors as follows:</p>
		<template v-for="(error, i) in result.errors" :key="i">
			<pre>{{ error.detail }}</pre>
		</template>
	</template>
</template>

<style lang="css">
pre {
    white-space: pre-wrap;
}
</style>

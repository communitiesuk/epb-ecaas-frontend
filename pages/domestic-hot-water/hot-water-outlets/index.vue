<script setup lang="ts">
import type { BathData, ElectricShowerData, MixedShowerData, OtherHotWaterOutletData } from '~/stores/ecaasStore.types';

const title = "Hot water outlets";
const page = usePage();
const store = useEcaasStore();

type HotWaterOutletType = keyof typeof store.domesticHotWater.hotWaterOutlets;
interface HotWaterOutletData extends MixedShowerData, ElectricShowerData, BathData, OtherHotWaterOutletData {};

function handleRemove(outletType: HotWaterOutletType, index: number) {
	const outlets = store.domesticHotWater.hotWaterOutlets[outletType]?.data;

	if (outlets) {
		outlets.splice(index, 1);

		store.$patch((state) => {
			state.domesticHotWater.hotWaterOutlets[outletType]!.data = outlets.length ? outlets : [];
			state.domesticHotWater.hotWaterOutlets[outletType]!.complete = false;
		});
	}
} 

function handleDuplicate<T extends HotWaterOutletData>(outletType: HotWaterOutletType, index: number) {
	const outlets  = store.domesticHotWater.hotWaterOutlets[outletType]?.data;
	const outlet = outlets?.[index];
    
	if (outlet) {
		const duplicates = outlets.filter(f => f.name.match(duplicateNamePattern(outlet.name)));

		store.$patch((state) => {
			const newItem = {
				...outlet,
				name: `${outlet.name} (${duplicates.length})`
			} as T;

			state.domesticHotWater.hotWaterOutlets[outletType]!.data.push(newItem);
			state.domesticHotWater.hotWaterOutlets[outletType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		domesticHotWater: {
			hotWaterOutlets: {
				mixedShower: { complete: true },
				electricShower: { complete: true },
				bath: { complete: true },
				otherOutlets: { complete: true }
			}
		}
	});
	navigateTo('/domestic-hot-water');
}


function checkIsComplete() {
	const outlets = store.domesticHotWater.hotWaterOutlets;
	return Object.values(outlets).every(outlet => outlet.complete);
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList
		id="mixedShower"
		title="Mixed shower"
		:form-url="`${page?.url!}/mixed-shower`"
		:items="store.domesticHotWater.hotWaterOutlets.mixedShower.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('mixedShower', index)"
		@duplicate="(index: number) => handleDuplicate('mixedShower', index)"
	/>
	<CustomList
		id="electricShower"
		title="Instant electric shower"
		:form-url="`${page?.url!}/electric-shower`"
		:items="store.domesticHotWater.hotWaterOutlets.electricShower.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('electricShower', index)"
		@duplicate="(index: number) => handleDuplicate('electricShower', index)"
	/>
	<CustomList
		id="bath"
		title="Bath"
		:form-url="`${page?.url!}/bath`"
		:items="store.domesticHotWater.hotWaterOutlets.bath.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('bath', index)"
		@duplicate="(index: number) => handleDuplicate('bath', index)"
	/>
	<CustomList
		id="otherOutlets"
		title="Other"
		hint="(basin tap, kitchen sink etc)"
		:form-url="`${page?.url!}/other`"
		:items="store.domesticHotWater.hotWaterOutlets.otherOutlets.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('otherOutlets', index)"
		@duplicate="(index: number) => handleDuplicate('otherOutlets', index)"
	/>

	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/domestic-hot-water"
			secondary
		>
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>
	</div>
</template>

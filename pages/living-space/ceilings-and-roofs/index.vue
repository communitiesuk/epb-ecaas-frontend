<script setup lang="ts">
const title = "Ceilings and roofs";
const page = usePage();
const store = useEcaasStore();

type CeilingAndRoofType = keyof typeof store.livingSpaceFabric.livingSpaceCeilingsAndRoofs;
interface CeilingAndRoofData extends CeilingData, RoofData {};

function handleRemove(ceilingAndRoofType: CeilingAndRoofType, index: number) {
	const items = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs[ceilingAndRoofType]?.data;

	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.livingSpaceFabric.livingSpaceCeilingsAndRoofs[ceilingAndRoofType]!.data = items.length ? items : [];
			state.livingSpaceFabric.livingSpaceCeilingsAndRoofs[ceilingAndRoofType]!.complete = items.length > 0;
		});
	}
} 

function handleDuplicate<T extends CeilingAndRoofData>(ceilingAndRoofType: CeilingAndRoofType, index: number) {
	const items  = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs[ceilingAndRoofType]?.data;
	const item = items?.[index];
    
	if (item) {
		const duplicates = items.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			} as T;

			state.livingSpaceFabric.livingSpaceCeilingsAndRoofs[ceilingAndRoofType]!.data.push(newItem);
		});
	}
}

function handleComplete() {
	store.$patch({
		livingSpaceFabric: {
			livingSpaceCeilingsAndRoofs: {
				livingSpaceCeilings: { complete: true },
				livingSpaceRoofs: { complete: true },
				livingSpaceUnheatedPitchedRoofs: { complete: true }
			}
		}
	});

	navigateTo('/living-space');
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
		id="ceilings"
		title="Ceilings"
		:form-url="`${page?.url!}/ceilings`"
		:items="store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceCeilings.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceCeilings', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceCeilings', index)"
	/>
	<GovCustomList
		id="roofs"
		title="Roofs"
		:form-url="`${page?.url!}/roofs`"
		:items="store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceRoofs?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceRoofs', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceRoofs', index)"
	/>
	<GovCustomList
		id="unheatedPitchedRoofs"
		title="Unheated pitched roof"
		:form-url="`${page?.url!}/unheated-pitched-roofs`"
		:items="store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceUnheatedPitchedRoofs?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceUnheatedPitchedRoofs', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceUnheatedPitchedRoofs', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/living-space"
			secondary
		>
			Return to overview
		</GovButton>
		<GovButton data-testid="completeSection" @click="handleComplete">
			Mark section as complete
		</GovButton>
	</div>
</template>

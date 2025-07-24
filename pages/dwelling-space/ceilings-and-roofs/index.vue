<script setup lang="ts">
const title = "Ceilings and roofs";
const page = usePage();
const store = useEcaasStore();

type CeilingAndRoofType = keyof typeof store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
type CeilingAndRoofData = CeilingData & RoofData;

function handleRemove(ceilingAndRoofType: CeilingAndRoofType, index: number) {
	const items = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]?.data;

	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]!.data = items.length ? items : [];
			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]!.complete = false;
		});
	}
} 

function handleDuplicate<T extends CeilingAndRoofData>(ceilingAndRoofType: CeilingAndRoofType, index: number) {
	const items  = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]?.data;
	const item = items?.[index];
    
	if (item) {
		const duplicates = items.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			} as T;

			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]!.data.push(newItem);
			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceCeilingsAndRoofs: {
				dwellingSpaceCeilings: { complete: true },
				dwellingSpaceRoofs: { complete: true },
				dwellingSpaceUnheatedPitchedRoofs: { complete: true }
			}
		}
	});

	navigateTo('/dwelling-space');
}
function checkIsComplete(){
	const ceilingsAndRoofs = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
	return Object.values(ceilingsAndRoofs).every(ceilingAndRoof => ceilingAndRoof.complete);
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
		id="ceilings"
		title="Ceilings"
		:form-url="`${page?.url!}/ceilings`"
		:items="store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceCeilings', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceCeilings', index)"
	/>
	<CustomList
		id="roofs"
		title="Roofs"
		:form-url="`${page?.url!}/roofs`"
		:items="store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceRoofs', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceRoofs', index)"
	/>
	<CustomList
		id="unheatedPitchedRoofs"
		title="Unheated pitched roof"
		hint="For unheated pitch roofs, input both the ceiling and roof details here"
		:form-url="`${page?.url!}/unheated-pitched-roofs`"
		:items="store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceUnheatedPitchedRoofs?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceUnheatedPitchedRoofs', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceUnheatedPitchedRoofs', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/dwelling-space"
			secondary
		>
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>
	</div>
</template>

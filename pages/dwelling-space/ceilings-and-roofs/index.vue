<script setup lang="ts">
import { isEcaasForm } from "~/stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";

const title = "Ceilings and roofs";
const page = usePage();
const store = useEcaasStore();

type CeilingAndRoofType = keyof typeof store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
type CeilingAndRoofData = EcaasForm<CeilingData> & EcaasForm<RoofData>;

function handleRemove(ceilingAndRoofType: CeilingAndRoofType, index: number) {
	const items = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]?.data;

	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType].data = items.length ? items : [];
			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType].complete = false;
		});
	}
} 

function handleDuplicate<T extends CeilingAndRoofData>(ceilingAndRoofType: CeilingAndRoofType, index: number) {
	const items  = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]?.data;
	const item = items?.[index];
	let name: string;

	if (item) {
		const duplicates = items.filter(f => {
			if (isEcaasForm(f) && isEcaasForm(item)) {
				name = item.data.name;
				return f.data.name.match(duplicateNamePattern(item.data.name));
			}
			return false;
		});

		store.$patch((state) => {
			const newItem = {
				complete: item.complete,
				data: {
					...item.data,
					name: `${name} (${duplicates.length})`
				}
			} as T;

			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType].data.push(newItem);
			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceCeilingsAndRoofs: {
				dwellingSpaceCeilings: { complete: true },
				dwellingSpaceRoofs: { complete: true }
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
	<p class="govuk-hint">For ceilings next to roofs, both ceiling and roof details should be inputted as one roof element. Where you have a multiple storey dwelling, internal floors should be inputted as floors or ceilings. You do not need to enter both.</p>
	<CustomList
		id="ceilings"
		title="Ceilings"
		:form-url="`${page?.url!}/ceilings`"
		:items="store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceCeilings', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceCeilings', index)"
	/>
	<CustomList
		id="roofs"
		title="Roofs"
		:form-url="`${page?.url!}/roofs`"
		:items="store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		@remove="(index: number) => handleRemove('dwellingSpaceRoofs', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceRoofs', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/dwelling-space"
			secondary
		>
			Return to dwelling space
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>
	</div>
</template>

<script setup lang="ts">
import { isEcaasForm } from "~/stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";
import { v4 as uuidv4 } from "uuid";

const title = "Ceilings and roofs";
const page = usePage();
const store = useEcaasStore();
const { dwellingSpaceExternalGlazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
const { dwellingSpaceExternalUnglazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
const { dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
const { dwellingSpaceWindows } = store.dwellingFabric;


type CeilingAndRoofType = keyof typeof store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
type CeilingAndRoofData = EcaasForm<CeilingData> & EcaasForm<RoofData>;

function handleRemove(ceilingAndRoofType: CeilingAndRoofType, index: number) {
	const items = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]?.data;

	const roofId = ceilingAndRoofType === "dwellingSpaceRoofs" && store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data[index]?.data.id;
	const ceilingId = ceilingAndRoofType === "dwellingSpaceCeilings" && store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data[index]?.data.id;

	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType].data = items.length ? items : [];
			state.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType].complete = false;
		});
		if (roofId) {
			store.removeTaggedAssociations()([dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor], roofId);
			store.removeTaggedAssociations()([dwellingSpaceWindows], roofId, "taggedItem");
		}
		if (ceilingId) {
			store.removeTaggedAssociations()([dwellingSpaceInternalDoor], ceilingId);
		}
	}
}

function handleDuplicate<T extends CeilingAndRoofData>(ceilingAndRoofType: CeilingAndRoofType, index: number) {
	const items = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[ceilingAndRoofType]?.data;
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
					id: "id" in item.data ? uuidv4() : {},
					name: `${name} (${duplicates.length})`,
				},
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
				dwellingSpaceRoofs: { complete: true },
			},
		},
	});

	navigateTo("/dwelling-fabric");
}

const hasIncompleteEntries = () =>
	Object.values(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs)
		.some(section => section.data.some(item => isEcaasForm(item) && !item.complete));

</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-hint">For ceilings next to roofs, both ceiling and roof details should be inputted as one roof
		element. Where you have a multiple storey dwelling, internal floors should be inputted as floors or ceilings. You do
		not need to enter both.</p>
	<CustomList
		id="ceilings" title="Ceilings" :form-url="`${page?.url!}/ceilings`" :items="store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))" :show-status="true" @remove="(index: number) => handleRemove('dwellingSpaceCeilings', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceCeilings', index)" />
	<CustomList
		id="roofs" title="Roofs" :form-url="`${page?.url!}/roofs`" :items="store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))" :show-status="true" @remove="(index: number) => handleRemove('dwellingSpaceRoofs', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceRoofs', index)" />
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/dwelling-fabric" secondary>
			Return to dwelling space
		</GovButton>
		<CompleteElement
			:is-complete="Object.values(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs).every(section => section.complete)"
			:disabled="hasIncompleteEntries()" @completed="handleComplete" />
	</div>
</template>

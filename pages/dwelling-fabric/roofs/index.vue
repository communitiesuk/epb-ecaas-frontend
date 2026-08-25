<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import formStatus from "~/constants/formStatus";
import { page as pages } from "~/data/pages/pages";
import { isEcaasForm } from "~/stores/ecaasStore.schema";

const title = "Roofs";
const page = usePage();
const store = useEcaasStore();

const { dwellingSpaceExternalGlazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
const { dwellingSpaceExternalUnglazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
const { dwellingSpaceWindows } = store.dwellingFabric;

function handleRemove(index: number) {
	const items = store.dwellingFabric.dwellingSpaceRoofs.data;
	const roofId = store.dwellingFabric.dwellingSpaceRoofs.data[index]?.data.id;

	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceRoofs.data = items.length ? items : [];
			state.dwellingFabric.dwellingSpaceRoofs.complete = false;
		});

		if (roofId) {
			store.removeTaggedAssociations()([dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor], roofId);
			store.removeTaggedAssociations()([dwellingSpaceWindows], roofId, "taggedItem");
		}
	}
}

function handleDuplicate<T extends EcaasForm<RoofData>>(index: number) {
	const items = store.dwellingFabric.dwellingSpaceRoofs.data;
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

			state.dwellingFabric.dwellingSpaceRoofs.data.push(newItem);
			state.dwellingFabric.dwellingSpaceRoofs.complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceRoofs: {
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-fabric");
}

const hasIncompleteEntries = () => store.dwellingFabric.dwellingSpaceRoofs.data.some(x => !x.complete);
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<div class="govuk-inset-text">
		<p class="govuk-body">Enter information about ceilings at the edge of the thermal envelope, for example next to loft spaces or roofs, as part of a roof element</p>
	</div>
	<CustomList
		id="roofs"
		title="Roofs"
		:form-url="page?.url!"
		:items="store.dwellingFabric.dwellingSpaceRoofs.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove(index)"
		@duplicate="(index: number) => handleDuplicate(index)" />
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton :href="pages('dwellingFabric').url" secondary>
			Return to dwelling fabric
		</GovButton>
		<GovButton :href="pages('dwellingFabricSummary').url" secondary>
			View summary
		</GovButton>
		<CompleteElement
			:is-complete="!hasIncompleteEntries()"
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete" />
	</div>
</template>

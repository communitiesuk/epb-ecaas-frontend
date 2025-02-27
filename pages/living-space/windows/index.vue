<script setup lang="ts">
const title = "Windows";
const page = usePage();
const store = useEcaasStore();

const { windowObjects = [] } = store.livingSpaceFabric.livingSpaceWindows.data;

function handleRemove(index: number) {
	windowObjects.splice(index, 1);

	store.$patch({
		livingSpaceFabric: {
			livingSpaceWindows: {
				data: {
					windowObjects: windowObjects.length ? windowObjects : undefined
				}
			}
		}
	});
}

function handleDuplicate(index: number) {
	const window = windowObjects[index];

	if (window) {
		const duplicates = windowObjects.filter(s => s.name.match(duplicateNamePattern(window.name)));

		store.$patch((state) => {
			state.livingSpaceFabric.livingSpaceWindows.data.windowObjects?.push({
				...window,
				name: `${window.name} (${duplicates.length})`
			});
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
		id="windows"
		title="Window"
		:form-url="page?.url!"
		:items="store.livingSpaceFabric.livingSpaceWindows.data.windowObjects?.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<GovButton
		href="/living-space"
		secondary
	>
		Return to living space overview
	</GovButton>
</template>

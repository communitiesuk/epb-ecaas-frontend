<script setup lang="ts">
const title = "Windows";
const page = usePage();
const store = useEcaasStore();

function handleRemove(index: number) {
	const windows = store.livingSpaceFabric.livingSpaceWindows.data;

	if (windows) {
		windows.splice(index, 1);

		store.$patch((state) => {
			state.livingSpaceFabric.livingSpaceWindows.data = windows.length ? windows : [];
			state.livingSpaceFabric.livingSpaceWindows.complete = windows.length > 0;
		});
	}
}

function handleDuplicate(index: number) {
	const windows  = store.livingSpaceFabric.livingSpaceWindows.data;
	const window = windows[index];
    
	if (window) {
		const duplicates = windows.filter(f => f.name.match(duplicateNamePattern(window.name)));

		store.$patch((state) => {
			const newWindow = {
				...window,
				name: `${window.name} (${duplicates.length})`
			};

			state.livingSpaceFabric.livingSpaceWindows.data.push(newWindow);
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
		:items="store.livingSpaceFabric.livingSpaceWindows.data.map(x => x.name)"
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

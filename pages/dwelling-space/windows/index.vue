<script setup lang="ts">
const title = "Windows";
const page = usePage();
const store = useEcaasStore();

const { data = [] } = store.dwellingFabric.dwellingSpaceWindows;

function handleRemove(index: number) {
	data.splice(index, 1);

	store.$patch({
		dwellingFabric: {
			dwellingSpaceWindows: {
				data,
				complete: false
			}
		}
	});
}

function handleDuplicate(index: number) {
	const window = data[index];

	if (window) {
		const duplicates = data.filter(s => s.name.match(duplicateNamePattern(window.name)));

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceWindows.data.push({
				...window,
				name: `${window.name} (${duplicates.length})`
			});
		});
		store.dwellingFabric.dwellingSpaceWindows.complete = false;
	}
}

function handleComplete() {
	store.dwellingFabric.dwellingSpaceWindows.complete = true;
	navigateTo('/dwelling-space');
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
		id="windows"
		title="Window"
		:form-url="page?.url!"
		:items="store.dwellingFabric.dwellingSpaceWindows.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/dwelling-space">
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="store.dwellingFabric.dwellingSpaceWindows?.complete ?? false" @completed="handleComplete"/>
	</div>
</template>

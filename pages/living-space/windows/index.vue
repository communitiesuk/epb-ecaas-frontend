<script setup lang="ts">
const title = "Windows";
const page = usePage();
const store = useEcaasStore();

const { data = [] } = store.livingSpaceFabric.livingSpaceWindows;

function handleRemove(index: number) {
	data.splice(index, 1);

	store.$patch({
		livingSpaceFabric: {
			livingSpaceWindows: {
				data,
				complete: data.length > 0
			}
		}
	});
}

function handleDuplicate(index: number) {
	const window = data[index];

	if (window) {
		const duplicates = data.filter(s => s.name.match(duplicateNamePattern(window.name)));

		store.$patch((state) => {
			state.livingSpaceFabric.livingSpaceWindows.data.push({
				...window,
				name: `${window.name} (${duplicates.length})`
			});
		});
	}
}

function handleComplete() {
	store.$patch({
		livingSpaceFabric: {
			livingSpaceWindows: { complete: true }
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
		id="windows"
		title="Window"
		:form-url="page?.url!"
		:items="store.livingSpaceFabric.livingSpaceWindows.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
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

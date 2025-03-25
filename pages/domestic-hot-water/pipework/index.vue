<script setup lang="ts">
const title = "Pipework";
const page = usePage();
const store = useEcaasStore();

const { data = [] } = store.domesticHotWater.pipework;

function handleRemove(index: number) {
	data.splice(index, 1);

	store.$patch({
		domesticHotWater: {
			pipework: {
				data,
				complete: data.length > 0
			}
		}
	});
}

function handleDuplicate(index: number) {
	const pipework = data[index];

	if (pipework) {
		const duplicates = data.filter(d => d.name.match(duplicateNamePattern(pipework.name)));

		store.$patch((state) => {
			state.domesticHotWater.pipework.data.push({
				...pipework,
				name: `${pipework.name} (${duplicates.length})`
			});
		});
	}
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovCustomList
		id="secondary"
		title="Secondary Pipework"
		:form-url="`${page?.url!}/secondary`"
		:items="store.domesticHotWater.pipework.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<GovButton href="/domestic-hot-water" secondary>Return to overview</GovButton>
</template>

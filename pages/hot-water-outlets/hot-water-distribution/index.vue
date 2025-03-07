<script setup lang="ts">
const title = "Hot water distribution";
const page = usePage();
const store = useEcaasStore();

const { data = [] } = store.hotWaterOutlets.hotWaterDistribution;

function handleRemove(index: number) {
	data.splice(index, 1);

	store.$patch({
		hotWaterOutlets: {
			hotWaterDistribution: {
				data,
				complete: data.length > 0
			}
		}
	});
}

function handleDuplicate(index: number) {
	const distribution = data[index];

	if (distribution) {
		const duplicates = data.filter(d => d.name.match(duplicateNamePattern(distribution.name)));

		store.$patch((state) => {
			state.hotWaterOutlets.hotWaterDistribution.data.push({
				...distribution,
				name: `${distribution.name} (${duplicates.length})`
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
		id="hotwater"
		title="Hot water distribution"
		:form-url="page?.url!"
		:items="store.hotWaterOutlets.hotWaterDistribution.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<GovButton href="/hot-water-outlets" secondary>Return to overview</GovButton>
</template>

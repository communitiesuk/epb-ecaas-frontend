<script setup lang="ts">
const title = "Hot water distribution";
const page = usePage();
const store = useEcaasStore();

const { distributions = [] } = store.hotWaterOutlets.hotWaterDistribution.data;

function handleRemove(index: number) {
	distributions.splice(index, 1);

	store.$patch({
		hotWaterOutlets: {
			hotWaterDistribution: {
				data: {
					distributions: distributions.length ? distributions : undefined
				}
			}
		}
	});
}

function handleDuplicate(index: number) {
	const distribution = distributions[index];

	if (distribution) {
		const duplicates = distributions.filter(d => d.name.match(duplicateNamePattern(distribution.name)));

		store.$patch((state) => {
			state.hotWaterOutlets.hotWaterDistribution.data.distributions?.push({
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
		:items="store.hotWaterOutlets.hotWaterDistribution.data.distributions?.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<GovButton href="/hot-water-outlets" secondary>Return to overview</GovButton>
</template>

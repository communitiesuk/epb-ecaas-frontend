<script setup lang="ts">
	const title = "Hot water distributions";
	const page = usePage();
	const store = useEcaasStore();

	const { distributions = [] } = store.dwellingDetails.hotWaterDistribution.data;

	function handleRemove(index: number) {
		distributions.splice(index, 1);

		store.$patch({
			dwellingDetails: {
				hotWaterDistribution: {
					data: {
						distributions: distributions.length ? distributions : undefined
					}
				}
			}
		});
	}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
    <GovCustomList
        title="Shading"
        :form-url="page?.url!"
        :items="store.dwellingDetails.hotWaterDistribution.data.distributions?.map(x => x.name)"
        v-on:remove="handleRemove"
    />
	<GovButton href="/dwelling-details" secondary>Return to overview</GovButton>
</template>
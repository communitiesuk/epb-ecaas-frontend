<script setup lang="ts">
const title = "MVHR ductwork";
const page = usePage();
const store = useEcaasStore();

const { data } = store.infiltrationAndVentilation.ductwork;

function handleRemove(index: number) {
	data.splice(index, 1);

	store.$patch({
		infiltrationAndVentilation: {
			ductwork: {
				data: data.length ? data : undefined,
				complete: data.length > 0,
			},
		},
	});
}

function handleDuplicate(index: number) {
	const ductwork = data[index];
	if (ductwork) {
		const duplicates = data.filter((x) =>
			x.name.match(duplicateNamePattern(ductwork.name))
		);
		store.$patch((state) => {
			state.infiltrationAndVentilation.ductwork.data?.push({
				...ductwork,
				name: `${ductwork.name} (${duplicates.length})`,
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
		id="ductwork"
		title="Ductwork"
		:form-url="page?.url!"
		:items="store.infiltrationAndVentilation.ductwork.data?.map((x) => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<GovButton href="/infiltration-and-ventilation" secondary>
		Return to overview
	</GovButton>
</template>

<script setup lang="ts">
const title = "Waste water heat recovery (WWHRS)";
const page = usePage();
const store = useEcaasStore();


function handleRemove(index: number) {
	const { data } = store.domesticHotWaterNew.wwhrs;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.domesticHotWaterNew.wwhrs.data = data.length ? data : [];
			state.domesticHotWaterNew.wwhrs.complete = false;
		});
	}
}

function handleDuplicate(index: number) {
	const { data } = store.domesticHotWaterNew.wwhrs;
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`,
			};

			state.domesticHotWaterNew.wwhrs.data.push(newItem);
		});
		store.domesticHotWaterNew.wwhrs.complete = false;
	}
}
function handleComplete() {
	store.$patch({
		domesticHotWaterNew: {
			wwhrs: { complete: true },
		},
	});
		
	navigateTo("/domestic-hot-water");		
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
		id="wwhrs"
		title="WWHRS"
		:form-url="page?.url!"
		:items="store.domesticHotWaterNew.wwhrs.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/domestic-hot-water" secondary>
			Return to domestic hot water
		</GovButton>
		<CompleteElement :is-complete="store.domesticHotWaterNew.wwhrs?.complete ?? false" @completed="handleComplete"/>
	</div>
</template>

<script setup lang="ts">
const title = "Waste water heat recovery (WWHRS)";
const page = usePage();
const store = useEcaasStore();


function handleRemove(index: number) {
	const { data } = store.domesticHotWater.wwhrs;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.domesticHotWater.wwhrs.data = data.length ? data : [];
			state.domesticHotWater.wwhrs.complete = false;
		});
	}
}

function handleDuplicate(index: number) {
	const { data } = store.domesticHotWater.wwhrs;
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			};

			state.domesticHotWater.wwhrs.data.push(newItem);
		});
		store.domesticHotWater.wwhrs.complete = false;
	}
}
function handleComplete() {
	store.$patch({
		domesticHotWater: {
			wwhrs: { complete: true }
		}
	});
		
	navigateTo('/domestic-hot-water');		
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
		id="wwhrs"
		title="WWHRS"
		:form-url="page?.url!"
		:items="store.domesticHotWater.wwhrs.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/domestic-hot-water" secondary>
			Return to overview
		</GovButton>
		<GovCompleteElement :is-complete="store.domesticHotWater.wwhrs?.complete ?? false" @completed="handleComplete"/>
	</div>
</template>

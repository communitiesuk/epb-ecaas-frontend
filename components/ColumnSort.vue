<script setup lang="ts">
const { field } = defineProps<{ label: string; field: ProductSortOption }>();

const route = useRoute();

const currentField = ref(route.query?.sort);
const order = ref(route.query?.order as ProductOrderOption | undefined);

const sortUrl = computed(() => {
	let nextOrder = order.value;

	if (field !== currentField.value || order.value === undefined) {
		nextOrder = "asc";
	} else {
		nextOrder = order.value === "asc" ? "desc" : "asc";
	}

	const query = {
		...route.query,
		sort: field,
		order: nextOrder,
	};

	const params = new URLSearchParams(query);

	return `${route.path}?${params}`;
});

watch(route, (currentRoute, _previousRoute) => {
	currentField.value = currentRoute.query.sort;
	order.value = currentRoute.query.order as ProductOrderOption | undefined;
});
</script>

<template>
	<NuxtLink class="govuk-link govuk-link--no-underline column-sort__link" :to="sortUrl">
		{{ label }}
		<div v-if="currentField !== field" class="column-sort__unsorted">
			<span>&#9662;</span>
			<span>&#9662;</span>
		</div>
		<span v-else :class="`column-sort__sort ${order === 'asc' ? 'column-sort__sort--asc' : 'column-sort__sort--desc'}`">&#9652;</span>
	</NuxtLink>
</template>

<style scoped lang="scss">
.column-sort__link {
	color:  #1d70b8;
	display: flex;
	align-items: center;
	gap: 5px;

	&:hover {
		text-decoration: none;
	}
}

.column-sort__unsorted {
	font-size: 14px;
	display: flex;
	flex-direction: column;
	gap: 3px;

	span {
		line-height: 2px;
	}

	span:nth-child(1) {
		transform: rotateX(180deg);
	}
}

.column-sort__sort {
	font-size: 14px;
	height: 22px;
}

.column-sort__sort--asc {
	transform: rotateX(180deg);
}
</style>
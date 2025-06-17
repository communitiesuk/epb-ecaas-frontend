
export default defineNuxtPlugin(() => {
	const store = useEcaasStore();

	store.$subscribe(async (_, state) => {
		try {
			await $fetch("/api/setState", {
				method: "POST",
				body: state,
			});
		} catch (error) {
			console.error("Failed to add data to cache", error);
		}
	});
});


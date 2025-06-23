export const syncCacheToLocalStorage = async () => {
	if (!localStorage.getItem("ecaas")) {
		const cachedData = await $fetch("/api/getState", { method: "GET" });

		if (cachedData) {
			localStorage.setItem("ecaas", JSON.stringify(cachedData));
		} else {
			console.log("No cached data");
		}
	}
};

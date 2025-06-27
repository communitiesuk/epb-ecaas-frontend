export const syncCacheToLocalStorage = async () => {
	try {
		if (!localStorage.getItem("ecaas")) {
			const cachedData = await $fetch("/api/getState", { method: "GET" });
			console.log(cachedData, "cachedData")

			if (cachedData) {
				localStorage.setItem("ecaas", JSON.stringify(cachedData));
			} else {
				console.log("No cached data");
			}
		}
	} catch (error) {
		console.error(`Failed to fetch data: ${error}`);
	}
};

export const syncCacheToLocalStorage = async () => {
	console.log("inside syncCacheToLocalStorage");
	console.log(localStorage.getItem("ecaas"), "localStorage - ecaas");

	try {
		if (!localStorage.getItem("ecaas")) {
			const cachedData = await $fetch("/api/getState", { method: "GET" , cache: "no-store"});
			console.log(cachedData, "cachedData");

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

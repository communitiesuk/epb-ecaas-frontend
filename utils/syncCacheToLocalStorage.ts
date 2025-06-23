export const syncCacheToLocalStorage = async () => {

	if(localStorage.getItem("ecaas")){
		return;
	}
	const cachedData = await $fetch("/api/getState",{ method: "GET"});
	if(cachedData) {
		localStorage.setItem("ecaas", JSON.stringify(cachedData));
	}
};

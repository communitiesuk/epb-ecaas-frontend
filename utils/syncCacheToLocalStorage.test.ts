describe("syncCacheToLocalStorage", () => {
	//if is local storage - gets it
	//no local storage - fetches cached data and adds it to local storage
	//test error

	const mockResponse = {test: "value"};
	global.$fetch = vi.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve(mockResponse),
		}),
	)as unknown as typeof global.$fetch;
  

	const getItemSpy = vi.spyOn(localStorage, "getItem");
	const setItemSpy = vi.spyOn(localStorage, "setItem");

	it("should return if local storage has ecaas data", async () => { 

		getItemSpy.mockReturnValue("localStorageData");
		await syncCacheToLocalStorage();
		expect(getItemSpy).toHaveBeenCalledWith("ecaas"); 
		expect(setItemSpy).not.toHaveBeenCalled();
		expect($fetch).not.toHaveBeenCalled();
	});
});
describe("postEcaasState", () => {
	const state = useEcaasStore();

	it("should post ecaas state to setState endpoint", async () => {
		global.$fetch = vi.fn() as unknown as typeof global.$fetch;
		const fetchSpy = vi.spyOn(global, "$fetch");

		await postEcaasState(state);

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(fetchSpy).toHaveBeenCalledWith("/api/setState", {
			body: state,
			method: "POST",
		});
	});
	it("should log an error if fetch fails", async () => {
		const consoleSpy = vi.spyOn(console, "error");
		global.$fetch = vi.fn(() =>
			Promise.reject("Network error")
		) as unknown as typeof global.$fetch;
		await postEcaasState(state);
		expect(consoleSpy).toHaveBeenCalledWith("Failed to post data: Network error");
	});
});

describe("postEcaasState", () => {
  it("should post ecaas state to setState endpoint", async () => {
    global.$fetch = vi.fn() as unknown as typeof global.$fetch;
    const fetchSpy = vi.spyOn(global, "$fetch");

    const state = useEcaasStore();
    await postEcaasState(state);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith("/api/setState", {
      body: state,
      method: "POST",
    });
  });
});

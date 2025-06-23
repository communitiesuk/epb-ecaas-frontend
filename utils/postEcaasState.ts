export const postEcaasState = async (state: EcaasState) => {
  await $fetch("/api/setState", {
    method: "POST",
    body: state,
  });
};

export function isEcaasForm<T>(data: EcaasForm<T> | T): data is EcaasForm<T> {
	return (data as EcaasForm<T>).data !== undefined;
}
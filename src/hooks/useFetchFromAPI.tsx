import React, { useCallback, useEffect } from "react";
import { DefaultApiResponse } from "../core/interfaces";

export enum FetchStatus {
	Initial,
	Fetching,
	Error,
}

/**
 *
 * @param fetchFunction: Function from the APIStore needed to fetch. Tip: If you need to pass a parameter, like an ID,
 * pass this parameter as () => myAPIFunc(id)
 * @param onFetch: this is the setter that will be used when the fetch was correct to save the data.
 * @param shouldFetch: Default to true and it could be used to disallow the fetching (conditional fetching).
 * @param dependencyArray
 */
function useFetchFromAPI<Type>(
	fetchFunction: (...params: unknown[]) => Promise<DefaultApiResponse<Type>>,
	onFetch: (data: Type) => void,
	shouldFetch = true,
	dependencyArray: unknown[] = []
): { fetchStatus: FetchStatus; refetch: () => void } {
	const [fetchStatus, setFetchStatus] = React.useState(FetchStatus.Fetching);

	const fetchHandler = useCallback(async () => {
		setFetchStatus(FetchStatus.Fetching);

		const response = await fetchFunction();

		if (response.success && response.data) {
			onFetch(response.data);
			setFetchStatus(FetchStatus.Initial);
		} else setFetchStatus(FetchStatus.Error);
	}, dependencyArray);

	useEffect(() => {
		shouldFetch && fetchHandler();
	}, dependencyArray);

	return {
		fetchStatus: shouldFetch ? fetchStatus : FetchStatus.Initial,
		refetch: () => fetchHandler(),
	};
}

export default useFetchFromAPI;

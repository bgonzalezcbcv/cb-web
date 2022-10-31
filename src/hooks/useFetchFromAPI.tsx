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
 */
function useFetchFromAPI<Type>(
	fetchFunction: (...params: unknown[]) => Promise<DefaultApiResponse<Type>>,
	onFetch: (data: Type) => void
): { fetchStatus: FetchStatus; refetch: () => void } {
	const [fetchStatus, setFetchStatus] = React.useState(FetchStatus.Fetching);

	const fetchHandler = useCallback(async () => {
		setFetchStatus(FetchStatus.Fetching);

		const response = await fetchFunction();

		if (response.success && response.data) {
			onFetch(response.data);
			setFetchStatus(FetchStatus.Initial);
		} else setFetchStatus(FetchStatus.Error);
	}, []);

	useEffect(() => {
		fetchHandler();
	}, []);

	return {
		fetchStatus,
		refetch: () => fetchHandler(),
	};
}

export default useFetchFromAPI;

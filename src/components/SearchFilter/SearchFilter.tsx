import React, { useCallback, useState } from "react";

import { Box, Input } from "@mui/material";

interface SearchFilterProps<ItemType> {
	items: ItemType[];
	setItems: (items: ItemType[]) => void;
	filterFunction: (items: ItemType[], filter: string) => ItemType[];
}

function SearchFilter<ItemType>(props: SearchFilterProps<ItemType>): JSX.Element {
	const { items, setItems, filterFunction } = props;

	const [searchText, setSearchText] = useState("");

	const onSearchTextChange = useCallback(
		(newSearchText: string) => {
			setSearchText(newSearchText);

			setItems(filterFunction(items, newSearchText));
		},
		[items, setItems]
	);

	return (
		<Box width="100%">
			<Input id="search" fullWidth type="text" placeholder="Buscar..." value={searchText} onChange={(e): void => onSearchTextChange(e.target.value)} />
		</Box>
	);
}

export default SearchFilter;

import { useEffect, useState } from "react";

/**
 * Use this hook to "hide" components when they are still to be mounted on the DOM. Specially useful for facilitating automated tests.
 */
export function useIsMounted(): [boolean] {
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true));

	return [mounted];
}

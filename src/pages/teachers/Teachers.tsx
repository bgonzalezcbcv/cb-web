import React from "react";

import { useIsMounted } from "../../hooks/useIsMounted";
import CreateTeacher from "./components/create-teacher/CreateTeacher";
import ShowTeachers from "./components/show-teacher/ShowTeachers";

import "./Teachers.scss";

export default function Teachers(): React.ReactElement {
	const [mounted] = useIsMounted();

	if (!mounted) return <></>;

	return (
		<div className="teachers">
			<CreateTeacher width="400px" height="650px" />

			<ShowTeachers width="800px" height="650px" />
		</div>
	);
}

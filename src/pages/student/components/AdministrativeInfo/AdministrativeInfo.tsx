/* eslint-disable */
import React from "react";

import { TextField, Container, Card, CardContent, Grid } from "@mui/material";
import * as Models from "../../../../core/Models";
import { VisualComponent } from "../../../../core/interfaces";
import DiscountsSection from "./DiscountsSection/DiscountsSection";
import PaymentMethodSection from "./PaymentMethodsSection/PaymentMethodSection";

import "./AdministrativeInfo.scss";
import EnrollmentSection from "./EnrollmentSection/EnrollmentSection";
import CommentSection from "./CommentSection/CommentSection";
import AddStudentTypeScholarship from "./TypeScholarship/AddStudentTypeScholarship";
import TypeScholarshipSection from "./TypeScholarship/TypeScholarshipSection";

export type AdministrativeInfoProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student, debounce?: boolean) => void;
	translator?: (id: string, defaultMessage: string) => string;
	setWarnings: (message: string[]) => void;
};

export default function AdministrativeInfo(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const { editable, student, translator, onChange, setWarnings } = props;

	return (
		<Container className="administrative-info" sx={{ display: "flex" }}>
			<Grid container>
				<Grid item sm={12} md={12} lg={4} xl={4} padding="6px">
					<EnrollmentSection editable={editable} student={student} translator={translator} onChange={onChange} setWarnings={setWarnings} />
				</Grid>

				<Grid item sm={12} md={12} lg={8} xl={8} padding="6px">
					<TypeScholarshipSection editable={editable} student={student} />
				</Grid>

				<Grid item sm={12} md={12} lg={12} xl={12} padding="6px">
					<PaymentMethodSection editable={editable} student={student} />
				</Grid>

				<Grid item sm={12} md={12} lg={12} xl={12} padding="6px">
					<CommentSection student={student} editable={editable} onChange={onChange} />
				</Grid>

				<Grid item sm={12} md={12} lg={12} xl={12} padding="6px">
					<DiscountsSection editable={editable} student={student} />
				</Grid>
			</Grid>
		</Container>
	);
}

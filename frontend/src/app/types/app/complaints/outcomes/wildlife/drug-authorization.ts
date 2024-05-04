export interface DrugAuthorization {
  officer: string;
  date?: Date;

  officerErrorMessage?: string;
  dateErrorMessage?: string;
}

export interface DrugAuthorizationV2 {
  officer: string;
  date?: Date;
}

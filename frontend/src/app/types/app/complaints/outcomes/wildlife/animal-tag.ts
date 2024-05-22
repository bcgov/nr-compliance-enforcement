export interface AnimalTag {
  id: number;
  ear: string;
  number: string;
  numberErrorMessage: string;
}

export interface AnimalTagV2 {
  id: string;
  ear: string;
  identifier: string;
  order: number;
}

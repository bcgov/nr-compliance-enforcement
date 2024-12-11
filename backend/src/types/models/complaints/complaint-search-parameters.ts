import { PageParameters } from "../general/page-parameters";
import { SearchParameters } from "../general/search-parameters";
import { SortParameters } from "../general/sort-parameters";
import { ComplaintFilterParameters } from "./complaint-filter-parameters";

export interface ComplaintSearchParameters
  extends SortParameters,
    PageParameters,
    ComplaintFilterParameters,
    SearchParameters {}

export interface ComplaintMapSearchClusteredParameters extends ComplaintSearchParameters {
  bbox: string;
  zoom: number;
  clusters: boolean;
  unmapped: boolean;
}

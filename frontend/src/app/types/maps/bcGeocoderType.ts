export interface Feature {
    type:               string;
    queryAddress:       string;
    searchTimestamp:    Date;
    executionTime:      number;
    version:            string;
    baseDataDate:       Date;
    crs:                CRS;
    interpolation:      string;
    echo:               string;
    locationDescriptor: string;
    setBack:            number;
    minScore:           number;
    maxResults:         number;
    disclaimer:         string;
    privacyStatement:   string;
    copyrightNotice:    string;
    copyrightLicense:   string;
    features:           FeatureElement[];
}

export interface CRS {
    type:       string;
    properties: CRSProperties;
}

export interface CRSProperties {
    code: number;
}

export interface FeatureElement {
    type:       string;
    geometry:   Geometry;
    properties: FeatureProperties;
}

export interface Geometry {
    type:        string;
    crs:         CRS;
    coordinates: number[];
}

export interface FeatureProperties {
    fullAddress:                string;
    score:                      number;
    matchPrecision:             string;
    precisionPoints:            number;
    faults:                     any[];
    siteName:                   string;
    unitDesignator:             string;
    unitNumber:                 string;
    unitNumberSuffix:           string;
    civicNumber:                number;
    civicNumberSuffix:          string;
    streetName:                 string;
    streetType:                 string;
    isStreetTypePrefix:         string;
    streetDirection:            string;
    isStreetDirectionPrefix:    string;
    streetQualifier:            string;
    localityName:               string;
    localityType:               string;
    electoralArea:              string;
    provinceCode:               string;
    locationPositionalAccuracy: string;
    locationDescriptor:         string;
    siteID:                     string;
    blockID:                    number;
    fullSiteDescriptor:         string;
    accessNotes:                string;
    siteStatus:                 string;
    siteRetireDate:             Date;
    changeDate:                 Date;
    isOfficial:                 string;
}

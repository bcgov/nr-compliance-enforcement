import axios from 'axios';
import { Feature } from '../types/maps/bcGeocoderType';

export const getGeocodedFeatures = async (inputValue: string, maxResults: number) => {
    const apiKey = "YOUR_GOOGLE_API_KEY";
    const apiUrl = `https://geocoder.api.gov.bc.ca/addresses.json?addressString=${inputValue}&locationDescriptor=any&maxResults=${maxResults}&interpolation=adaptive&echo=true&brief=false&autoComplete=true&setBack=0&outputSRS=4326&minScore=2&provinceCode=BC`;

    const response = await axios.get(apiUrl);
    const features = response.data as Feature;

    return features;
}
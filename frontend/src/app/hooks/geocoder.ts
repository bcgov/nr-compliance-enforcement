import axios from 'axios';
import { Feature } from '../types/maps/bcGeocoderType';
import config from "../../config";

export const getGeocodedFeatures = async (inputValue: string, maxResults: number) => {
    const apiUrl = `${config.API_BASE_URL}/bc-gee323o-coder/address/${inputValue}`;
    const response = await axios.get(apiUrl);
    const features = response.data as Feature;

    return features;
}
import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError, AxiosRequestConfig } from "axios";
import { Feature } from "../../types/bc_geocoder/bcGeocoderType";

@Injectable()
export class BcGeoCoderService {
  private readonly logger = new Logger(BcGeoCoderService.name);

  constructor(private readonly httpService: HttpService) {}

  // given a localityName (community, for example) and an address, return the Feature given by BC Geocoder
  async findAll(localityName: string, addressString: string): Promise<Feature> {
    const maxResults = 1; // will need to update this for the purposes of autocomplete.
    let apiUrl: string;
    this.logger.debug(
      `Calling BC Geocoder.  Parameters sent to backend were localityName: ${localityName} and addressString: ${addressString}`,
    );
    if (addressString && localityName) {
      this.logger.debug(`Calling BC Geocoder with address ${addressString} and community ${localityName}`);

      apiUrl = `${process.env.BC_GEOCODER_API_URL}/addresses.json?addressString=${addressString},${localityName},bc&locationDescriptor=any&maxResults=${maxResults}&interpolation=adaptive&echo=true&brief=false&autoComplete=true&setBack=0&outputSRS=4326&minScore=90`;
    } else if (localityName) {
      this.logger.debug(`Calling BC Geocoder with community ${localityName}`);
      apiUrl = `${process.env.BC_GEOCODER_API_URL}/addresses.json?locationDescriptor=any&maxResults=${maxResults}&interpolation=adaptive&echo=true&brief=false&autoComplete=false&setBack=0&outputSRS=4326&minScore=1&localityName=${localityName}&provinceCode=BC`;
    } else if (addressString && addressString.length > 0) {
      this.logger.debug(`Calling BC Geocoder with address ${addressString}`);
      apiUrl = `${process.env.BC_GEOCODER_API_URL}/addresses.json?addressString=${addressString}&locationDescriptor=any&maxResults=${maxResults}&interpolation=adaptive&echo=true&brief=false&autoComplete=true&setBack=0&outputSRS=4326&minScore=90&provinceCode=BC`;
    }
    if (apiUrl) {
      const apiKey = process.env.BC_GEOCODER_API_KEY;

      const headers = {
        apikey: apiKey,
        // Add any other headers you need here
      };

      const config: AxiosRequestConfig = {
        headers,
        // Add any other Axios request configuration options here
      };
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<any>(apiUrl, config).pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response);
              throw "Error getting BC Geocoder response";
            }),
          ),
        );
        return data;
      } catch {}
      return null;
    }
  }
}

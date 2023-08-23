import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError} from 'axios';
import { Feature } from 'src/types/bc_geocoder/bcGeocoderType';

@Injectable()
export class BcGeoCoderService {

    private readonly logger = new Logger(BcGeoCoderService.name);

    constructor(private readonly httpService: HttpService) {}

    async findAll(query: string): Promise<Feature> {
        const maxResults = 10;
        const apiUrl = `${process.env.BC_GEOCODER_API_URL}/addresses.json?addressString=${query}&locationDescriptor=any&maxResults=${maxResults}&interpolation=adaptive&echo=true&brief=false&autoComplete=true&setBack=0&outputSRS=4326&minScore=2&provinceCode=BC`;

        const { data } = await firstValueFrom(
            this.httpService.get<any>(apiUrl).pipe(
              catchError((error: AxiosError) => {
                this.logger.error(error.response.data);
                throw 'Error getting BC Geocoder response';
              }),
            ),
          );
          return data;

    }

}

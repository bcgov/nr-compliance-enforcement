import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError, AxiosRequestConfig } from "axios";

@Injectable()
export class CaseManangementService {
  private readonly logger = new Logger(CaseManangementService.name);

  constructor(private readonly httpService: HttpService) {}

  // given a localityName (community, for example) and an address, return the Feature given by BC Geocoder
  async findAll(): Promise<String> {
    let apiUrl: string = process.env.CASE_MANAGEMENT_API_URL;
    this.logger.debug(
      `Calling Case Management`
    );
    if (apiUrl) {

      const headers = {
      };
  
      const config: AxiosRequestConfig = {
        headers,
        // Add any other Axios request configuration options here
      };
      try
      {
        console.log(apiUrl + "get-hello");
        const { data } = await firstValueFrom(
          this.httpService.get<any>(apiUrl + "get-hello", config).pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response);
              throw "Error getting Case Management response";
            })
          )
        );
        console.log("data: " + JSON.stringify(data));
        return data;
      }
      catch{}
      return null;
    }
  }
}

import { Injectable } from "@nestjs/common";
import axios from "axios";
import qs from "qs";

@Injectable()
export class DocumentService {
  //--
  //-- request authorization token for use in common api services
  //-- this should be refactored if multiple api's are going to be used
  private apiAuthorization = async () => {
    const payload = {
      grant_type: "client_credentials",
      client_id: process.env.CDOGS_CLIENT_ID,
      client_secret: process.env.CDOGS_CLIENT_SECRET,
    };
    console.log(payload);

    // const data = JSON.stringify(payload);
    let url = process.env.COMS_JWT_AUTH_URI;

    console.log(qs.stringify(payload));

    // const options = {
    //   method: "POST",
    //   headers: { "content-type": "application/x-www-form-urlencoded" },
    //   data: qs.stringify(payload),
    //   url,
    // };

    // const result = axios(options);
    // console.log(result);
  };

  exportComplaint(id: string, type: string): any {
    this.apiAuthorization();

    return "test";
  }
}

// deleteNote = async (token: any, model: DeleteSupplementalNotesInput): Promise<CaseFileDto> => {
//   const result = await post(token, {
//     query: `mutation DeleteNote($input: DeleteSupplementalNoteInput!) {
//       deleteNote(input: $input) {
//         caseIdentifier
//         note { note, action { actor,date,actionCode, actionId } }
//       }
//     }`,
//     variables: { input: model },
//   });

//   const returnValue = await this.handleAPIResponse(result);
//   return returnValue?.deleteNote;
// };

import { UUID } from "crypto";

export default interface Profile { 
    givenName: string,
    surName: string,
    email: string,
    idir: UUID,
}
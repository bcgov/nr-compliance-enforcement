export interface BaseCodeTable { 
   [key: string]: string | number | boolean | undefined;
   shortDescription: string;
   longDescription: string;
   displayOrder?: number;
   isActive?: boolean;
}
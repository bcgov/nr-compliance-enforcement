import { Prisma } from '@prisma/client';
import { Point } from '../../../common/custom_scalars';
import { investigation } from '../../../../prisma/investigation/investigation.unsupported_types';
import { Logger } from 'winston';
import { Dictionary } from '@automapper/core';

/**
 * PostGIS extension for Prisma Client
 * Adds custom CLIENT methods to handle PostGIS geometry types with GeoJSON Point conversion
 *
 */
export const postgisExtension = Prisma.defineExtension({
  name: 'postgis',
  client: {
    // Utility func to 'neatly' format data for raw SQL queries in one place
    // TODO: can we move this out to a shared utility since it's used in multiple places?
    // Important note: could encounter write errors if the data dict order =/= the column order of a insert
    templateData(this, data: Dictionary<any>): string[] {
      const timestamp_pattern = /timestamp$/;
      const geometry_pattern = /geometry_point$/;
      const queryData: string[] = [];
      Object.keys(data).forEach((key) => {
        let value = (data as any)[key];
        if (key.match(geometry_pattern)) {
          if (value !== null && value !== undefined) {
            value = `public.ST_GeomFromGeoJSON('${JSON.stringify(data.location_geometry_point)}')`;
          } else {
            value = 'NULL';
          }
        } else if (key.match(timestamp_pattern)) {
          if (value !== null && value !== undefined) {
            value = `'${(value as Date).toISOString()}'`;
          } else {
            value = 'NULL';
          }
        } else {
          value = `'${value}'`;
        }
        queryData.push(`${key} = ${value}`);
      });
      return queryData;
    },
    async findInvestigation(
      this: any,
      investigationGuid: string,
      include?: {
        investigation_status_code?: boolean;
        officer_investigation_xref?: boolean;
      }
    ): Promise<investigation | null> {
      const queryString = `
        SELECT
          investigation_guid,
          investigation_description,
          owned_by_agency_ref,
          investigation_status,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          location_address,
          location_description,
          public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
        FROM investigation.investigation
        WHERE investigation_guid = '${investigationGuid}'::uuid
        LIMIT 1
      `;

      const result = (await this.$queryRawUnsafe(queryString)) as investigation[];

      if (result.length === 0) return null;

      const inv = result[0];

      // Handle includes manually
      if (include?.investigation_status_code) {
        const statusCode = await this.investigation_status_code.findUnique({
          where: { investigation_status_code: inv.investigation_status }
        });
        inv.investigation_status_code = statusCode;
      }

      if (include?.officer_investigation_xref) {
        const xrefs = await this.officer_investigation_xref.findMany({
          where: { investigation_guid: inv.investigation_guid }
        });
        inv.officer_investigation_xref = xrefs;
      }

      return inv;
    },

    async createInvestigation(
      this: any,
      data: {
        investigation_status: string;
        investigation_description?: string | null;
        owned_by_agency_ref: string;
        investigation_opened_utc_timestamp: Date;
        create_user_id: string;
        create_utc_timestamp: Date;
        update_user_id?: string | null;
        update_utc_timestamp?: Date | null;
        location_address?: string | null;
        location_description?: string | null;
        location_geometry_point?: Point | null;
      }
    ): Promise<investigation> {
      const result = (await this.$queryRaw`
        INSERT INTO investigation.investigation (
          investigation_status,
          investigation_description,
          owned_by_agency_ref,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          location_address,
          location_description,
          location_geometry_point
        )
        VALUES (
          ${this.templateData(data).join(', ')}
        )
        RETURNING
          investigation_guid,
          investigation_description,
          owned_by_agency_ref,
          investigation_status,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          location_address,
          location_description,
          public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
      `) as investigation[];
      return result[0];
    },

    /**
     * Find multiple investigations by IDs with geometry as GeoJSON
     */
    async findManyInvestigations(
      this: any,
      investigationGuids: string[],
      include?: {
        investigation_status_code?: boolean;
      }
    ): Promise<investigation[]> {
      if (!investigationGuids || investigationGuids.length === 0) {
        return [];
      }

      const guidList = investigationGuids.map(id => `'${id}'::uuid`).join(', ');
      const queryString = `
        SELECT
          investigation_guid,
          investigation_description,
          owned_by_agency_ref,
          investigation_status,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          location_address,
          location_description,
          public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
        FROM investigation.investigation
        WHERE investigation_guid IN (${guidList})
      `;

      const results = (await this.$queryRawUnsafe(queryString)) as investigation[];

      // Handle includes manually
      if (include?.investigation_status_code) {
        for (const inv of results) {
          const statusCode = await this.investigation_status_code.findUnique({
            where: { investigation_status_code: inv.investigation_status }
          });
          inv.investigation_status_code = statusCode;
        }
      }

      return results;
    },

    async getManyInvestigations(
      this: any,
      validatedPageSize: number,
      skip: number,
    ): Promise<investigation[]> {
      const queryString = `
        SELECT
          investigation_guid,
          investigation_description,
          owned_by_agency_ref,
          investigation_status,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          public.ST_AsGeoJSON(location_geometry_point)::json AS location_geometry_point
        FROM investigation.investigation
        ORDER BY investigation_opened_utc_timestamp DESC
        LIMIT ${validatedPageSize}
        OFFSET ${skip}
      `;
      const results = (await this.$queryRawUnsafe(queryString)) as investigation[];
      return results;
    },

    async updateInvestigation(
      this: any,
      investigationGuid: string,
      data: {
        investigation_description?: string | null;
        owned_by_agency_ref?: string;
        investigation_status?: string;
        update_user_id?: string | null;
        update_utc_timestamp?: Date | null;
        location_geometry_point?: Point | null;
        location_address?: string | null;
        location_description?: string | null;
      }
    ): Promise<investigation> {
      const queryString = `
        UPDATE investigation.investigation
        SET ${this.templateData(data).join(', ')}
        WHERE investigation_guid = '${investigationGuid}'::uuid
        RETURNING
          investigation_guid,
          investigation_description,
          owned_by_agency_ref,
          investigation_status,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          location_address,
          location_description,
          public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
      `;
      const result = await this.$queryRawUnsafe(queryString);
      return result[0] || null;
    },
  },
});

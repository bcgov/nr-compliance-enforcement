import { Prisma } from '@prisma/client';
import { Point } from '../../../common/custom_scalars';
import { investigation } from '../../../../prisma/investigation/investigation.unsupported_types';

/**
 * PostGIS extension for Prisma Client
 * Adds custom CLIENT methods to handle PostGIS geometry types with GeoJSON Point conversion
 *
 * Custom client methods (accessed via prisma.methodName()):
 * - findInvestigationWithGeometry(guid, include?): Find single investigation with geometry as GeoJSON
 * - findManyInvestigationsWithGeometry(guids, include?): Find multiple investigations with geometry as GeoJSON
 * - createInvestigationWithGeometry(data): Create investigation with Point geometry
 * - updateInvestigationWithGeometry(guid, data): Update investigation with Point geometry support
 */
export const postgisExtension = Prisma.defineExtension({
  name: 'postgis',
  client: {
    /**
     * Find a single investigation with geometry converted to GeoJSON
     */
    async findInvestigationWithGeometry(
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

    /**
     * Create an investigation with PostGIS geometry support
     */
    async createInvestigationWithGeometry(
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
        location_geometry_point?: Point | null;
        location_address?: string | null;
        location_description?: string | null;
      }
    ): Promise<investigation> {
      const { location_geometry_point, ...rest } = data;

      if (location_geometry_point) {
        const queryString = `
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
            '${rest.investigation_status}',
            ${rest.investigation_description ? `'${rest.investigation_description.replace(/'/g, "''")}'` : 'NULL'},
            '${rest.owned_by_agency_ref}',
            '${rest.investigation_opened_utc_timestamp.toISOString()}',
            '${rest.create_user_id}',
            '${rest.create_utc_timestamp.toISOString()}',
            ${rest.update_user_id ? `'${rest.update_user_id}'` : 'NULL'},
            ${rest.update_utc_timestamp ? `'${rest.update_utc_timestamp.toISOString()}'` : 'NULL'},
            ${rest.location_address ? `'${rest.location_address.replace(/'/g, "''")}'` : 'NULL'},
            ${rest.location_description ? `'${rest.location_description.replace(/'/g, "''")}'` : 'NULL'},
            public.ST_GeomFromGeoJSON('${JSON.stringify(location_geometry_point).replace(/'/g, "''")}')
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
        `;
        const result = (await this.$queryRawUnsafe(queryString)) as investigation[];
        return result[0];
      } else {
        return await this.investigation.create({
          data: {
            ...rest,
            location_geometry_point: null,
          }
        });
      }
    },

    /**
     * Find multiple investigations by IDs with geometry as GeoJSON
     */
    async findManyInvestigationsWithGeometry(
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

    async getManyInvestigationsWithGeometry(
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

    /**
     * Update investigation with PostGIS geometry support
     */
    async updateInvestigationWithGeometry(
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
      const { location_geometry_point, ...rest } = data;

      if (location_geometry_point !== undefined) {
        const updates: string[] = [];

        if (rest.investigation_description !== undefined) {
          const escaped = rest.investigation_description ? `'${rest.investigation_description.replace(/'/g, "''")}'` : 'NULL';
          updates.push(`investigation_description = ${escaped}`);
        }
        if (rest.owned_by_agency_ref !== undefined) {
          updates.push(`owned_by_agency_ref = '${rest.owned_by_agency_ref}'`);
        }
        if (rest.investigation_status !== undefined) {
          updates.push(`investigation_status = '${rest.investigation_status}'`);
        }
        if (rest.update_user_id !== undefined) {
          const escaped = rest.update_user_id ? `'${rest.update_user_id}'` : 'NULL';
          updates.push(`update_user_id = ${escaped}`);
        }
        if (rest.update_utc_timestamp !== undefined) {
          const escaped = rest.update_utc_timestamp ? `'${rest.update_utc_timestamp.toISOString()}'` : 'NULL';
          updates.push(`update_utc_timestamp = ${escaped}`);
        }
        if (rest.location_address !== undefined) {
          const escaped = rest.location_address ? `'${rest.location_address.replace(/'/g, "''")}'` : 'NULL';
          updates.push(`location_address = ${escaped}`);
        }
        if (rest.location_description !== undefined) {
          const escaped = rest.location_description ? `'${rest.location_description.replace(/'/g, "''")}'` : 'NULL';
          updates.push(`location_description = ${escaped}`);
        }

        if (location_geometry_point !== null) {
          updates.push(`location_geometry_point = public.ST_GeomFromGeoJSON('${JSON.stringify(location_geometry_point).replace(/'/g, "''")}')`);
        } else {
          updates.push(`location_geometry_point = NULL`);
        }

        const queryString = `
          UPDATE investigation.investigation
          SET ${updates.join(', ')}
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
      } else {
        return await this.investigation.update({
          where: { investigation_guid: investigationGuid },
          data: rest
        });
      }
    },
  },
});

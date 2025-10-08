import { Prisma } from '@prisma/client';
import { Point } from '../../../common/custom_scalars';

/**
 * PostGIS extension for Prisma Client
 * Adds custom methods to handle PostGIS geometry types with GeoJSON Point conversion
 *
 * Custom methods:
 * - createWithGeometry: Create investigation with Point geometry
 * - updateWithGeometry: Update investigation with Point geometry support
 * - findUniqueWithGeometry: Find single investigation with geometry as GeoJSON
 * - findManyWithGeometry: Find multiple investigations with geometry as GeoJSON
 */
export const postgisExtension = Prisma.defineExtension({
  name: 'postgis',
  model: {
    investigation: {
      /**
       * Create an investigation with PostGIS geometry support
       * Converts Point (GeoJSON) to PostGIS geometry type
       */
      async createWithGeometry(
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
        }
      ) {
        const { location_geometry_point, ...rest } = data;

        if (location_geometry_point) {
          // Use raw SQL to insert with PostGIS geometry conversion
          const ctx = Prisma.getExtensionContext(this);
          const result = await ctx.$queryRaw<any[]>`
            INSERT INTO investigation (
              investigation_status,
              investigation_description,
              owned_by_agency_ref,
              investigation_opened_utc_timestamp,
              create_user_id,
              create_utc_timestamp,
              update_user_id,
              update_utc_timestamp,
              location_geometry_point
            )
            VALUES (
              ${rest.investigation_status},
              ${rest.investigation_description},
              ${rest.owned_by_agency_ref},
              ${rest.investigation_opened_utc_timestamp},
              ${rest.create_user_id},
              ${rest.create_utc_timestamp},
              ${rest.update_user_id},
              ${rest.update_utc_timestamp},
              ST_GeomFromGeoJSON(${JSON.stringify(location_geometry_point)})
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
              ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
          `;
          return result[0];
        } else {
          // No geometry - use normal Prisma create
          return this.create({
            data: {
              ...rest,
              location_geometry_point: null,
            }
          });
        }
      },

      /**
       * Update an investigation with PostGIS geometry support
       * Handles partial updates and geometry conversion
       */
      async updateWithGeometry(
        this: any,
        params: {
          where: { investigation_guid: string };
          data: {
            investigation_description?: string | null;
            owned_by_agency_ref?: string;
            investigation_status?: string;
            update_user_id?: string | null;
            update_utc_timestamp?: Date | null;
            location_geometry_point?: Point | null;
          };
        }
      ) {
        const { where, data } = params;
        const { location_geometry_point, ...rest } = data;

        // If geometry is being updated, use raw SQL
        if (location_geometry_point !== undefined) {
          // Build SET clause dynamically
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

          // Add geometry update
          if (location_geometry_point !== null) {
            updates.push(`location_geometry_point = ST_GeomFromGeoJSON('${JSON.stringify(location_geometry_point).replace(/'/g, "''")}')`);
          } else {
            updates.push(`location_geometry_point = NULL`);
          }

          // Execute raw SQL update
          const queryString = `
            UPDATE investigation
            SET ${updates.join(', ')}
            WHERE investigation_guid = '${where.investigation_guid}'::uuid
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
              ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
          `;

          const result = await this.$queryRawUnsafe(queryString);

          return result[0] || null;
        } else {
          // No geometry change - use normal Prisma update
          return this.update({
            where,
            data: rest
          });
        }
      },

      /**
       * Find a single investigation with geometry converted to GeoJSON
       */
      async findUniqueWithGeometry(
        this: any,
        params: {
          where: { investigation_guid: string };
          include?: {
            investigation_status_code?: boolean;
            officer_investigation_xref?: boolean;
          };
        }
      ) {
        const { where, include } = params;

        // Query with geometry as GeoJSON
        const ctx = Prisma.getExtensionContext(this);
        const result = await ctx.$queryRaw<any[]>`
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
            ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
          FROM investigation
          WHERE investigation_guid = ${where.investigation_guid}::uuid
          LIMIT 1
        `;

        if (result.length === 0) return null;

        const investigation = result[0];

        // Handle includes manually
        if (include?.investigation_status_code) {
          const statusCode = await this.investigation_status_code.findUnique({
            where: { investigation_status_code: investigation.investigation_status }
          });
          investigation.investigation_status_code = statusCode;
        }

        if (include?.officer_investigation_xref) {
          const xrefs = await this.officer_investigation_xref.findMany({
            where: { investigation_guid: investigation.investigation_guid }
          });
          investigation.officer_investigation_xref = xrefs;
        }

        return investigation;
      },

      /**
       * Find multiple investigations with geometry converted to GeoJSON
       */
      async findManyWithGeometry(
        this: any,
        params?: {
          where?: {
            investigation_guid?: { in: string[] };
            owned_by_agency_ref?: string;
            investigation_status?: string;
          };
          include?: {
            investigation_status_code?: boolean;
            officer_investigation_xref?: boolean;
          };
          orderBy?: any;
          take?: number;
          skip?: number;
        }
      ) {
        const { where, include, orderBy, take, skip } = params || {};

        // Build WHERE clause with direct value interpolation
        let whereConditions: string[] = [];

        if (where?.investigation_guid?.in) {
          const uuids = where.investigation_guid.in.map(id => `'${id}'`).join(',');
          whereConditions.push(`investigation_guid = ANY(ARRAY[${uuids}]::uuid[])`);
        }
        if (where?.owned_by_agency_ref) {
          whereConditions.push(`owned_by_agency_ref = '${where.owned_by_agency_ref}'`);
        }
        if (where?.investigation_status) {
          whereConditions.push(`investigation_status = '${where.investigation_status}'`);
        }

        // Build WHERE conditions for query - use simple approach for now
        let result: any[];

        if (where?.investigation_guid?.in && where.investigation_guid.in.length > 0) {
          // Query by GUIDs
          const guids = where.investigation_guid.in;

          // For small lists, we can use multiple OR conditions with $queryRaw
          const ctx = Prisma.getExtensionContext(this);

          if (guids.length === 1) {
            result = await ctx.$queryRaw`
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
                ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
              FROM investigation
              WHERE investigation_guid = ${guids[0]}::uuid
            `;
          } else {
            // For multiple GUIDs, need to handle differently
            // Fall back to regular findMany and manually convert geometry
            const investigations = await this.findMany({
              where: { investigation_guid: { in: guids } },
              skip,
              take,
            });

            result = investigations.map((inv: any) => ({
              ...inv,
              location_geometry_point: null, // TODO: Need to handle geometry conversion
            }));
          }
        } else if (where?.owned_by_agency_ref) {
          // Query by agency - build different queries based on pagination
          // Get the client from extension context
          const ctx = Prisma.getExtensionContext(this);

          if (take !== undefined && skip !== undefined) {
            result = await ctx.$queryRaw`
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
                ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
              FROM investigation
              WHERE owned_by_agency_ref = ${where.owned_by_agency_ref}
              ORDER BY investigation_opened_utc_timestamp DESC
              LIMIT ${take}
              OFFSET ${skip}
            `;
          } else if (take !== undefined) {
            result = await ctx.$queryRaw`
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
                ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
              FROM investigation
              WHERE owned_by_agency_ref = ${where.owned_by_agency_ref}
              ORDER BY investigation_opened_utc_timestamp DESC
              LIMIT ${take}
            `;
          } else {
            result = await ctx.$queryRaw`
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
                ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
              FROM investigation
              WHERE owned_by_agency_ref = ${where.owned_by_agency_ref}
              ORDER BY investigation_opened_utc_timestamp DESC
            `;
          }
        } else {
          // No specific filter - get all with pagination
          const ctx = Prisma.getExtensionContext(this);

          if (take !== undefined && skip !== undefined) {
            result = await ctx.$queryRaw`
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
                ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
              FROM investigation
              ORDER BY investigation_opened_utc_timestamp DESC
              LIMIT ${take}
              OFFSET ${skip}
            `;
          } else if (take !== undefined) {
            result = await ctx.$queryRaw`
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
                ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
              FROM investigation
              ORDER BY investigation_opened_utc_timestamp DESC
              LIMIT ${take}
            `;
          } else {
            result = await ctx.$queryRaw`
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
                ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
              FROM investigation
              ORDER BY investigation_opened_utc_timestamp DESC
            `;
          }
        }

        // Handle includes manually
        if (include?.investigation_status_code) {
          for (const inv of result) {
            const statusCode = await this.investigation_status_code.findUnique({
              where: { investigation_status_code: inv.investigation_status }
            });
            inv.investigation_status_code = statusCode;
          }
        }

        if (include?.officer_investigation_xref) {
          for (const inv of result) {
            const xrefs = await this.officer_investigation_xref.findMany({
              where: { investigation_guid: inv.investigation_guid }
            });
            inv.officer_investigation_xref = xrefs;
          }
        }

        return result;
      },
    },
  },
});

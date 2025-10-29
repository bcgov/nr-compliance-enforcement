# Deprecated TypeORM Entities

## ⚠️ These entities are deprecated and should not be used in new code

The following TypeORM entities have been deprecated as their underlying database tables have been migrated to the shared schema and are now accessed via GraphQL APIs.

---

## 🚫 Deprecated Entities

### **User-Related Entities** (Merged into `app_user`)

#### `backend/src/v1/officer/entities/officer.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.officer` (NO LONGER EXISTS)
- **Migrated To**: `shared.app_user`
- **Use Instead**: `AppUserService` from `backend/src/v1/app_user/`
- **GraphQL API**: `appUsers`, `appUser(userId, authUserGuid)`
- **Reason**: Officer and Person tables merged into unified app_user table

#### `backend/src/v1/person/entities/person.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.person` (NO LONGER EXISTS)
- **Migrated To**: `shared.app_user`
- **Use Instead**: `AppUserService` from `backend/src/v1/app_user/`
- **GraphQL API**: `appUsers`, `appUser(userId, authUserGuid)`
- **Reason**: Officer and Person tables merged into unified app_user table

#### `backend/src/v1/officer_team_xref/entities/officer_team_xref.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.officer_team_xref` (NO LONGER EXISTS)
- **Migrated To**: `shared.app_user_team_xref`
- **Use Instead**: GraphQL helpers from `backend/src/external_api/shared_data.ts`
  - `getAppUserTeamXref(token, appUserGuid)`
  - `createAppUserTeamXref(token, input)`
  - `updateAppUserTeamXref(token, appUserGuid, input)`
  - `deleteAppUserTeamXref(token, appUserTeamXrefGuid)`
- **GraphQL API**: `appUserTeamXrefs`, `appUserTeamXref(appUserGuid)`
- **Reason**: Renamed and moved to shared schema

---

### **Organization Entities** (Moved to shared schema)

#### `backend/src/v1/office/entities/office.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.office` (NO LONGER EXISTS)
- **Migrated To**: `shared.office`
- **Use Instead**: GraphQL helpers from `backend/src/external_api/shared_data.ts`
  - `getOffices(token)`
  - `getOfficeByGuid(token, officeGuid)`
- **GraphQL API**: `offices`
- **Reason**: Moved to shared schema for cross-application use

#### `backend/src/v1/team/entities/team.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.team` (NO LONGER EXISTS)
- **Migrated To**: `shared.team`
- **Use Instead**: GraphQL helpers
  - `getTeams(token)`
  - `getTeamByGuid(token, teamGuid)`
- **GraphQL API**: `teams`
- **Reason**: Moved to shared schema

#### `backend/src/v1/team_code/entities/team_code.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.team_code` (NO LONGER EXISTS)
- **Migrated To**: `shared.team_code`
- **Use Instead**: GraphQL helper `getTeamCodes(token)`
- **GraphQL API**: `teamCodes`
- **Reason**: Moved to shared schema

---

### **Geographic Organization Entities** (Moved to shared schema)

#### `backend/src/v1/geo_organization_unit_code/entities/geo_organization_unit_code.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.geo_organization_unit_code` (NO LONGER EXISTS)
- **Migrated To**: `shared.geo_organization_unit_code`
- **Use Instead**: GraphQL helper `getGeoOrganizationUnitCodes(token)`
- **GraphQL API**: `geoOrganizationUnitCodes`
- **Reason**: Moved to shared schema

#### `backend/src/v1/geo_org_unit_type_code/entities/geo_org_unit_type_code.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.geo_org_unit_type_code` (NO LONGER EXISTS)
- **Migrated To**: `shared.geo_org_unit_type_code`
- **Use Instead**: GraphQL helper `getGeoOrgUnitTypeCodes(token)`
- **GraphQL API**: `geoOrgUnitTypeCodes`
- **Reason**: Moved to shared schema

#### `backend/src/v1/geo_org_unit_structure/entities/geo_org_unit_structure.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database Table**: `complaint.geo_org_unit_structure` (NO LONGER EXISTS)
- **Migrated To**: `shared.geo_org_unit_structure`
- **Use Instead**: N/A (no dedicated API yet - accessed via relationships)
- **Reason**: Moved to shared schema

#### `backend/src/v1/cos_geo_org_unit/entities/cos_geo_org_unit.entity.ts`

- **Status**: ❌ DEPRECATED
- **Database View**: `complaint.cos_geo_org_unit_flat_mvw` (NO LONGER EXISTS)
- **Migrated To**: `shared.cos_geo_org_unit_flat_mvw`
- **Use Instead**: GraphQL helpers
  - `getCosGeoOrgUnits(token)`
  - `getCosGeoOrgUnitsByZone(token, zoneCode)`
  - `getCosGeoOrgUnitsByRegion(token, regionCode)`
  - `getCosGeoOrgUnitRegions(token)`
  - `getCosGeoOrgUnitZones(token)`
  - `getCosGeoOrgUnitCommunities(token)`
- **GraphQL API**: `cosGeoOrgUnits`
- **Reason**: View moved to shared schema

---

## 📚 Migration Guide

### **For New Code:**

❌ **DON'T:**

```typescript
import { Officer } from "../officer/entities/officer.entity";
const officer = await this.officerRepository.findOne({ where: { user_id: "JSMITH" } });
```

✅ **DO:**

```typescript
import { getAppUserByUserId } from "../../external_api/shared_data";
const appUser = await getAppUserByUserId(token, "JSMITH");
```

### **For Existing Code:**

These entities remain **only for backward compatibility with tests**. All service code has been refactored to use GraphQL APIs.

### **For Tests:**

Tests may continue to use these entities temporarily, but should be updated to:

1. Mock GraphQL API responses instead of TypeORM repositories
2. Use the new unified AppUser structure
3. Test via the REST API endpoints rather than direct entity manipulation

---

## 🔄 Refactoring Status

**✅ All services refactored** - No service code uses these entities anymore
**✅ All modules updated** - TypeORM registrations removed from active services
**⚠️ Tests not yet updated** - Tests still reference these entities (to be updated)

---

## Migration Timeline

- **Phase 1 (COMPLETE)**: Database schema migration
- **Phase 2 (COMPLETE)**: GraphQL APIs created
- **Phase 3 (COMPLETE)**: Service layer refactored
- **Phase 4 (PENDING)**: Test suite updated
- **Phase 5 (PENDING)**: Entities completely removed

---

**Last Updated:** 2025-10-29  
**Ticket:** CE-1996

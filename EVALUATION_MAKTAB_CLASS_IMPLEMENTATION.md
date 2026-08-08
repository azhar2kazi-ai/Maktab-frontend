# Evaluation-MaktabClass Integration Implementation

## Overview
Implemented a complete CRUD layer for managing the relationship between Evaluations and MaktabClasses with soft delete capabilities and full joined query support.

## Database Changes

### Migrations Created
1. **V19__create_evaluation_maktab_class_junction.sql** (Existing)
   - Creates the `evaluation_maktab_class` junction table
   - Primary key: composite (evaluation_id, maktab_class_id)
   - Includes foreign key constraints with CASCADE delete
   - Creates index on maktab_class_id for query performance

2. **V20__alter_evaluation_maktab.sql** (Existing)
   - Adds `active` column with default TRUE for soft delete support

3. **V21__add_timestamps_to_evaluation_maktab_class.sql** (New)
   - Adds `created_at` column with DEFAULT CURRENT_TIMESTAMP
   - Adds `updated_at` column with DEFAULT CURRENT_TIMESTAMP
   - Enables audit tracking on the junction table

### Database Schema
```sql
CREATE TABLE evaluation_maktab_class (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evaluation_id INTEGER NOT NULL,
  maktab_class_id INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  FOREIGN KEY (evaluation_id) REFERENCES evaluation(id) ON DELETE CASCADE,
  FOREIGN KEY (maktab_class_id) REFERENCES maktab_class(id) ON DELETE CASCADE
);
```

## Entity & Model Changes

### New Entity: `EvaluationMaktabClass`
**File:** `src/main/java/com/maktab/entity/EvaluationMaktabClass.java`

A proper JPA entity representing the junction table with:
- **Fields:**
  - `id`: Generated primary key
  - `evaluation`: Many-to-One reference to Evaluation (EAGER fetch)
  - `maktabClass`: Many-to-One reference to MaktabClass (EAGER fetch)
  - `active`: Boolean flag for soft delete (default true)
  - `createdAt`, `updatedAt`: Audit timestamps
  - `createdBy`, `updatedBy`: Audit fields

- **Features:**
  - Constructor with and without parameters
  - All Lombok annotations (@Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor)
  - EAGER fetching for both relationships to support single-query load

### Updated Entities

**Evaluation.java:**
- Added `@OneToMany` relationship to `EvaluationMaktabClass` (mappedBy="evaluation")
- Kept `@ManyToMany` relationship for backward compatibility
- Added getters/setters for `evaluationMaktabClasses`

**MaktabClass.java:**
- Added `@OneToMany` relationship to `EvaluationMaktabClass` (mappedBy="maktabClass")
- Kept existing `@ManyToMany` relationship for backward compatibility
- Added getters/setters (via Lombok @Getter/@Setter)

## DTOs

### `EvaluationMaktabClassDTO`
**File:** `src/main/java/com/maktab/model/EvaluationMaktabClassDTO.java`

Simple DTO for basic operations:
- `id`, `evaluationId`, `maktabClassId`, `active`
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

### `EvaluationMaktabClassDetailDTO`
**File:** `src/main/java/com/maktab/model/EvaluationMaktabClassDetailDTO.java`

Detailed DTO with joined information:
- Link metadata: `id`, `active`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- Evaluation details: `evaluationId`, `evaluationName`, `evaluationDescription`
- MaktabClass details: `maktabClassId`, `className`, `division`, `timing`

## Repository Layer

### `EvaluationMaktabClassRepository`
**File:** `src/main/java/com/maktab/repository/EvaluationMaktabClassRepository.java`

Extends `JpaRepository<EvaluationMaktabClass, Long>` with custom queries:

**Key Methods:**

1. **List Operations (Active Only):**
   - `findAllActive()` - All active links
   - `findAllActive(Pageable)` - Paginated active links
   - `findAllActiveWithDetails(Pageable)` - Paginated with eager-loaded relationships

2. **Filter by Class:**
   - `findByMaktabClassIdActive(Integer classId)` - Evaluations for a class

3. **Filter by Evaluation:**
   - `findByEvaluationIdActive(Long evaluationId)` - Classes for an evaluation

4. **Query Methods:**
   - `findByEvaluationAndClassActive(Long, Integer)` - Find specific link
   - `isEvaluationLinkedToClass(Long, Integer)` - Check if linked
   - `countActiveEvaluationsByClass(Integer)` - Count active evaluations per class

**Key Features:**
- All queries filter on `active = true` (soft delete support)
- Uses JPQL with FETCH for efficient joined queries
- Results ordered by `createdAt DESC` for consistency

## Service Layer

### `EvaluationMaktabClassService`
**File:** `src/main/java/com/maktab/service/EvaluationMaktabClassService.java`

Business logic layer with:

**CRUD Operations:**
- `create(EvaluationMaktabClassDTO)` - Create link with validation
- `getById(Long)` - Get active link by ID with details
- `update(Long, EvaluationMaktabClassDTO)` - Update non-key fields
- `softDelete(Long)` - Soft delete by ID
- `softDeleteByEvaluationAndClass(Long, Integer)` - Soft delete by keys

**Query Operations:**
- `getAllActive()` - All active links
- `getAllActiveWithDetails(PageRequestDto)` - Paginated with details
- `getEvaluationsByClassId(Integer)` - Evaluations for a class
- `isLinked(Long, Integer)` - Check if linked
- `getActiveEvaluationCountByClass(Integer)` - Count for class

**Data Conversion:**
- `convertToDTO()` - Entity to simple DTO
- `convertToDetailDTO()` - Entity to detailed DTO with joins
- Overloaded versions for batch conversions

**Error Handling:**
- Validates foreign key existence before creating links
- Prevents duplicate links
- Prevents delete of already-deleted links
- Comprehensive exception logging

## Controller Layer

### `EvaluationMaktabClassController`
**File:** `src/main/java/com/maktab/controller/EvaluationMaktabClassController.java`

REST API endpoints with `@RequestMapping("/maktab/api/evaluation-maktab-class")`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new link |
| GET | `/all` | Get all active links |
| POST | `/list` | Get paginated active links with details |
| GET | `/class/{classId}` | Get evaluations for a class |
| GET | `/{id}` | Get link by ID |
| PUT | `/{id}` | Update link |
| DELETE | `/{id}/delete` | Soft delete link by ID |
| DELETE | `/evaluation/{evaluationId}/class/{classId}/delete` | Soft delete by keys |
| GET | `/check/{evaluationId}/{classId}` | Check if linked |
| GET | `/class/{classId}/count` | Count evaluations for class |

**Features:**
- CORS enabled (`*`)
- Validation via `@Valid`
- Exception handling with `EvaluationException`
- Proper HTTP response codes

## Soft Delete Strategy

### How It Works
1. **Mark as Deleted:** Set `active = false` instead of hard delete
2. **Default Queries:** All repository queries filter on `active = true` automatically
3. **No Cleanup:** Soft-deleted records remain in database for audit/compliance
4. **Reversible:** Can reactivate by updating `active` back to `true` if needed

### Benefits
- ✅ Audit trail preservation
- ✅ Ability to restore deleted links
- ✅ No cascading deletes affecting other data
- ✅ Query performance consistent (all queries still optimized)

## Single-Query Joined Data

### Implementation Details
**Problem:** Avoid N+1 queries when fetching links with related evaluation and class details

**Solution:** Use `LEFT JOIN FETCH` in JPQL:
```java
@Query("SELECT DISTINCT emc FROM EvaluationMaktabClass emc " +
       "LEFT JOIN FETCH emc.evaluation e " +
       "LEFT JOIN FETCH emc.maktabClass mc " +
       "WHERE emc.active = true " +
       "ORDER BY emc.createdAt DESC")
Page<EvaluationMaktabClass> findAllActiveWithDetails(Pageable pageable);
```

**Results:**
- Single database query with JOINs
- Both `Evaluation` and `MaktabClass` data loaded eagerly
- No lazy-loading issues
- Full details available in DTOs

## Compilation Status

✅ **Backend:** `mvn clean compile -DskipTests` → BUILD SUCCESS

## Usage Examples

### Create a Link
```bash
POST /maktab/api/evaluation-maktab-class
{
  "evaluationId": 1,
  "maktabClassId": 2,
  "createdBy": "ADMIN"
}
```

### Get All Evaluations for a Class
```bash
GET /maktab/api/evaluation-maktab-class/class/2
```

### Soft Delete a Link
```bash
DELETE /maktab/api/evaluation-maktab-class/1/delete
```

### Check if Evaluation is Linked
```bash
GET /maktab/api/evaluation-maktab-class/check/1/2
```

### Get Paginated List with Details
```bash
POST /maktab/api/evaluation-maktab-class/list
{
  "page": 0,
  "size": 20
}
```

## Next Steps

1. **Database Migration:** Run the application to execute Flyway migrations
   ```bash
   mvn spring-boot:run
   ```

2. **Testing:** Test endpoints using Postman or curl

3. **Frontend Integration (Optional):** If you want to add UI components to manage these relationships:
   - Create Angular service to call new endpoints
   - Create components for viewing/editing links
   - Add to relevant pages (class management, evaluation assignment)

4. **Auditing:** Consider adding timestamps/audit logging middleware if needed

## Architecture Diagram

```
Evaluation (Entity)
    ├── @OneToMany: evaluationMaktabClasses
    └── @ManyToMany: maktabClasses (legacy)

EvaluationMaktabClass (Entity) ← Main Entity for New Feature
    ├── @ManyToOne: evaluation
    ├── @ManyToOne: maktabClass
    └── active, timestamps, audit fields

MaktabClass (Entity)
    ├── @OneToMany: evaluationMaktabClasses
    └── @ManyToMany: evaluations (legacy)

Repository: EvaluationMaktabClassRepository
    └── Custom queries with soft delete & joins

Service: EvaluationMaktabClassService
    ├── CRUD operations
    ├── Soft delete logic
    └── DTO conversions

Controller: EvaluationMaktabClassController
    └── REST endpoints
```

## Files Created/Modified

### Created (New)
- ✅ `V21__add_timestamps_to_evaluation_maktab_class.sql`
- ✅ `EvaluationMaktabClass.java` (Entity)
- ✅ `EvaluationMaktabClassDTO.java`
- ✅ `EvaluationMaktabClassDetailDTO.java`
- ✅ `EvaluationMaktabClassRepository.java`
- ✅ `EvaluationMaktabClassService.java`
- ✅ `EvaluationMaktabClassController.java`

### Modified
- ✅ `Evaluation.java` (Added @OneToMany relationship)
- ✅ `MaktabClass.java` (Added @OneToMany relationship)

## Notes
- The @ManyToMany relationships are kept for backward compatibility
- All queries automatically filter on `active = true`
- EAGER fetching is used for the new entity to support single-query loads
- The service layer handles all validation and error cases
- Complete audit trail support via `createdBy`, `updatedBy`, `createdAt`, `updatedAt`


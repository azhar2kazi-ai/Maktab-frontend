# Evaluation-MaktabClass API Reference

## Base URL
```
http://localhost:8080/maktab/api/evaluation-maktab-class
```

## Endpoints

### 1. Create a New Link
**Endpoint:** `POST /`

**Description:** Create a new link between an Evaluation and a MaktabClass

**Request Body:**
```json
{
  "evaluationId": 1,
  "maktabClassId": 2,
  "createdBy": "ADMIN"
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "evaluationId": 1,
  "maktabClassId": 2,
  "active": true,
  "createdAt": "2026-08-07T12:30:00",
  "updatedAt": "2026-08-07T12:30:00",
  "createdBy": "ADMIN",
  "updatedBy": "ADMIN"
}
```

**Error Cases:**
- 400: Evaluation not found
- 400: MaktabClass not found
- 400: Link already exists
- 500: Database error

---

### 2. Get All Active Links
**Endpoint:** `GET /all`

**Description:** Retrieve all active evaluation-maktab class links

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "evaluationId": 1,
    "maktabClassId": 1,
    "active": true,
    "createdAt": "2026-08-07T10:00:00",
    "updatedAt": "2026-08-07T10:00:00",
    "createdBy": "ADMIN",
    "updatedBy": "ADMIN"
  },
  {
    "id": 2,
    "evaluationId": 2,
    "maktabClassId": 1,
    "active": true,
    "createdAt": "2026-08-07T10:15:00",
    "updatedAt": "2026-08-07T10:15:00",
    "createdBy": "ADMIN",
    "updatedBy": "ADMIN"
  }
]
```

---

### 3. Get Paginated Links with Details
**Endpoint:** `POST /list`

**Description:** Retrieve paginated active links with full Evaluation and MaktabClass details (single query)

**Request Body:**
```json
{
  "page": 0,
  "size": 20
}
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "active": true,
      "createdAt": "2026-08-07T10:00:00",
      "updatedAt": "2026-08-07T10:00:00",
      "createdBy": "ADMIN",
      "updatedBy": "ADMIN",
      "evaluationId": 1,
      "evaluationName": "Midterm Exam",
      "evaluationDescription": "Assessment of student progress",
      "maktabClassId": 1,
      "className": "Class 5-A",
      "division": "A",
      "timing": "Morning"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 1,
  "totalElements": 1,
  "last": true,
  "size": 20,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 1,
  "first": true,
  "empty": false
}
```

---

### 4. Get Evaluations for a Class
**Endpoint:** `GET /class/{classId}`

**Description:** Get all active evaluations linked to a specific class with full details

**Path Parameters:**
- `classId` (Integer): The MaktabClass ID

**Example Request:**
```
GET /class/2
```

**Response (200 OK):**
```json
[
  {
    "id": 5,
    "active": true,
    "createdAt": "2026-08-07T10:30:00",
    "updatedAt": "2026-08-07T10:30:00",
    "createdBy": "ADMIN",
    "updatedBy": "ADMIN",
    "evaluationId": 1,
    "evaluationName": "Midterm Exam",
    "evaluationDescription": "Mid-term assessment",
    "maktabClassId": 2,
    "className": "Class 5-B",
    "division": "B",
    "timing": "Afternoon"
  },
  {
    "id": 6,
    "active": true,
    "createdAt": "2026-08-07T10:45:00",
    "updatedAt": "2026-08-07T10:45:00",
    "createdBy": "ADMIN",
    "updatedBy": "ADMIN",
    "evaluationId": 2,
    "evaluationName": "Final Exam",
    "evaluationDescription": "Final assessment",
    "maktabClassId": 2,
    "className": "Class 5-B",
    "division": "B",
    "timing": "Afternoon"
  }
]
```

---

### 5. Get Link by ID
**Endpoint:** `GET /{id}`

**Description:** Retrieve a specific active link with full details

**Path Parameters:**
- `id` (Long): The link ID

**Example Request:**
```
GET /5
```

**Response (200 OK):**
```json
{
  "id": 5,
  "active": true,
  "createdAt": "2026-08-07T10:30:00",
  "updatedAt": "2026-08-07T10:30:00",
  "createdBy": "ADMIN",
  "updatedBy": "ADMIN",
  "evaluationId": 1,
  "evaluationName": "Midterm Exam",
  "evaluationDescription": "Mid-term assessment",
  "maktabClassId": 2,
  "className": "Class 5-B",
  "division": "B",
  "timing": "Afternoon"
}
```

**Error Cases:**
- 404/500: Link not found
- 400: Link is marked as deleted

---

### 6. Update a Link
**Endpoint:** `PUT /{id}`

**Description:** Update a link (only non-key fields can be updated)

**Path Parameters:**
- `id` (Long): The link ID

**Request Body:**
```json
{
  "updatedBy": "MODIFIED_BY_USER"
}
```

**Response (200 OK):**
```json
{
  "id": 5,
  "evaluationId": 1,
  "maktabClassId": 2,
  "active": true,
  "createdAt": "2026-08-07T10:30:00",
  "updatedAt": "2026-08-07T11:00:00",
  "createdBy": "ADMIN",
  "updatedBy": "MODIFIED_BY_USER"
}
```

**Note:** The `evaluationId` and `maktabClassId` are immutable after creation

---

### 7. Soft Delete by ID
**Endpoint:** `DELETE /{id}/delete`

**Description:** Soft delete (mark as inactive) a link by ID

**Path Parameters:**
- `id` (Long): The link ID

**Example Request:**
```
DELETE /5/delete
```

**Response (200 OK):**
```json
"Link soft deleted successfully"
```

**Error Cases:**
- 404/500: Link not found
- 400: Link already deleted

---

### 8. Soft Delete by Evaluation and Class
**Endpoint:** `DELETE /evaluation/{evaluationId}/class/{classId}/delete`

**Description:** Soft delete a link using Evaluation ID and Class ID

**Path Parameters:**
- `evaluationId` (Long): The Evaluation ID
- `classId` (Integer): The MaktabClass ID

**Example Request:**
```
DELETE /evaluation/1/class/2/delete
```

**Response (200 OK):**
```json
"Link soft deleted successfully"
```

**Error Cases:**
- 404/500: Active link not found
- 400: Link already deleted

---

### 9. Check if Linked
**Endpoint:** `GET /check/{evaluationId}/{classId}`

**Description:** Check if an evaluation is linked to a class (active only)

**Path Parameters:**
- `evaluationId` (Long): The Evaluation ID
- `classId` (Integer): The MaktabClass ID

**Example Request:**
```
GET /check/1/2
```

**Response (200 OK):**
```json
true
```

or

```json
false
```

---

### 10. Count Active Evaluations for a Class
**Endpoint:** `GET /class/{classId}/count`

**Description:** Get the count of active evaluations linked to a class

**Path Parameters:**
- `classId` (Integer): The MaktabClass ID

**Example Request:**
```
GET /class/2/count
```

**Response (200 OK):**
```json
5
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

## Error Response Format

```json
{
  "message": "Evaluation is already linked to this class",
  "status": 400
}
```

## Soft Delete Behavior

- **Soft Delete:** Records are marked as `active = false` instead of being deleted
- **Default Queries:** All API endpoints filter on `active = true` automatically
- **Recovery:** Deleted records remain in the database for audit purposes
- **Cascade:** Deleting an Evaluation or MaktabClass will cascade delete all associated links

## Pagination Parameters

Used in `/list` endpoint:

```json
{
  "page": 0,           // 0-indexed page number
  "size": 20           // Records per page
}
```

**Common page sizes:** 10, 20, 50, 100

## Example cURL Requests

### Create a link
```bash
curl -X POST http://localhost:8080/maktab/api/evaluation-maktab-class \
  -H "Content-Type: application/json" \
  -d '{
    "evaluationId": 1,
    "maktabClassId": 2,
    "createdBy": "ADMIN"
  }'
```

### Get evaluations for class 2
```bash
curl -X GET http://localhost:8080/maktab/api/evaluation-maktab-class/class/2
```

### Check if evaluation 1 is linked to class 2
```bash
curl -X GET http://localhost:8080/maktab/api/evaluation-maktab-class/check/1/2
```

### Soft delete link by ID
```bash
curl -X DELETE http://localhost:8080/maktab/api/evaluation-maktab-class/5/delete
```

### Delete by evaluation and class
```bash
curl -X DELETE http://localhost:8080/maktab/api/evaluation-maktab-class/evaluation/1/class/2/delete
```

### Get paginated list
```bash
curl -X POST http://localhost:8080/maktab/api/evaluation-maktab-class/list \
  -H "Content-Type: application/json" \
  -d '{
    "page": 0,
    "size": 20
  }'
```

## Performance Notes

- ✅ All queries with joins use `FETCH` to avoid N+1 queries
- ✅ Pagination with eager loading for efficient bulk retrieval
- ✅ Index on `maktab_class_id` for fast filtering by class
- ✅ All queries automatically filter on `active = true`
- ✅ Soft delete has minimal performance impact

## Security Considerations

- 🔒 CORS enabled for `*` (configure in production)
- 🔒 Ensure JWT token is included in Authorization header for protected endpoints
- 🔒 All endpoints validate input with `@Valid`
- 🔒 Database constraints prevent orphaned records


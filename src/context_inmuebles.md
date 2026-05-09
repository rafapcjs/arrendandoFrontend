# API Endpoints - Inmuebles (Properties)

## Base URL
```
http://localhost:3018
```

---

## 🏠 INMUEBLES

### 1. Listar Inmuebles (paginado)
```http
GET /properties?page=1&limit=10
Authorization: Bearer {token}
```

**Behavior:**
- Si rol es `ADMIN`: lista todos los inmuebles
- Si rol es `INMOBILIARIA`: lista solo los inmuebles de su inmobiliaria

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-inmueble",
      "direccion": "Carrera 15 #85-32, Bogotá",
      "codigoServicioAgua": "AG123456789",
      "codigoServicioGas": "GS987654321",
      "codigoServicioLuz": "LZ456789123",
      "disponible": true,
      "descripcion": "Apartamento moderno",
      "fotoUrl": "https://...",
      "createdAt": "2025-05-08T10:30:00.000Z",
      "updatedAt": "2025-05-08T10:30:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### 2. Obtener Inmueble por ID
```http
GET /properties/{id}
Authorization: Bearer {token}
```

**Response (200):** Mismo formato que un objeto en el listado.

---

### 3. Crear Inmueble
```http
POST /properties
Authorization: Bearer {token}
Content-Type: application/json   (sin foto)
Content-Type: multipart/form-data (con foto)
```

**Body JSON (sin foto):**
```json
{
  "direccion": "Carrera 15 #85-32, Chapinero, Bogotá",
  "codigoServicioAgua": "AG123456789",
  "codigoServicioGas": "GS987654321",
  "codigoServicioLuz": "LZ456789123",
  "disponible": true,
  "descripcion": "Apartamento moderno con vista panorámica",
  "propietarioId": "uuid-propietario",
  "inmobiliariaId": "uuid-inmobiliaria"
}
```

**Notas:**
- Si rol es `INMOBILIARIA`: `inmobiliariaId` es **ignorado**, se toma del JWT
- Si rol es `ADMIN`: `inmobiliariaId` es **requerido**
- `propietarioId` es **requerido** en ambos casos
- Con foto: enviar como `multipart/form-data` con campo `foto` (JPG/PNG)

**Response (201):** Objeto Property completo.

---

### 4. Actualizar Inmueble
```http
PATCH /properties/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (todos opcionales):**
```json
{
  "direccion": "Nueva dirección",
  "codigoServicioAgua": "AG999999999",
  "codigoServicioGas": "GS888888888",
  "codigoServicioLuz": "LZ777777777",
  "descripcion": "Descripción actualizada"
}
```

**Response (200):** Objeto Property actualizado.

---

### 5. Activar / Desactivar Inmueble
```http
PATCH /properties/{id}/activate
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "disponible": false
}
```

**Nota:** No se puede desactivar si tiene un contrato activo (el frontend lo verifica antes de llamar este endpoint).

**Response (200):** Objeto Property con nuevo estado.

---

### 6. Eliminar Inmueble
```http
DELETE /properties/{id}
Authorization: Bearer {token}
```

**Response (204):** Sin contenido.

---

### 7. Buscar Inmuebles
```http
GET /properties/search?search=chapinero&disponible=true&page=1&limit=10
Authorization: Bearer {token}
```

**Query params:**
- `search` (string): busca en dirección, códigos y descripción
- `disponible` (boolean): filtra por disponibilidad
- `page` (number)
- `limit` (number)

**Response (200):** Mismo formato que listar.

---

### 8. Buscar por Dirección
```http
GET /properties/address/{direccion}
Authorization: Bearer {token}
```

**Response (200):** Mismo formato que listar.

---

## 🔐 Autenticación

Todos los endpoints requieren:
```
Authorization: Bearer {jwt_token}
```

El JWT contiene:
```json
{
  "sub": "uuid-usuario",
  "email": "usuario@example.com",
  "role": "ADMIN" | "INMOBILIARIA",
  "inmobiliariaId": "uuid-inmobiliaria" | null
}
```

---

## 📌 Notas importantes

1. **Aislamiento por Inmobiliaria:**
   - `INMOBILIARIA` solo ve/modifica sus propios inmuebles
   - `ADMIN` ve/modifica todo

2. **inmobiliariaId en Body:**
   - `ADMIN`: siempre debe incluirlo
   - `INMOBILIARIA`: se ignora, se usa el del token

3. **propietarioId:**
   - Requerido al crear un inmueble
   - El propietario debe pertenecer a la misma inmobiliaria

4. **Foto:**
   - Si se envía foto, usar `multipart/form-data`
   - Si no hay foto, usar `application/json`
   - Formatos aceptados: JPG, PNG

5. **Estados del Inmueble:**
   - `disponible: true` — disponible para arrendar
   - `disponible: false` — ocupado o desactivado

---

## ❌ Códigos de Error

| Código | Significado                         |
|--------|-------------------------------------|
| 201    | Creado exitosamente                 |
| 200    | OK                                  |
| 204    | Sin contenido (DELETE exitoso)      |
| 400    | Bad Request (validación fallida)    |
| 403    | Forbidden (permiso insuficiente)    |
| 404    | Not Found                           |
| 409    | Conflict (dirección duplicada)      |

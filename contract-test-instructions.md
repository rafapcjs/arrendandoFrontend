# Contract Testing Instructions

## Fixes Applied

1. **Date Formatting**: Fixed date format issues by converting dates to ISO string format before sending to API
2. **Form Validation**: Added comprehensive validation for required fields and business logic
3. **Error Handling**: Improved error handling with detailed error messages and logging
4. **Type Safety**: Fixed TypeScript linting errors by using proper error types

## Testing Checklist

### Prerequisites
1. Make sure the backend API is running on `http://localhost:3010`
2. Make sure you have at least one active tenant and one available property
3. Open browser developer tools to monitor network requests and console logs

### Contract Creation Test
1. Navigate to the contracts page
2. Click "Crear Contrato" button
3. Fill in all required fields:
   - **Fecha de Inicio**: Select a start date (today or future)
   - **Fecha de Fin**: Select an end date (must be after start date)
   - **Canon Mensual**: Enter a positive number (e.g., 1500000)
   - **Estado**: Select "Borrador" or "Activo"
   - **Inquilino**: Select from active tenants
   - **Propiedad**: Select from available properties
4. Click "Crear Contrato"
5. **Expected Result**: Contract should be created successfully with success message

### Contract Update Test
1. Find an existing contract in the list
2. Click "Editar" button
3. Modify any field (e.g., change canon mensual or dates)
4. Ensure dates are valid (end date after start date)
5. Click "Guardar Cambios"
6. **Expected Result**: Contract should be updated successfully with success message

### Contract Delete Test
1. Find an existing contract in the list
2. Click "Eliminar" button
3. Confirm deletion in the popup
4. **Expected Result**: Contract should be deleted successfully with success message

### Error Scenarios to Test
1. **Validation Errors**:
   - Try creating a contract with missing required fields
   - Try setting end date before start date
   - Try setting canon mensual to 0 or negative value

2. **API Errors**:
   - Monitor console for detailed error logging
   - Check network tab for API response codes
   - Verify error messages are user-friendly

## Debug Information

All API calls now include detailed console logging:
- Request data being sent
- Response data received
- Error details including status codes and messages

Check the browser console for detailed information if any operation fails.

## Common Issues and Solutions

1. **400 Bad Request**: Usually caused by validation errors or incorrect data format
2. **401 Unauthorized**: Check if authentication token is valid
3. **404 Not Found**: Verify API endpoint URLs and IDs
4. **500 Internal Server Error**: Check backend server logs

## API Endpoints Used

- `POST /contratos` - Create contract
- `GET /contratos` - List contracts
- `PATCH /contratos/:id` - Update contract
- `DELETE /contratos/:id` - Delete contract
- `GET /contratos/:id` - Get single contract
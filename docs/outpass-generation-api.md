# Outpass Generation API Documentation

## Overview
The outpass generation API provides a system for creating same-day outpasses with automatic expiry management. This ensures that outpasses are only valid for the current day and automatically handles expired passes.

## Key Features

### 1. Same-Day Only Validation
- Outpasses can only be generated for the current day
- Exit time must be on the current date
- Return time must be on the same day as exit time
- Exit time cannot be in the past

### 2. Automatic Expiry Management
- Automatically expires outpasses when expected return time passes
- Expires outpasses from previous days
- Background expiry checking on relevant API calls
- Manual expiry endpoint for administrators

### 3. Conflict Prevention
- Prevents multiple active outpasses for the same day
- Checks for existing pending or approved outpasses

## API Endpoints

### 1. Generate Same-Day Outpass
**POST** `/api/outpass/generate`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Medical appointment",
  "destination": "City Hospital",
  "exitTime": "2025-08-26T14:00:00.000Z",
  "expectedReturnTime": "2025-08-26T18:00:00.000Z",
  "emergencyContact": {
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

**Response (Success - 201):**
```json
{
  "message": "Outpass generated successfully for today",
  "outpass": {
    "_id": "outpass_id",
    "userId": {
      "name": "Student Name",
      "studentId": "ST001",
      "hostel": "Hostel A",
      "roomNumber": "101"
    },
    "reason": "Medical appointment",
    "destination": "City Hospital",
    "outDate": "2025-08-26T14:00:00.000Z",
    "expectedReturnDate": "2025-08-26T18:00:00.000Z",
    "status": "approved",
    "emergencyContact": {
      "name": "John Doe",
      "phone": "+1234567890"
    },
    "auditTrail": [
      {
        "status": "approved",
        "changedBy": "user_id",
        "changedAt": "2025-08-26T13:00:00.000Z",
        "remarks": "Same-day outpass auto-generated and approved"
      }
    ],
    "createdAt": "2025-08-26T13:00:00.000Z"
  },
  "validity": {
    "validFrom": "2025-08-26T14:00:00.000Z",
    "validUntil": "2025-08-26T18:00:00.000Z",
    "expiresAt": "2025-08-26T23:59:59.999Z"
  }
}
```

**Error Responses:**

*400 - Missing Required Fields:*
```json
{
  "message": "Please provide all required fields: reason, destination, exitTime, expectedReturnTime"
}
```

*400 - Not Current Day:*
```json
{
  "message": "Outpass can only be generated for the current day"
}
```

*400 - Past Time:*
```json
{
  "message": "Exit time cannot be in the past"
}
```

*400 - Return Time Validation:*
```json
{
  "message": "Return time must be on the same day as exit time"
}
```

*400 - Time Logic Error:*
```json
{
  "message": "Expected return time must be after exit time"
}
```

*400 - Existing Outpass:*
```json
{
  "message": "You already have an active outpass for today"
}
```

### 2. Get Today's Outpass
**GET** `/api/outpass/today`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
{
  "outpass": {
    "_id": "outpass_id",
    "userId": {
      "name": "Student Name",
      "studentId": "ST001",
      "hostel": "Hostel A",
      "roomNumber": "101"
    },
    "reason": "Medical appointment",
    "destination": "City Hospital",
    "outDate": "2025-08-26T14:00:00.000Z",
    "expectedReturnDate": "2025-08-26T18:00:00.000Z",
    "status": "approved",
    "createdAt": "2025-08-26T13:00:00.000Z"
  },
  "isActive": true,
  "timeRemaining": 14400000
}
```

**No Outpass Found:**
```json
{
  "message": "No outpass found for today",
  "outpass": null
}
```

### 3. Manual Expiry Check (Admin Only)
**POST** `/api/outpass/admin/expire-old`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "message": "Outpass expiry check completed",
  "expiredCount": 3
}
```

## Automatic Expiry System

### How It Works
1. **Middleware Integration**: The `checkOutpassExpiry` middleware runs on key endpoints
2. **Background Processing**: Expiry checks run automatically without affecting response time
3. **Multiple Expiry Conditions**:
   - Outpasses past their expected return time
   - Outpasses from previous days still marked as pending/approved

### Expiry Conditions
An outpass is automatically expired when:
- Current time > expected return time
- Outpass date < current date AND status is still pending/approved

### Audit Trail
All automatic expiry actions are logged in the outpass audit trail:
```json
{
  "status": "expired",
  "changedBy": null,
  "changedAt": "2025-08-26T19:00:00.000Z",
  "remarks": "Auto-expired due to time limit"
}
```

## Implementation Details

### Security Features
- JWT authentication required for all endpoints
- Admin authentication required for manual expiry
- User can only access their own outpasses
- Auto-approval only for same-day passes

### Database Optimizations
- Indexed fields: `userId`, `status`, `outDate`
- Efficient queries using date ranges
- Batch updates for expiry operations

### Error Handling
- Comprehensive input validation
- Graceful handling of database errors
- Non-blocking expiry checks (failures don't affect main operations)

## Usage Examples

### Frontend Implementation
```javascript
// Generate a same-day outpass
const generateOutpass = async (outpassData) => {
  try {
    const response = await fetch('/api/outpass/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(outpassData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Outpass generated:', result.outpass);
      console.log('Valid until:', result.validity.validUntil);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Check today's outpass status
const getTodayOutpass = async () => {
  try {
    const response = await fetch('/api/outpass/today', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (result.outpass) {
      console.log('Current outpass:', result.outpass);
      console.log('Is active:', result.isActive);
      console.log('Time remaining (ms):', result.timeRemaining);
    } else {
      console.log('No outpass for today');
    }
  } catch (error) {
    console.error('Error fetching outpass:', error);
  }
};
```

### Cron Job for Expiry (Optional)
While the system handles expiry automatically, you can set up a cron job for additional cleanup:

```javascript
// Run every hour
const cron = require('node-cron');

cron.schedule('0 * * * *', async () => {
  try {
    // Call the admin expiry endpoint
    await fetch('/api/outpass/admin/expire-old', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('Hourly expiry check completed');
  } catch (error) {
    console.error('Cron expiry check failed:', error);
  }
});
```

## Best Practices

1. **Validation**: Always validate times on both frontend and backend
2. **User Experience**: Show clear error messages for validation failures
3. **Real-time Updates**: Periodically check outpass status in the frontend
4. **Logging**: Monitor expiry operations for system health
5. **Testing**: Test edge cases like midnight transitions and timezone handling

## Notes

- All times are stored in UTC in the database
- The system assumes the server timezone for "current day" calculations
- Emergency contact information is optional but recommended
- Same-day outpasses are auto-approved for convenience
- Regular outpass requests still go through the normal approval process

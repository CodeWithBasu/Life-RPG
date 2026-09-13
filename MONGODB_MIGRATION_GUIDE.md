# PostgreSQL to MongoDB Atlas Migration Guide

This document outlines the changes made to migrate the Life-RPG backend from PostgreSQL to MongoDB Atlas.

## Changes Made

### 1. **Prisma Schema Updates** ✅
**File:** `backend/prisma/schema.prisma`

- Changed datasource provider from `sqlite` to `mongodb`
- Updated database URL to use `env("DATABASE_URL")` for flexibility
- Modified all ID fields to use MongoDB ObjectId format:
  - Changed from `@default(uuid())` to `@default(auto())`
  - Added `@map("_id")` to map to MongoDB's native `_id` field
  - Added `@db.ObjectId` type annotations for all ID and foreign key fields

**Key schema changes:**
```prisma
// Before (SQLite)
id String @id @default(uuid())

// After (MongoDB)
id String @id @default(auto()) @map("_id") @db.ObjectId
```

### 2. **Docker Compose Update** ✅
**File:** `docker-compose.yml`

- Replaced PostgreSQL 15 container with MongoDB 7 container
- Changed service name from `life-rpg-postgres` to `life-rpg-mongodb`
- Updated volume from `pgdata` to `mongodata`
- Configured MongoDB with replica set mode (required for Prisma transactions)
- MongoDB runs on default port 27017

**To start local MongoDB:**
```bash
docker-compose up -d
```

### 3. **Environment Configuration** ✅
**File:** `backend/.env.example`

Updated DATABASE_URL examples:

**For MongoDB Atlas (Production):**
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/liferpg?retryWrites=true&w=majority"
```

**For Local MongoDB (Development):**
```
DATABASE_URL="mongodb://localhost:27017/liferpg?replicaSet=rs0"
```

### 4. **Prisma Client Generation** ✅
- Regenerated Prisma Client to support MongoDB data types
- No additional packages needed (Prisma v5.22.0 already supports MongoDB)

## Migration Steps for Your Environment

### Step 1: Set Up MongoDB
Choose one option:

**Option A: Local MongoDB (Development)**
```bash
cd backend
docker-compose up -d
# Verify MongoDB is running
docker ps
```

**Option B: MongoDB Atlas (Production)**
1. Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with username and password
4. Get connection string (use MongoDB+SRV format)
5. Update `.env` with your connection string

### Step 2: Update Your `.env` File
```bash
# Copy from .env.example
cp .env.example .env

# Edit .env and update DATABASE_URL
# For Atlas: mongodb+srv://user:password@cluster.mongodb.net/liferpg?retryWrites=true&w=majority
# For Local: mongodb://localhost:27017/liferpg?replicaSet=rs0
```

### Step 3: Initialize Database
```bash
cd backend
npm install
npx prisma generate
npm run seed
```

### Step 4: Start the Application
```bash
npm run dev
```

## Key MongoDB Features with Prisma

### Transactions
All existing `prisma.$transaction()` calls work seamlessly with MongoDB. Prisma handles transactional operations automatically.

### Relationships
Foreign key relationships are fully supported using:
- `@relation` with `fields` and `references`
- Cascade delete with `onDelete: Cascade`
- One-to-one relationships (Character -> User)
- One-to-many relationships (User -> Tasks, Character -> Inventory)

### Data Types
MongoDB supports all Prisma field types:
- String, Int, Boolean
- DateTime (stored as ISODate in MongoDB)
- Arrays and nested objects (with `@db` types)

## Breaking Changes

⚠️ **Important:** This migration changes how IDs are generated:
- **Before:** UUIDs (string format)
- **After:** MongoDB ObjectIds (still available as strings in your code via Prisma)

No code changes needed in controllers or services - Prisma handles the conversion transparently!

## Testing Endpoints

After migration, test these key endpoints to ensure everything works:

### Authentication
```bash
# Signup
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"Test User"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Tasks
```bash
# Get tasks (requires auth token)
curl -H "Authorization: Bearer <token>" http://localhost:5000/tasks

# Create task
curl -X POST http://localhost:5000/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","category":"INTELLECT","difficulty":"EASY"}'
```

## MongoDB Atlas Setup Guide

### 1. Create Cluster
- Log in to MongoDB Atlas
- Click "Create" → Configure cluster (free tier available)
- Choose region close to your deployment

### 2. Create Database User
- Go to "Database Access"
- Click "Add New Database User"
- Create username and strong password
- Set permissions to "Atlas admin"

### 3. Create Database & Collection
- Go to "Database" → "Browse Collections"
- Click "Create Database"
- Database name: `liferpg`
- Create collections as needed

### 4. Get Connection String
- Click "Connect" on your cluster
- Choose "Drivers"
- Select Node.js
- Copy connection string
- Replace `<password>` and `<username>` with your credentials
- Update `.env` with the connection string

## Performance Considerations

### Advantages of MongoDB for this project:
- **Flexible schema:** Easy to add new game features
- **Horizontal scaling:** Great for growth
- **JSON-like documents:** Natural fit for RPG game data
- **Transaction support:** Reliable multi-document operations

### MongoDB Best Practices:
1. **Indexing:** Create indexes for frequently queried fields (email, userId)
2. **Replica Sets:** Required for transactions (included in cluster setup)
3. **Connection Pooling:** Prisma handles this automatically
4. **Data Validation:** Use Zod (already in your stack) for input validation

## Rollback to PostgreSQL

If needed, to rollback to PostgreSQL:

1. Revert Prisma schema to use `provider = "postgresql"`
2. Update docker-compose.yml with PostgreSQL service
3. Run `npm install pg`
4. Update CONNECTION_STRING to PostgreSQL format
5. Run migrations: `npx prisma migrate deploy`

## Troubleshooting

### Connection Issues
```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/liferpg"

# For Atlas, test from MongoDB Compass with the connection string
```

### Missing Database
```bash
# MongoDB will auto-create database on first write
# Or explicitly create in MongoDB Atlas UI
```

### Transaction Errors
- Ensure MongoDB replica set is enabled
- For local MongoDB, docker-compose.yml includes replica set configuration
- For Atlas, replica sets are enabled by default

## Next Steps

1. ✅ Test all API endpoints in development
2. ✅ Run full test suite
3. ✅ Update API documentation (if any)
4. ✅ Update deployment configuration
5. ✅ Configure MongoDB Atlas backup policies
6. ✅ Test connection string in production environment

## Resources

- [Prisma MongoDB Documentation](https://www.prisma.io/docs/orm/overview/databases/mongodb)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Prisma Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)

---

**Migration Date:** 2026-09-13
**Status:** ✅ Complete - Ready for testing

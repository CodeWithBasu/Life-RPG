# MongoDB Migration - Quick Start

## 30-Second Setup

```bash
# 1. Copy environment file
cp backend/.env.example backend/.env

# 2. Edit .env - choose ONE:
# Local: DATABASE_URL="mongodb://localhost:27017/liferpg?replicaSet=rs0"
# Atlas: DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/liferpg?retryWrites=true&w=majority"

# 3. Start MongoDB (if local)
docker-compose up -d

# 4. Setup backend
cd backend
npm install
npx prisma generate
npm run seed

# 5. Run the app
npm run dev
```

## What Changed?

| What | Before | After |
|------|--------|-------|
| **Database** | PostgreSQL/SQLite | MongoDB |
| **Schema** | `sqlite` provider | `mongodb` provider |
| **IDs** | UUID strings | MongoDB ObjectIds |
| **Your Code** | Works as-is ✅ | Works as-is ✅ |

## Environment Setup

### Local Development
```bash
DATABASE_URL="mongodb://localhost:27017/liferpg?replicaSet=rs0"
```
Then: `docker-compose up -d`

### Production (MongoDB Atlas)
```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/liferpg?retryWrites=true&w=majority"
```

## Test It Works

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Test signup
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","displayName":"Tester"}'

# You should get back a user object with accessToken
```

## Common Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Seed sample data
npm run seed

# Check connection
mongosh "mongodb://localhost:27017/liferpg"

# For Atlas: Use connection string from Atlas UI
```

## Files Changed

✅ `backend/prisma/schema.prisma` - Updated to MongoDB  
✅ `docker-compose.yml` - PostgreSQL → MongoDB  
✅ `backend/.env.example` - New connection string format  
✨ `MONGODB_MIGRATION_GUIDE.md` - Full guide  
✨ `MIGRATION_SUMMARY.md` - Detailed summary  

## Still Need Help?

📖 Read: `MONGODB_MIGRATION_GUIDE.md` (full instructions)  
📋 Read: `MIGRATION_SUMMARY.md` (detailed comparison)  

---

**Status:** ✅ Migration Complete - Ready to Deploy!

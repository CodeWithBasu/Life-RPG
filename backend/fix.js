const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
schema = schema.replace(/url      = env\("DATABASE_URL"\)/, 'url      = "file:./dev.db"');

// Remove enums
schema = schema.replace(/enum TaskCategory \{[\s\S]*?\}/, '');
schema = schema.replace(/enum Difficulty \{[\s\S]*?\}/, '');
schema = schema.replace(/enum TaskStatus \{[\s\S]*?\}/, '');
schema = schema.replace(/enum TransactionType \{[\s\S]*?\}/, '');
schema = schema.replace(/enum ShopItemType \{[\s\S]*?\}/, '');

// Replace enum fields with String
schema = schema.replace(/TaskCategory/g, 'String');
schema = schema.replace(/Difficulty/g, 'String');
schema = schema.replace(/TaskStatus/g, 'String');
schema = schema.replace(/TransactionType/g, 'String');
schema = schema.replace(/ShopItemType/g, 'String');

// Default adjustments for string
schema = schema.replace(/@default\(ACTIVE\)/g, '@default("ACTIVE")');

fs.writeFileSync('prisma/schema.prisma', schema);

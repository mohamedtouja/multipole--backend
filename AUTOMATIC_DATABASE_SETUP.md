# Automatic Database Table Creation

## ✅ How It Works Now

Your backend is now configured to **automatically create database tables** when it starts. You don't need to run manual SQL scripts anymore!

## 🔧 Configuration

### TypeORM Settings in `app.module.ts`

```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: configService.get('DATABASE_PORT', 5432),
    username: configService.get('DATABASE_USER', 'postgres'),
    password: configService.get('DATABASE_PASSWORD', 'postgres'),
    database: configService.get('DATABASE_NAME', 'multipoles'),
    
    // ✅ Automatically discovers entities from all modules
    autoLoadEntities: true,
    
    // ✅ Automatically creates/updates tables in development
    synchronize: configService.get('NODE_ENV') !== 'production',
    
    // Show SQL queries in development
    logging: configService.get('NODE_ENV') === 'development',
  }),
}),
```

### Key Features:

1. **`autoLoadEntities: true`**
   - Automatically finds all entities registered in your modules via `TypeOrmModule.forFeature()`
   - No need to manually list entities or use glob patterns
   - Works perfectly with compiled JavaScript in Docker

2. **`synchronize: true` (in development)**
   - Automatically creates tables if they don't exist
   - Automatically adds new columns when you update entities
   - **Only active in development** (disabled in production for safety)

3. **Environment-based behavior**
   - `NODE_ENV=development`: Auto-sync enabled, SQL logging enabled
   - `NODE_ENV=production`: Auto-sync disabled (use migrations instead)

---

## 🚀 How to Add a New Feature Module

### Example: Adding a "Products" Module

#### 1. Create the Entity

```typescript
// src/modules/products/entities/product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
```

#### 2. Register in Module

```typescript
// src/modules/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]), // ✅ Register entity here
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
```

#### 3. Import in AppModule

```typescript
// src/app.module.ts
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    // ... other imports
    ProductsModule, // ✅ Add your module here
  ],
})
export class AppModule {}
```

#### 4. Restart Backend

```bash
docker-compose restart backend
```

**That's it!** The `products` table will be automatically created when the backend starts.

---

## 📋 Automatic Operations

When `synchronize: true` is enabled, TypeORM automatically:

✅ **Creates tables** for new entities
✅ **Adds new columns** when you add fields to entities
✅ **Updates column types** when you change field types
✅ **Creates indexes** from `@Index()` decorators
✅ **Creates foreign keys** from `@ManyToOne`, `@OneToMany`, etc.

### What It Does NOT Do:

❌ **Drop columns** (keeps old columns to prevent data loss)
❌ **Rename columns** (treats as drop + add)
❌ **Complex migrations** (requires manual migration files)

---

## ⚠️ Production Best Practices

### For Production Environments:

**Never use `synchronize: true` in production!** Instead:

1. **Disable synchronization**
   ```typescript
   synchronize: false, // Always false in production
   ```

2. **Use TypeORM Migrations**
   ```bash
   # Generate migration based on entity changes
   npm run typeorm migration:generate -- -n CreateProductsTable
   
   # Run migrations
   npm run typeorm migration:run
   ```

3. **Version control your migrations**
   - Migrations go in `src/database/migrations/`
   - Committed to Git for team sync
   - Applied automatically on deployment

---

## 🔄 Current Environment Setup

### Docker Compose Configuration

```yaml
backend:
  environment:
    NODE_ENV: ${NODE_ENV:-development}  # Default: development
```

**Current behavior:**
- **Development**: Tables auto-created, SQL logged
- **Production**: Would need migrations (synchronize disabled)

---

## 📊 Verifying Automatic Creation

### Check if table was created:

```bash
docker exec multipoles-db psql -U postgres -d multipoles -c "\dt"
```

### See table structure:

```bash
docker exec multipoles-db psql -U postgres -d multipoles -c "\d models_3d"
```

### Watch backend logs during startup:

```bash
docker logs -f multipoles-backend
```

You'll see SQL queries like:
```sql
CREATE TABLE "models_3d" (...)
```

---

## 🎯 Benefits of This Approach

### Development:
✅ **Fast prototyping** - No manual SQL needed
✅ **Always in sync** - DB matches your entity code
✅ **Zero configuration** - Just code your entity
✅ **Instant feedback** - See changes on restart

### Production:
✅ **Safe deployments** - Migrations are versioned
✅ **Rollback capability** - Can revert migrations
✅ **Team coordination** - Everyone sees DB changes
✅ **Audit trail** - Migration history in Git

---

## 🛠️ Troubleshooting

### Table not created?

1. **Check entity is exported:**
   ```typescript
   export class Model3DEntity { ... }
   ```

2. **Check module registration:**
   ```typescript
   TypeOrmModule.forFeature([Model3DEntity])
   ```

3. **Check AppModule imports:**
   ```typescript
   imports: [Models3DModule]
   ```

4. **Check backend logs:**
   ```bash
   docker logs multipoles-backend | grep "CREATE TABLE"
   ```

### Wrong column type?

TypeORM automatically maps TypeScript types:
- `string` → `varchar(255)` or `text`
- `number` → `integer` or `numeric`
- `boolean` → `boolean`
- `Date` → `timestamp`

Override with explicit column type:
```typescript
@Column({ type: 'decimal', precision: 10, scale: 2 })
price: number;
```

---

## 📚 TypeORM Column Decorators Quick Reference

```typescript
// Primary keys
@PrimaryGeneratedColumn('uuid')
@PrimaryGeneratedColumn('increment')

// Simple columns
@Column()                                    // varchar(255)
@Column({ type: 'text' })                   // text
@Column({ type: 'int' })                    // integer
@Column({ type: 'decimal', precision: 10 }) // decimal(10,2)
@Column({ type: 'json' })                   // json

// Optional columns
@Column({ nullable: true })

// Default values
@Column({ default: true })
@Column({ default: 0 })
@Column({ default: 'fr' })

// Timestamps
@CreateDateColumn()  // Automatically set on insert
@UpdateDateColumn()  // Automatically updated on save

// Indexes
@Index()
@Index('my_custom_index_name')
```

---

## 🎉 Summary

Your backend now automatically creates database tables from your entity definitions! 

**No more manual SQL scripts needed for development.**

Just:
1. Create your entity
2. Register it in your module
3. Import the module in AppModule
4. Restart the backend

The table will be created automatically! 🚀

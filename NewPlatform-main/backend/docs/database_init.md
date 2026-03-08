Run this docker command:

```
docker run --name health360-postgres \
-e POSTGRES_DB=health360-db \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-v health360-data:/var/lib/postgresql/data \
-p 5432:5432 \
-d postgres:16
```

change user and password as you wish and update the DATABASE_URL in .env according to it
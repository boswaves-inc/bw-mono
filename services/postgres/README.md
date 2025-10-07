## PostgreSQL Configuration

Ensure the following PostgreSQL configurations are correctly set in the `.env` file:

- **Port:** `5432`
- **Host:** `postgres`
- **Username:** `admin`
- **Password:** `admin`
- **Database Name:** `database`

You can backup the data of each database seperately using the following command:

```bash
docker exec sonar-postgres pg_dump -U admin -d database > database.sql
```

If you only require the schema of the database and not the contents itself you can use the `-s` flag like so

```bash
docker exec sonar-postgres pg_dump -U admin -d database -s > schema_raw.sql
```

Sometimes the output file has a mismatch on the output file encoding type. To ensure the encoding type is set to UTF-8, use the following command to convert the schema file:

**Powershell:**

```shell
Get-Content schema_raw.sql -Raw | Set-Content schema_utf8.sql -Encoding utf8
```

**Linux / WSL:**

```bash
iconv -f -utf8 -t utf-8 schema.sql -o schema_utf8.sql
```

import { customType } from "drizzle-orm/pg-core";

export const citext = customType<{ data: string, driverOutput: string }>({
    dataType() {
        return 'citext';
    },
});

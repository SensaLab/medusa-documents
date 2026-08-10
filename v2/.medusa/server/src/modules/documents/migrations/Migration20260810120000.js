"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260810120000 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260810120000 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table if exists "document_settings" add column if not exists "storeIndiaGstDetails" jsonb null;`);
    }
    async down() {
        this.addSql(`alter table if exists "document_settings" drop column if exists "storeIndiaGstDetails";`);
    }
}
exports.Migration20260810120000 = Migration20260810120000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA4MTAxMjAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9kb2N1bWVudHMvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI2MDgxMDEyMDAwMC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsdUdBQXVHLENBQUMsQ0FBQztJQUN2SCxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyx5RkFBeUYsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7Q0FFRjtBQVZELDBEQVVDIn0=
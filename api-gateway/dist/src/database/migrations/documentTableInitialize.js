"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTable1741863113053 = void 0;
class DocumentTable1741863113053 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "documents" (
                "id" SERIAL PRIMARY KEY,
                "original_name" VARCHAR NOT NULL,
                "name" VARCHAR NOT NULL,
                "mimeType" VARCHAR NOT NULL,
                "uploadedAt" TIMESTAMP DEFAULT now()
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "document"`);
    }
}
exports.DocumentTable1741863113053 = DocumentTable1741863113053;
//# sourceMappingURL=documentTableInitialize.js.map
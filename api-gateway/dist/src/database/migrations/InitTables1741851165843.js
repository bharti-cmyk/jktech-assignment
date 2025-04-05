"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitTables1741851165843 = void 0;
class InitTables1741851165843 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE Action AS ENUM ('READ', 'WRITE', 'DELETE', 'UPDATE')
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        password VARCHAR(255) NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles_permissions (
        id SERIAL NOT NULL,
        role_id INT NOT NULL,
        access_type Action NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY (id, role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        original_name VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        mimeType VARCHAR NOT NULL,
        uploadedAt TIMESTAMP DEFAULT now()
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS documents`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles_permissions`);
        await queryRunner.query(`DROP TABLE IF EXISTS permissions`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles`);
        await queryRunner.query(`DROP TYPE IF EXISTS Action`);
    }
}
exports.InitTables1741851165843 = InitTables1741851165843;
//# sourceMappingURL=InitTables1741851165843.js.map
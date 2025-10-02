import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable("user", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        dateModified: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        refreshToken: { type: DataTypes.TEXT },
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable("user");
}

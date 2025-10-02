import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable("checklist", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        dateModified: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user", // 👈 should match the table name for your user table
                key: "id",
            },
            onDelete: "CASCADE",
        },
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable("checklist");
}

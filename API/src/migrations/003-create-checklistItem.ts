import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable("checklistItem", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        isChecked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dateModified: {
            type: "DATETIME",
            defaultValue: queryInterface.sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // You could also add a references here if you want checklistItem → user relation
        },
        checklistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "checklist", // 👈 must match the actual table name
                key: "id",
            },
            onDelete: "CASCADE",
        },
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable("checklistItem");
}

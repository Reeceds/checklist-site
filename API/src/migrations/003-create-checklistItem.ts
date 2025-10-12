import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable("checklist_item", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_checked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date_modified: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // optionally add references if you have a users table
        },
        checklist_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "checklist", // table name
                key: "id",
            },
            onDelete: "CASCADE",
        },
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable("checklist_item");
}

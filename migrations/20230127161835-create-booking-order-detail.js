'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_order_detail', {
      id_bo_detail: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_booking_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "booking_order",
          key: "id_booking_order"
        }
      },
      id_kamar: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "kamar",
          key: "id_kamar"
        }
      },
      duration: {
        type: Sequelize.DATE
      },
      total_price: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking_order_detail');
  }
};
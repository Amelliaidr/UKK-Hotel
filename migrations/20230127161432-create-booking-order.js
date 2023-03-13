'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_order', {
      id_booking_order: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bo_number: {
        type: Sequelize.INTEGER
      },
      id_guest: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "guest",
          key: "id_guest"
        }
      },
      bo_date: {
        type: Sequelize.DATE
      },
      checkIn_date: {
        type: Sequelize.DATE
      },
      checkOut_date: {
        type: Sequelize.DATE
      },
      rooms_amount: {
        type: Sequelize.INTEGER
      },
      id_tipe_kamar: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references: {
          model: "tipe_kamar",
          key: "id_tipe_kamar"
        }
      },
      bo_status: {
        type: Sequelize.ENUM('new','check_in','check_out')
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
    await queryInterface.dropTable('booking_order');
  }
};
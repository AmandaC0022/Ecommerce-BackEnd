const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,  
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      defaultValue: 10, 
      validate: {
        isNumeric: true, 
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category', 
        key: 'id', 
        unique: false, 
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;

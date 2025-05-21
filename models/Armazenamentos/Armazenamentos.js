const {Model, DataTypes} = require("sequelize");

class Armazenamentos extends Model {
    static init(connection) {
        super.init(
          {
            Descricao: DataTypes.STRING,
            Linha: DataTypes.INTEGER,
            DataAlteracao: DataTypes.DATE,
            UsuarioAlteracao: DataTypes.DATE,
            Status: DataTypes.STRING,
            idCLP: DataTypes.INTEGER,
            QuantidadeInsumo: DataTypes.DECIMAL,
            OriginalOrder: DataTypes.STRING
          },
          {
            sequelize: connection,
            tableName: "Armazenamentos",
            timestamps: false,
            underscored: false,
          }
        );
    }

}

module.exports = Armazenamentos;
const {Model, DataTypes} = require("sequelize");

class ArmazenamentoParametros extends Model {
    static init(connection) {
        super.init(
          {
            Valor: DataTypes.DECIMAL,
            DataAlteracao: DataTypes.DATE,
            UsuarioAlteracao: DataTypes.INTEGER,
            Status: DataTypes.STRING,
          },
          {
            sequelize: connection,
            tableName: "ArmazenamentoParametros",
            timestamps: false,
            underscored: false,
          }
        );
    }

}

module.exports = ArmazenamentoParametros;
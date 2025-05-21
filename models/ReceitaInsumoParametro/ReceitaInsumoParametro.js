const {Model, DataTypes} = require("sequelize");

class ReceitaInsumoParametro extends Model {
    static init(connection) {
        super.init({
            Valor: DataTypes.DECIMAL,
            DataAlteracao: DataTypes.DATE,
            Status: DataTypes.STRING
        },{
            sequelize: connection,
            tableName: 'ReceitaInsumoParametro',
            timestamps: false,
            underscored: false
        })
    }

}

module.exports = ReceitaInsumoParametro;
const {Model, DataTypes} = require("sequelize");

class Parametros extends Model {
    static init(connection) {
        super.init({
            Descricao: DataTypes.STRING,
            ValorPadrao: DataTypes.DECIMAL,
            Tipo: DataTypes.STRING,
            Status: DataTypes.STRING,
            Nome: DataTypes.STRING,
            isParametroReceita: DataTypes.BOOLEAN,
            idCLP: DataTypes.INTEGER
        },{
            sequelize: connection,
            tableName: 'Parametros',
            timestamps: false,
            underscored: false
        })
    }

}

module.exports = Parametros;
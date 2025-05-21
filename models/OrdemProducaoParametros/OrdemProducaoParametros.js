const {Model, DataTypes} = require("sequelize");

class OrdemProducaoParametros extends Model {
    static init(connection) {
        super.init({
            OrdemProducao: DataTypes.INTEGER,
            Valor: DataTypes.DECIMAL,
            DataCriacao: DataTypes.DATE,
            Status: DataTypes.STRING 
        },{
            sequelize: connection,
            tableName: 'OrdemProducaoParametros',
            timestamps: false,
            underscored: false
        })
    }

}

module.exports = OrdemProducaoParametros;
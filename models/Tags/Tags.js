const {Model, DataTypes} = require("sequelize");

class TagComms extends Model {
    static init(connection) {
        super.init({
            Descricao: DataTypes.STRING,
            Endereco: DataTypes.STRING,
            isArray: DataTypes.BOOLEAN,
            TamanhoArray: DataTypes.INTEGER
        },{
            sequelize: connection,
            tableName: 'TagComms',
            timestamps: false,
            underscored: false
        })
    }

}

module.exports = TagComms;
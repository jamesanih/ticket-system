module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availableTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Event.associate = function(models) {
    Event.hasMany(models.Booking);
  };

  return Event;
};
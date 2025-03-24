describe('taskModel', function () {

    /*         summary: {
            type: Sequelize.STRING, // talvez encryptar
            length: 2500,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        completed_at: {
            type: Sequelize.DATE,
            allowNull: true,
        }, */

    it('should have keys', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
    });
});
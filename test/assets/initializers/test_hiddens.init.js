'use strict';

module.exports = {
    collection: 'test_hiddens',
    initializer: {
        collections: [{
            name: 'profiles',
            data: [{
                user: 'Some user',
                active: true
            }]
        }, {
            name: 'users',
            data: [{
                isActive: false,
                age: 30,
                name: 'Boone Mendez',
                gender: 'male',
                company: 'ANOCHA',
                email: 'boonemendez@anocha.com',
                about: 'Magna dolore Lorem velit officia occaecat. Aliqua dolore ut dolor aliquip veniam dolor consectetur sunt fugiat. Tempor aliqua laboris mollit sunt Lorem. Irure sit fugiat proident proident cupidatat do adipisicing dolor ex do.\r\n',
                tags: ['exercitation', 'non', 'do', 'occaecat', 'qui', 'est', 'sit']
            }]
        }]
    }
};

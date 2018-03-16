'use strict';

module.exports = {
    collection: 'test_schemas',
    initializer: {
        collections: [{
            name: 'with_schema',
            schema: {
                type: 'object',
                properties: {
                    isActive: { type: 'boolean' },
                    age: { type: 'integer' },
                    name: { type: 'string' },
                    gender: { type: 'string' },
                    company: { type: 'string' },
                    xcompany: {
                        type: 'string',
                        default: 'NO COMPANY'
                    },
                    email: { type: 'string' },
                    about: { type: 'string' },
                    tags: { type: 'array' }
                },
                required: ['isActive', 'age', 'name', 'gender', 'company', 'about', 'tags']
            }
        }, {
            name: 'without_schema'
        }]
    }
};

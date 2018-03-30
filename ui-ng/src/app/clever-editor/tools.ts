export class Tools {
    private constructor() {
    }

    public static ParseSchemaFields(schema: any): any[] {
        const out: any = {
            editable: true,
            fields: []
        };

        out.fields.push({ name: '_id', title: 'ID', type: 'string' });

        if (!Array.isArray(schema.required)) {
            schema.required = [];
        }

        if (typeof schema.properties === 'object') {
            const acceptedTypes = ['boolean', 'float', 'integer', 'number', 'string']
            Object.keys(schema.properties).forEach((key: string) => {
                const entry: any = schema.properties[key];
                if (acceptedTypes.indexOf(entry.type) > -1) {
                    out.fields.push({
                        name: key,
                        type: entry.type,
                        title: key.replace('_', ' ')
                            .replace(/([A-Z])/g, ' $1')
                            .trim()
                    });
                } else {
                    if (schema.required.indexOf(key) > -1) {
                        out.editable = false;
                    }
                }
            });
        }

        out.fields.push({ name: '_created', title: 'Created', type: 'string' });
        out.fields.push({ name: '_updated', title: 'Updated', type: 'string' });

        return out;
    }
}

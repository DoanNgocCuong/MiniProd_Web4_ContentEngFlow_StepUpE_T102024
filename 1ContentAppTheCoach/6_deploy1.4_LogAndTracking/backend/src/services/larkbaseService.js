// backend/src/services/larkbaseService.js

const axios = require('axios');

const LARKBASE_CONFIG = {
    app_id: "cli_a7852e8dc6fc5010",
    app_secret: "6SIj0RfQ0ZwROvUhkjAwLebhLfJkIwnT", 
    app_base_token: "FjRbbDy10aGpKfso9uxl646Gguc"
};

class LarkbaseService {
    static async createRecords(data, tableId) {
        const payload = {
            config: {
                ...LARKBASE_CONFIG,
                base_table_id: tableId
            },
            records: [{
                fields: data
            }]
        };

        return await axios.post(
            'http://103.253.20.13:25033/api/larkbase/create-many-records',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

module.exports = LarkbaseService;
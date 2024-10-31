const axios = require('axios');

exports.submitFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;

        // Validate feedback
        if (!feedback || typeof feedback !== 'string') {
            return res.status(400).json({
                error: 'Invalid feedback format. Feedback must be a non-empty string.'
            });
        }

        // Prepare the request payload for Larkbase API
        const payload = {
            config: {
                app_id: "cli_a7852e8dc6fc5010",
                app_secret: "6SIj0RfQ0ZwROvUhkjAwLebhLfJkIwnT", 
                app_base_token: "FjRbbDy10aGpKfso9uxl646Gguc",
                base_table_id: "tble369ZpDcMr2fu"
            },
            records: [
                {
                    fields: {
                        feedback: feedback
                    }
                }
            ]
        };

        // Make request to Larkbase API
        const response = await axios.post(
            'http://103.253.20.13:25033/api/larkbase/create-many-records',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Log successful feedback submission
        console.log('Feedback submitted successfully:', {
            feedback,
            response: response.data
        });

        // Return success response
        res.json({
            message: 'Feedback submitted successfully',
            data: response.data
        });

    } catch (error) {
        // Log error details
        console.error('Error submitting feedback:', {
            message: error.message,
            stack: error.stack
        });

        // Return error response
        res.status(500).json({
            error: 'Failed to submit feedback',
            details: error.message
        });
    }
};
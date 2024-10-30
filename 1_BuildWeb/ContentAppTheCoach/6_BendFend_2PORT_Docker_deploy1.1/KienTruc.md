
### Backend Directory Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── generateLearningCardController.js
│   │   ├── generateLearningMeaningController.js
│   │   ├── generateLearningFlexibleController.js
│   │   ├── generateLearningPhraseQNAController.js
│   │   └── generateQuestionsController.js
│   ├── routes/
│   │   ├── learningCardRoutes.js
│   │   ├── learningMeaningRoutes.js
│   │   ├── learningFlexibleRoutes.js
│   │   ├── learningPhraseQNARoutes.js
│   │   └── questionRoutes.js
│   └── server.js
├── package.json
└── .env
```

### Frontend Directory Structure

```
frontend/
├── src/
│   ├── js/
│   │   ├── config.js
│   │   ├── scripts.js
│   ├── css/
│   │   ├── styles.css
│   ├── index.html
├── package.json
```

### Explanation of the Structure

#### Backend
- **controllers/**: Contains the logic for handling requests and responses for different functionalities.
- **models/**: Defines the data models (e.g., Lesson, User) used in the application.
- **routes/**: Contains route definitions for different endpoints.
- **services/**: Contains business logic and interactions with external services (like OpenAI).
- **middlewares/**: Contains middleware functions for authentication and error handling.
- **config/**: Configuration files for database and external services.
- **utils/**: Utility functions for logging and handling responses.
- **app.js**: Main application file where the Express app is configured.
- **server.js**: Entry point for starting the server.

#### Frontend
- **js/**: Contains JavaScript files for handling API calls, UI interactions, and specific functionalities.
- **css/**: Contains stylesheets for the application.
- **images/**: Contains image assets used in the application.
- **index.html**: Main HTML file for the application.
- **loading.html**: Optional loading page or component.

This structure will help you keep your code organized and make it easier to manage as your application grows.
```bash
project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── generateQuestionsController.js
│   │   │   ├── generateLearningMeaningController.js
│   │   │   ├── generateLearningCardController.js
│   │   │   ├── generateLearningFlexibleController.js
│   │   │   └── generateLearningQNAController.js
│   │   │   ├── tableFeedbackController.js
│   │   │   └── tableDraftController.js
│   │   ├── constants/
│   │   │   └── larkbaseTables.js
│   │   ├── routes/
│   │   │   └── index.js
│   │   ├── database/
│   │   │   ├── Database_Define.ipynb
│   │   │   └── LinkTracking.md
│   │   ├── services/
│   │   │   ├── larkbaseService.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── js/
│   │   │   ├── modules/
│   │   │   │   ├── learningMeaning.js
│   │   │   │   ├── learningCard.js
│   │   │   │   ├── learningFlexible.js
│   │   │   │   └── learningQNA.js
│   │   │   ├── config.js
│   │   │   ├── feedback.js
│   │   │   ├── generateQuestion.js
│   │   │   ├── scripts.js
│   │   │   └── utils.js
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── index.html
│   └── Dockerfile
```
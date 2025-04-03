class UserProfile:
    def __init__(self, industry, job, gender, native_language, english_level, learning_goals):
        self.industry = industry
        self.job = job
        self.gender = gender
        self.native_language = native_language
        self.english_level = english_level
        self.learning_goals = learning_goals

    def to_dict(self):
        return {
            "industry": self.industry,
            "job": self.job,
            "gender": self.gender,
            "native_language": self.native_language,
            "english_level": self.english_level,
            "learning_goals": self.learning_goals
        }

    def to_api_format(self):
        return f"Industry: [{self.industry}]\nJob: [{self.job}]\nGender: {self.gender}\nNative language: {self.native_language}\nEnglish Level: [{self.english_level}]\nLearning goals: {self.learning_goals}" 
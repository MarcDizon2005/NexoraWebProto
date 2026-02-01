import api from './api';

const LMS_ENDPOINTS = {
    lessons: '/lessons',
    assessments: '/assessments',
};

const lmsService = {
    // Lessons
    async getLessons(params = {}) {
        return api.get(LMS_ENDPOINTS.lessons, { params });
    },

    async getLessonById(id) {
        return api.get(`${LMS_ENDPOINTS.lessons}/${id}`);
    },

    async createLesson(lessonData) {
        return api.post(LMS_ENDPOINTS.lessons, lessonData);
    },

    async updateLesson(id, lessonData) {
        return api.put(`${LMS_ENDPOINTS.lessons}/${id}`, lessonData);
    },

    async deleteLesson(id) {
        return api.delete(`${LMS_ENDPOINTS.lessons}/${id}`);
    },

    // Assessments
    async getAssessments(params = {}) {
        return api.get(LMS_ENDPOINTS.assessments, { params });
    },

    async getAssessmentById(id) {
        return api.get(`${LMS_ENDPOINTS.assessments}/${id}`);
    },

    async submitAssessment(id, answers) {
        return api.post(`${LMS_ENDPOINTS.assessments}/${id}/submit`, { answers });
    },

    async createAssessment(assessmentData) {
        return api.post(LMS_ENDPOINTS.assessments, assessmentData);
    },
};

export default lmsService;

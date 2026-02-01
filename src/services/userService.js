import api from './api';

const USER_ENDPOINTS = {
    profile: '/admin/profile',
    students: '/admin/students',
    preregistration: '/admin/preregistration',
    updateProfile: '/admin/profile',
};

const userService = {
    async getProfile() {
        return api.get(USER_ENDPOINTS.profile);
    },

    async updateProfile(profileData) {
        return api.put(USER_ENDPOINTS.updateProfile, profileData);
    },

    async getStudents(params = {}) {
        return api.get(USER_ENDPOINTS.students, { params });
    },

    async getStudentById(id) {
        return api.get(`${USER_ENDPOINTS.students}/${id}`);
    },

    async preregisterStudent(studentData) {
        return api.post(USER_ENDPOINTS.preregistration, studentData);
    },

    async uploadProfilePhoto(file) {
        const formData = new FormData();
        formData.append('photo', file);

        return api.post(`${USER_ENDPOINTS.profile}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default userService;

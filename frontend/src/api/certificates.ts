import api from './axios'

export const certificatesApi = {
  getCertificates: () =>
    api.get('/certificates/my'),

  getCertificate: (certificateId: string) =>
    api.get(`/certificates/${certificateId}`),

  verifyCertificate: (code: string) =>
    api.get(`/certificates/verify/${code}`),

  downloadCertificate: (certificateId: string) =>
    api.get(`/certificates/${certificateId}/download`, { responseType: 'blob' }),

  issueCertificate: (userId: string, courseId: string) =>
    api.post('/certificates/issue', { userId, courseId }),
}

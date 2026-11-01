import api from './axios'

export const leaderboardApi = {
  getLeaderboard: (params?: { period?: 'weekly' | 'monthly' | 'all-time'; limit?: number }) =>
    api.get('/leaderboard', { params }),

  getMyRank: () =>
    api.get('/leaderboard/my-rank'),

  getTopStudents: (courseId?: string) =>
    api.get('/leaderboard/top', { params: { courseId } }),
}

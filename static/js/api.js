// API配置
const API_BASE_URL = '';

// API请求封装
export async function request(url, options = {}) {
    try {
        const response = await fetch(API_BASE_URL + url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
}

// 用户API
export const userAPI = {
    createUser: (data) => request('/api/users', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    getUser: (openid) => request(`/api/users/${openid}`)
};

// 出生信息API
export const birthInfoAPI = {
    create: (data) => request('/api/birth-info', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    getByUserId: (userId) => request(`/api/birth-info/user/${userId}`),
    
    update: (id, data) => request(`/api/birth-info/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    delete: (id) => request(`/api/birth-info/${id}`, {
        method: 'DELETE'
    })
};

// 分析API
export const analysisAPI = {
    bazi: (birthInfoId) => request('/api/analysis/bazi', {
        method: 'POST',
        body: JSON.stringify({ birth_info_id: birthInfoId, analysis_type: 'bazi' })
    }),
    
    ziwei: (birthInfoId) => request('/api/analysis/ziwei', {
        method: 'POST',
        body: JSON.stringify({ birth_info_id: birthInfoId, analysis_type: 'ziwei' })
    }),
    
    astrology: (birthInfoId) => request('/api/analysis/astrology', {
        method: 'POST',
        body: JSON.stringify({ birth_info_id: birthInfoId, analysis_type: 'astrology' })
    }),
    
    getHistory: (birthInfoId) => request(`/api/analysis/history/${birthInfoId}`)
};

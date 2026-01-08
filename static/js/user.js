import { userAPI } from './api.js';
import { showToast, showSection, updateNavActive } from './ui.js';

// 用户状态管理
let currentUser = null;

// 获取当前用户
export function getCurrentUser() {
    return currentUser;
}

// 设置当前用户
export function setCurrentUser(user) {
    currentUser = user;
    updateUserUI();
}

// 更新用户UI
function updateUserUI() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.nickname;
        const avatar = document.getElementById('userAvatar');
        if (currentUser.avatar_url) {
            avatar.src = currentUser.avatar_url;
            avatar.classList.remove('hidden');
        }
    }
}

// 模拟登录（实际应用中应该使用微信登录）
export async function mockLogin() {
    try {
        const mockOpenId = 'mock_user_' + Date.now();
        const userData = {
            wechat_openid: mockOpenId,
            nickname: '测试用户',
            avatar_url: 'https://via.placeholder.com/150'
        };
        
        const result = await userAPI.createUser(userData);
        
        if (result.success) {
            currentUser = {
                id: result.user_id,
                ...userData
            };
            
            // 保存到本地存储
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateUserUI();
            showSection('birthListSection');
            updateNavActive('home');
            showToast('登录成功');
            
            // 触发出生信息列表加载
            const event = new CustomEvent('userLoggedIn', { detail: currentUser });
            window.dispatchEvent(event);
        }
    } catch (error) {
        console.error('登录失败:', error);
        showToast('登录失败，请重试');
    }
}

// 初始化用户状态
export function initUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
        showSection('birthListSection');
        updateNavActive('home');
        
        // 触发出生信息列表加载
        setTimeout(() => {
            const event = new CustomEvent('userLoggedIn', { detail: currentUser });
            window.dispatchEvent(event);
        }, 100);
    }
}

// 退出登录
export function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showSection('welcomeSection');
    showToast('已退出登录');
}

// 全局状态
let currentUser = null;
let currentBirthInfo = null;
let currentAnalysisType = 'bazi';

// API基础URL
const API_BASE = '/api';

// 工具函数
function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, duration);
}

function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

// 模拟登录（实际应用中应该对接微信登录）
async function mockLogin() {
    showLoading();
    try {
        const mockOpenId = 'user_' + Date.now();
        const mockNickname = '用户' + Math.floor(Math.random() * 1000);
        
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wechat_openid: mockOpenId,
                nickname: mockNickname,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockOpenId}`
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = {
                id: data.user_id,
                openid: mockOpenId,
                nickname: mockNickname,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockOpenId}`
            };
            
            updateUserInfo();
            showBirthListSection();
            loadBirthList();
            showToast('登录成功');
        }
    } catch (error) {
        console.error('登录失败:', error);
        showToast('登录失败，请重试');
    } finally {
        hideLoading();
    }
}

// 更新用户信息显示
function updateUserInfo() {
    if (currentUser) {
        document.getElementById('userAvatar').src = currentUser.avatar_url;
        document.getElementById('userAvatar').classList.remove('hidden');
        document.getElementById('userName').textContent = currentUser.nickname;
    }
}

// 显示出生信息列表区域
function showBirthListSection() {
    document.getElementById('welcomeSection').classList.add('hidden');
    document.getElementById('birthListSection').classList.remove('hidden');
    document.getElementById('analysisSection').classList.add('hidden');
}

// 加载出生信息列表
async function loadBirthList() {
    if (!currentUser) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/birth-info/user/${currentUser.id}`);
        const birthInfos = await response.json();
        
        const birthList = document.getElementById('birthList');
        const emptyBirth = document.getElementById('emptyBirth');
        
        if (birthInfos.length === 0) {
            birthList.innerHTML = '';
            emptyBirth.classList.remove('hidden');
        } else {
            emptyBirth.classList.add('hidden');
            birthList.innerHTML = birthInfos.map(info => createBirthCard(info)).join('');
        }
    } catch (error) {
        console.error('加载出生信息失败:', error);
        showToast('加载失败，请重试');
    } finally {
        hideLoading();
    }
}

// 创建出生信息卡片
function createBirthCard(info) {
    const genderIcon = info.gender === 'male' ? '👨' : '👩';
    const genderText = info.gender === 'male' ? '男' : '女';
    
    return `
        <div class="birth-card bg-white rounded-xl p-4 card-shadow">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                    <div class="text-3xl">${genderIcon}</div>
                    <div>
                        <h3 class="font-bold text-gray-800">${info.nickname}</h3>
                        <p class="text-sm text-gray-500">${genderText} · ${info.birth_date}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editBirthInfo(${info.id})" class="text-blue-500 p-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button onclick="deleteBirthInfo(${info.id})" class="text-red-500 p-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="text-sm text-gray-600 mb-3">
                <p>🕐 ${info.birth_time}</p>
                ${info.birth_place ? `<p>📍 ${info.birth_place}</p>` : ''}
            </div>
            <button onclick="showAnalysis(${info.id})" class="w-full btn-primary text-white py-2 rounded-lg text-sm font-medium">
                开始分析
            </button>
        </div>
    `;
}

// 显示添加出生信息弹窗
function showAddBirthModal() {
    document.getElementById('birthModalTitle').textContent = '添加出生信息';
    document.getElementById('birthForm').reset();
    document.getElementById('birthId').value = '';
    document.getElementById('birthModal').classList.add('active');
}

// 关闭出生信息弹窗
function closeBirthModal() {
    document.getElementById('birthModal').classList.remove('active');
}

// 编辑出生信息
async function editBirthInfo(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/birth-info/user/${currentUser.id}`);
        const birthInfos = await response.json();
        const info = birthInfos.find(b => b.id === id);
        
        if (info) {
            document.getElementById('birthModalTitle').textContent = '编辑出生信息';
            document.getElementById('birthId').value = info.id;
            document.getElementById('birthNickname').value = info.nickname;
            document.querySelector(`input[name="gender"][value="${info.gender}"]`).checked = true;
            document.getElementById('birthDate').value = info.birth_date;
            document.getElementById('birthTime').value = info.birth_time;
            document.getElementById('birthPlace').value = info.birth_place || '';
            document.getElementById('birthModal').classList.add('active');
        }
    } catch (error) {
        console.error('加载出生信息失败:', error);
        showToast('加载失败，请重试');
    } finally {
        hideLoading();
    }
}

// 删除出生信息
async function deleteBirthInfo(id) {
    if (!confirm('确定要删除这条出生信息吗？')) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/birth-info/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
            showToast('删除成功');
            loadBirthList();
        }
    } catch (error) {
        console.error('删除失败:', error);
        showToast('删除失败，请重试');
    } finally {
        hideLoading();
    }
}

// 表单提交处理
document.getElementById('birthForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const birthId = document.getElementById('birthId').value;
    const formData = {
        user_id: currentUser.id,
        nickname: document.getElementById('birthNickname').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        birth_date: document.getElementById('birthDate').value,
        birth_time: document.getElementById('birthTime').value,
        birth_place: document.getElementById('birthPlace').value
    };
    
    showLoading();
    try {
        let response;
        if (birthId) {
            response = await fetch(`${API_BASE}/birth-info/${birthId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(`${API_BASE}/birth-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
        }
        
        const data = await response.json();
        if (data.success) {
            showToast(birthId ? '更新成功' : '添加成功');
            closeBirthModal();
            loadBirthList();
        }
    } catch (error) {
        console.error('保存失败:', error);
        showToast('保存失败，请重试');
    } finally {
        hideLoading();
    }
});

// 显示分析页面
async function showAnalysis(birthInfoId) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/birth-info/user/${currentUser.id}`);
        const birthInfos = await response.json();
        currentBirthInfo = birthInfos.find(b => b.id === birthInfoId);
        
        if (currentBirthInfo) {
            document.getElementById('analysisTitle').textContent = currentBirthInfo.nickname;
            document.getElementById('analysisSubtitle').textContent = 
                `${currentBirthInfo.birth_date} ${currentBirthInfo.birth_time} · ${currentBirthInfo.birth_place || '未知地点'}`;
            
            document.getElementById('birthListSection').classList.add('hidden');
            document.getElementById('analysisSection').classList.remove('hidden');
            
            selectAnalysisType('bazi');
        }
    } catch (error) {
        console.error('加载失败:', error);
        showToast('加载失败，请重试');
    } finally {
        hideLoading();
    }
}

// 返回出生信息列表
function backToBirthList() {
    document.getElementById('analysisSection').classList.add('hidden');
    document.getElementById('birthListSection').classList.remove('hidden');
    currentBirthInfo = null;
}

// 选择分析类型
async function selectAnalysisType(type) {
    currentAnalysisType = type;
    
    document.querySelectorAll('.analysis-tab').forEach(tab => {
        if (tab.dataset.type === type) {
            tab.classList.add('tab-active');
        } else {
            tab.classList.remove('tab-active');
            tab.classList.add('bg-gray-100', 'text-gray-700');
        }
    });
    
    await performAnalysis(type);
}

// 执行分析
async function performAnalysis(type) {
    if (!currentBirthInfo) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/analysis/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                birth_info_id: currentBirthInfo.id,
                analysis_type: type
            })
        });
        
        const result = await response.json();
        displayAnalysisResult(type, result);
    } catch (error) {
        console.error('分析失败:', error);
        showToast('分析失败，请重试');
    } finally {
        hideLoading();
    }
}

// 显示分析结果
function displayAnalysisResult(type, result) {
    const container = document.getElementById('analysisResult');
    
    if (type === 'bazi') {
        container.innerHTML = `
            <div class="bg-white rounded-xl p-6 card-shadow">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span class="text-2xl mr-2">🎋</span>
                    八字命盘
                </h3>
                <div class="grid grid-cols-4 gap-3 mb-6">
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-1">年柱</div>
                        <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg py-3 px-2">
                            <div class="text-lg font-bold text-purple-700">${result.bazi.year}</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-1">月柱</div>
                        <div class="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg py-3 px-2">
                            <div class="text-lg font-bold text-blue-700">${result.bazi.month}</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-1">日柱</div>
                        <div class="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg py-3 px-2">
                            <div class="text-lg font-bold text-green-700">${result.bazi.day}</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-1">时柱</div>
                        <div class="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg py-3 px-2">
                            <div class="text-lg font-bold text-orange-700">${result.bazi.hour}</div>
                        </div>
                    </div>
                </div>
                
                <h4 class="font-bold text-gray-800 mb-3">五行分布</h4>
                <div class="space-y-2 mb-6">
                    ${Object.entries(result.wuxing).map(([element, count]) => `
                        <div class="flex items-center">
                            <span class="w-12 text-sm text-gray-600">${element}</span>
                            <div class="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full flex items-center justify-end pr-2" style="width: ${count * 20}%">
                                    <span class="text-xs text-white font-medium">${count}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${Object.entries(result.analysis).map(([key, value]) => `
                <div class="bg-white rounded-xl p-6 card-shadow">
                    <h4 class="font-bold text-gray-800 mb-3">${key}</h4>
                    <p class="text-gray-600 leading-relaxed">${value}</p>
                </div>
            `).join('')}
        `;
    } else if (type === 'ziwei') {
        const palaces = Object.entries(result.mingpan);
        container.innerHTML = `
            <div class="bg-white rounded-xl p-6 card-shadow">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span class="text-2xl mr-2">⭐</span>
                    紫微命盘
                </h3>
                <div class="grid grid-cols-2 gap-3">
                    ${palaces.map(([palace, data]) => `
                        <div class="border-2 border-purple-200 rounded-lg p-3">
                            <div class="font-bold text-purple-700 mb-2">${palace}</div>
                            <div class="text-sm text-gray-600">
                                <div class="mb-1">主星: ${data.主星}</div>
                                ${data.副星.length > 0 ? `<div class="text-xs">副星: ${data.副星.join('、')}</div>` : ''}
                                <div class="text-xs text-gray-500 mt-1">${data.位置}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${Object.entries(result.analysis).map(([key, value]) => `
                <div class="bg-white rounded-xl p-6 card-shadow">
                    <h4 class="font-bold text-gray-800 mb-3">${key}</h4>
                    <p class="text-gray-600 leading-relaxed">${value}</p>
                </div>
            `).join('')}
        `;
    } else if (type === 'astrology') {
        container.innerHTML = `
            <div class="bg-white rounded-xl p-6 card-shadow">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span class="text-2xl mr-2">🌟</span>
                    个人星盘
                </h3>
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-2">太阳星座</div>
                        <div class="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg py-4">
                            <div class="text-2xl mb-1">☀️</div>
                            <div class="font-bold text-orange-700">${result.sun_sign}</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-2">月亮星座</div>
                        <div class="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg py-4">
                            <div class="text-2xl mb-1">🌙</div>
                            <div class="font-bold text-blue-700">${result.moon_sign}</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500 mb-2">上升星座</div>
                        <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg py-4">
                            <div class="text-2xl mb-1">⬆️</div>
                            <div class="font-bold text-purple-700">${result.rising_sign}</div>
                        </div>
                    </div>
                </div>
                
                <h4 class="font-bold text-gray-800 mb-3">行星位置</h4>
                <div class="space-y-2 mb-4">
                    ${Object.entries(result.planets).map(([planet, data]) => `
                        <div class="flex items-center justify-between py-2 border-b border-gray-100">
                            <span class="font-medium text-gray-700">${planet}</span>
                            <div class="text-right">
                                <div class="text-sm text-gray-600">${data.sign}</div>
                                <div class="text-xs text-gray-500">${data.house} · ${data.degree}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${Object.entries(result.analysis).map(([key, value]) => `
                <div class="bg-white rounded-xl p-6 card-shadow">
                    <h4 class="font-bold text-gray-800 mb-3">${key}</h4>
                    <p class="text-gray-600 leading-relaxed">${value}</p>
                </div>
            `).join('')}
        `;
    }
}

// 底部导航切换
function showTab(tab) {
    document.querySelectorAll('.nav-tab').forEach(navTab => {
        if (navTab.dataset.tab === tab) {
            navTab.classList.add('text-purple-600');
            navTab.classList.remove('text-gray-400');
        } else {
            navTab.classList.remove('text-purple-600');
            navTab.classList.add('text-gray-400');
        }
    });
    
    if (tab === 'home') {
        if (currentUser) {
            showBirthListSection();
        } else {
            document.getElementById('welcomeSection').classList.remove('hidden');
            document.getElementById('birthListSection').classList.add('hidden');
            document.getElementById('analysisSection').classList.add('hidden');
        }
    } else if (tab === 'profile') {
        showToast('个人中心功能开发中');
    }
}

// 将需要在HTML中调用的函数挂载到window对象
window.mockLogin = mockLogin;
window.showAddBirthModal = showAddBirthModal;
window.closeBirthModal = closeBirthModal;
window.editBirthInfo = editBirthInfo;
window.deleteBirthInfo = deleteBirthInfo;
window.showAnalysis = showAnalysis;
window.backToBirthList = backToBirthList;
window.selectAnalysisType = selectAnalysisType;
window.showTab = showTab;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置默认选中首页
    showTab('home');
});

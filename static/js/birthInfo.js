import { birthInfoAPI } from './api.js';
import { getCurrentUser } from './user.js';
import { showToast, showLoading, hideLoading, showModal, hideModal } from './ui.js';

// 出生信息列表
let birthInfoList = [];
let currentEditingId = null;

// 加载出生信息列表
export async function loadBirthInfoList() {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
        showLoading();
        birthInfoList = await birthInfoAPI.getByUserId(user.id);
        renderBirthInfoList();
    } catch (error) {
        console.error('加载出生信息失败:', error);
        showToast('加载失败，请重试');
    } finally {
        hideLoading();
    }
}

// 渲染出生信息列表
function renderBirthInfoList() {
    const listContainer = document.getElementById('birthList');
    const emptyTip = document.getElementById('emptyBirth');
    
    if (birthInfoList.length === 0) {
        listContainer.innerHTML = '';
        emptyTip.classList.remove('hidden');
    } else {
        emptyTip.classList.add('hidden');
        listContainer.innerHTML = birthInfoList.map(info => `
            <div class="birth-card bg-white rounded-xl p-4 card-shadow">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl">
                            ${info.gender === 'male' ? '👨' : '👩'}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800">${info.nickname}</h3>
                            <p class="text-sm text-gray-500">${info.gender === 'male' ? '男' : '女'}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="window.editBirthInfo(${info.id})" class="text-blue-600 hover:text-blue-800">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="window.deleteBirthInfo(${info.id})" class="text-red-600 hover:text-red-800">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex items-center">
                        <span class="w-20">出生日期:</span>
                        <span>${info.birth_date}</span>
                    </div>
                    <div class="flex items-center">
                        <span class="w-20">出生时间:</span>
                        <span>${info.birth_time}</span>
                    </div>
                    ${info.birth_place ? `
                    <div class="flex items-center">
                        <span class="w-20">出生地点:</span>
                        <span>${info.birth_place}</span>
                    </div>
                    ` : ''}
                </div>
                <button onclick="window.showAnalysis(${info.id}, '${info.nickname}')" class="mt-4 w-full btn-primary text-white py-2 rounded-lg font-medium">
                    开始分析
                </button>
            </div>
        `).join('');
    }
}

// 显示添加出生信息弹窗
export function showAddBirthModal() {
    currentEditingId = null;
    document.getElementById('birthModalTitle').textContent = '添加出生信息';
    document.getElementById('birthForm').reset();
    document.getElementById('birthId').value = '';
    showModal('birthModal');
}

// 显示编辑出生信息弹窗
export function editBirthInfo(id) {
    const info = birthInfoList.find(item => item.id === id);
    if (!info) return;
    
    currentEditingId = id;
    document.getElementById('birthModalTitle').textContent = '编辑出生信息';
    document.getElementById('birthId').value = id;
    document.getElementById('birthNickname').value = info.nickname;
    document.getElementById('birthDate').value = info.birth_date;
    document.getElementById('birthTime').value = info.birth_time;
    document.getElementById('birthPlace').value = info.birth_place || '';
    
    const genderRadio = document.querySelector(`input[name="gender"][value="${info.gender}"]`);
    if (genderRadio) genderRadio.checked = true;
    
    showModal('birthModal');
}

// 关闭出生信息弹窗
export function closeBirthModal() {
    hideModal('birthModal');
    currentEditingId = null;
}

// 删除出生信息
export async function deleteBirthInfo(id) {
    if (!confirm('确定要删除这条出生信息吗？')) return;
    
    try {
        showLoading();
        await birthInfoAPI.delete(id);
        showToast('删除成功');
        await loadBirthInfoList();
    } catch (error) {
        console.error('删除失败:', error);
        showToast('删除失败，请重试');
    } finally {
        hideLoading();
    }
}

// 保存出生信息
export async function saveBirthInfo(formData) {
    const user = getCurrentUser();
    if (!user) {
        showToast('请先登录');
        return;
    }
    
    try {
        showLoading();
        
        if (currentEditingId) {
            // 编辑
            await birthInfoAPI.update(currentEditingId, formData);
            showToast('更新成功');
        } else {
            // 新增
            formData.user_id = user.id;
            await birthInfoAPI.create(formData);
            showToast('添加成功');
        }
        
        closeBirthModal();
        await loadBirthInfoList();
    } catch (error) {
        console.error('保存失败:', error);
        showToast('保存失败，请重试');
    } finally {
        hideLoading();
    }
}

// 初始化出生信息模块
export function initBirthInfo() {
    // 监听用户登录事件
    window.addEventListener('userLoggedIn', () => {
        loadBirthInfoList();
    });
    
    // 表单提交事件
    const form = document.getElementById('birthForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                nickname: document.getElementById('birthNickname').value,
                birth_date: document.getElementById('birthDate').value,
                birth_time: document.getElementById('birthTime').value,
                birth_place: document.getElementById('birthPlace').value,
                gender: document.querySelector('input[name="gender"]:checked').value
            };
            
            await saveBirthInfo(formData);
        });
    }
}

// 获取出生信息列表
export function getBirthInfoList() {
    return birthInfoList;
}

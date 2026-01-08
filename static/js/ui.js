// UI工具函数模块

// 显示Toast提示
export function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, duration);
}

// 显示/隐藏Loading
export function showLoading() {
    document.getElementById('loading').classList.add('active');
}

export function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

// 显示/隐藏模态框
export function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

export function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 切换页面显示
export function showSection(sectionId) {
    const sections = ['welcomeSection', 'birthListSection', 'analysisSection'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.toggle('hidden', id !== sectionId);
        }
    });
}

// 更新导航栏激活状态
export function updateNavActive(tabName) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const isActive = tab.dataset.tab === tabName;
        tab.classList.toggle('text-purple-600', isActive);
        tab.classList.toggle('text-gray-600', !isActive);
    });
}

// 更新分析类型标签激活状态
export function updateAnalysisTabActive(type) {
    document.querySelectorAll('.analysis-tab').forEach(tab => {
        const isActive = tab.dataset.type === type;
        if (isActive) {
            tab.classList.add('tab-active');
            tab.classList.remove('bg-gray-100', 'text-gray-700');
        } else {
            tab.classList.remove('tab-active');
            tab.classList.add('bg-gray-100', 'text-gray-700');
        }
    });
}

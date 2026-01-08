// 主入口文件
import { initUser, mockLogin } from './user.js';
import { initBirthInfo, showAddBirthModal, closeBirthModal, editBirthInfo, deleteBirthInfo } from './birthInfo.js';
import { initAnalysis, showAnalysis, backToBirthList, selectAnalysisType } from './analysis.js';
import { showSection, updateNavActive } from './ui.js';

// 导航切换
function showTab(tabName) {
    updateNavActive(tabName);
    
    switch (tabName) {
        case 'home':
            showSection('birthListSection');
            break;
        case 'bazi':
        case 'ziwei':
        case 'astrology':
            // 如果有选中的出生信息，显示对应分析
            const birthList = document.querySelectorAll('.birth-card');
            if (birthList.length > 0) {
                // 获取第一个出生信息进行分析
                const firstBirthInfo = birthList[0];
                const button = firstBirthInfo.querySelector('button[onclick*="showAnalysis"]');
                if (button) {
                    const onclick = button.getAttribute('onclick');
                    const match = onclick.match(/showAnalysis\((\d+),\s*'([^']+)'\)/);
                    if (match) {
                        showAnalysis(parseInt(match[1]), match[2]);
                        // 切换到对应的分析类型
                        setTimeout(() => selectAnalysisType(tabName), 100);
                    }
                }
            }
            break;
        case 'profile':
            showSection('birthListSection');
            break;
    }
}

// 将函数暴露到全局作用域
window.mockLogin = mockLogin;
window.showTab = showTab;
window.showAddBirthModal = showAddBirthModal;
window.closeBirthModal = closeBirthModal;
window.editBirthInfo = editBirthInfo;
window.deleteBirthInfo = deleteBirthInfo;
window.showAnalysis = showAnalysis;
window.backToBirthList = backToBirthList;
window.selectAnalysisType = selectAnalysisType;

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    initUser();
    initBirthInfo();
    initAnalysis();
});

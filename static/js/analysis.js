import { analysisAPI } from './api.js';
import { getBirthInfoList } from './birthInfo.js';
import { showToast, showLoading, hideLoading, showSection, updateAnalysisTabActive } from './ui.js';

// 当前分析的出生信息ID
let currentBirthInfoId = null;
let currentBirthInfoName = '';
let currentAnalysisType = 'bazi';
let analysisResults = {};

// 显示分析页面
export function showAnalysis(birthInfoId, nickname) {
    currentBirthInfoId = birthInfoId;
    currentBirthInfoName = nickname;
    currentAnalysisType = 'bazi';
    analysisResults = {};
    
    document.getElementById('analysisTitle').textContent = nickname;
    document.getElementById('analysisSubtitle').textContent = '请选择分析类型';
    
    showSection('analysisSection');
    updateAnalysisTabActive('bazi');
    
    // 自动加载八字分析
    selectAnalysisType('bazi');
}

// 返回出生信息列表
export function backToBirthList() {
    showSection('birthListSection');
}

// 选择分析类型
export async function selectAnalysisType(type) {
    currentAnalysisType = type;
    updateAnalysisTabActive(type);
    
    // 如果已经有缓存结果，直接显示
    if (analysisResults[type]) {
        renderAnalysisResult(analysisResults[type], type);
        return;
    }
    
    // 否则请求分析
    try {
        showLoading();
        let result;
        
        switch (type) {
            case 'bazi':
                result = await analysisAPI.bazi(currentBirthInfoId);
                break;
            case 'ziwei':
                result = await analysisAPI.ziwei(currentBirthInfoId);
                break;
            case 'astrology':
                result = await analysisAPI.astrology(currentBirthInfoId);
                break;
        }
        
        analysisResults[type] = result;
        renderAnalysisResult(result, type);
    } catch (error) {
        console.error('分析失败:', error);
        showToast('分析失败，请重试');
    } finally {
        hideLoading();
    }
}

// 渲染分析结果
function renderAnalysisResult(result, type) {
    const container = document.getElementById('analysisResult');
    
    switch (type) {
        case 'bazi':
            container.innerHTML = renderBaziResult(result);
            break;
        case 'ziwei':
            container.innerHTML = renderZiweiResult(result);
            break;
        case 'astrology':
            container.innerHTML = renderAstrologyResult(result);
            break;
    }
}

// 渲染八字分析结果
function renderBaziResult(result) {
    return `
        <div class="bg-white rounded-2xl p-6 card-shadow mb-4">
            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">🎋</span>
                八字命盘
            </h4>
            <div class="grid grid-cols-4 gap-3">
                <div class="text-center">
                    <div class="text-sm text-gray-500 mb-2">年柱</div>
                    <div class="bg-gradient-to-br from-red-400 to-pink-400 text-white rounded-lg py-3 px-2 font-bold text-lg">
                        ${result.bazi.year}
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-500 mb-2">月柱</div>
                    <div class="bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-lg py-3 px-2 font-bold text-lg">
                        ${result.bazi.month}
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-500 mb-2">日柱</div>
                    <div class="bg-gradient-to-br from-green-400 to-emerald-400 text-white rounded-lg py-3 px-2 font-bold text-lg">
                        ${result.bazi.day}
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-500 mb-2">时柱</div>
                    <div class="bg-gradient-to-br from-purple-400 to-indigo-400 text-white rounded-lg py-3 px-2 font-bold text-lg">
                        ${result.bazi.hour}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 card-shadow mb-4">
            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">☯️</span>
                五行分布
            </h4>
            <div class="space-y-3">
                ${Object.entries(result.wuxing).map(([element, count]) => `
                    <div class="flex items-center">
                        <span class="w-12 font-medium text-gray-700">${element}</span>
                        <div class="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                            <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium" style="width: ${count * 20}%">
                                ${count}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 card-shadow">
            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">📖</span>
                命理解析
            </h4>
            <div class="space-y-4">
                ${Object.entries(result.analysis).map(([key, value]) => `
                    <div class="border-l-4 border-purple-500 pl-4">
                        <h5 class="font-bold text-gray-800 mb-2">${key}</h5>
                        <p class="text-gray-600 leading-relaxed">${value}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 渲染紫微斗数结果
function renderZiweiResult(result) {
    return `
        <div class="bg-white rounded-2xl p-6 card-shadow mb-4">
            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">⭐</span>
                紫微命盘
            </h4>
            <div class="grid grid-cols-2 gap-3">
                ${Object.entries(result.mingpan).map(([gong, info]) => `
                    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                        <div class="font-bold text-purple-800 mb-2">${gong}</div>
                        <div class="text-sm text-gray-700">
                            <div class="mb-1">主星: <span class="font-medium text-purple-600">${info.主星}</span></div>
                            ${info.副星 && info.副星.length > 0 ? `
                                <div class="mb-1">副星: <span class="text-gray-600">${info.副星.join('、')}</span></div>
                            ` : ''}
                            <div class="text-xs text-gray-500">${info.位置}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 card-shadow">
            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">📖</span>
                命理解析
            </h4>
            <div class="space-y-4">
                ${Object.entries(result.analysis).map(([key, value]) => `
                    <div class="border-l-4 border-purple-500 pl-4">
                        <h5 class="font-bold text-gray-800 mb-2">${key}</h5>
                        <p class="text-gray-600 leading-relaxed">${value}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 渲染星盘分析结果
function renderAstrologyResult(result) {
    return `
        <div class="bg-white rounded-2xl p-6 card-shadow mb-4">
            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">🌟</span>
                核心星座
            </h4>
            <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-3xl mb-2">
                        ☀️
                    </div>
                    <div class="font-bold text-gray-800">太阳星座</div>
                    <div class="text-purple-600 font-medium">${result.sun_sign}</div>
                </div>
                <div class="text-center">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-3xl mb-2">
                        🌙
                    </div>
                    <div class="font-bold text-gray-800">月亮星座</div>
                    <div class="text-purple-600 font-medium">${result.moon_sign}</div>
                </div>
                <div class="text-center">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-3xl mb-2">
                        ⬆️
                    </div>
                    <div class="font-bold text-gray-800">上升星座</div>
                    <div class="text-purple-600 font-medium">${result.rising_sign}</div>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 card-shadow mb-4">
            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">🪐</span>
                行星分布
            </h4>
            <div class="space-y-3">
                ${Object.entries(result.planets).map(([planet, info]) => `
                    <div class="flex items-center justify-between bg-gradient-to-r from-purple-50 to-transparent rounded-lg p-3">
                        <div class="font-medium text-gray-800">${planet}</div>
                        <div class="text-sm text-gray-600">
                            <span class="text-purple-600 font-medium">${info.sign}</span>
                            <span class="mx-2">•</span>
                            <span>${info.house}</span>
                            <span class="mx-2">•</span>
                            <span class="text-gray-500">${info.degree}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 card-shadow">
            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">📖</span>
                星盘解析
            </h4>
            <div class="space-y-4">
                ${Object.entries(result.analysis).map(([key, value]) => `
                    <div class="border-l-4 border-purple-500 pl-4">
                        <h5 class="font-bold text-gray-800 mb-2">${key}</h5>
                        <p class="text-gray-600 leading-relaxed">${value}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 初始化分析模块
export function initAnalysis() {
    // 可以在这里添加初始化逻辑
}

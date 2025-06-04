// 全局变量和状态
let currentScript = {
    title: '',
    versions: [
        {
            id: 1,
            name: '版本 1',
            sections: []
        }
    ],
    currentVersionId: 1
};

let currentSectionId = null; // 当前正在编辑的片段ID（用于AI生成）
let selectedVersionsForCompare = []; // 用于多版本对比的已选版本
let currentSectionForVersionManagement = null; // 当前正在管理版本的片段ID

// DOM元素
const scriptTitle = document.getElementById('scriptTitle');
const versionSelect = document.getElementById('versionSelect');
const versionName = document.getElementById('versionName');
const scriptSections = document.getElementById('scriptSections');
const sectionTemplate = document.getElementById('sectionTemplate');
const sectionVersionTemplate = document.getElementById('sectionVersionTemplate');
const addSectionBtn = document.getElementById('addSectionBtn');
const addVersionBtn = document.getElementById('addVersionBtn');
const deleteVersionBtn = document.getElementById('deleteVersionBtn');
const previewBtn = document.getElementById('previewBtn');
const compareBtn = document.getElementById('compareBtn');
const newScriptBtn = document.getElementById('newScriptBtn');
const exportScriptBtn = document.getElementById('exportScriptBtn');
const importScriptInput = document.getElementById('importScriptInput');

// 模态框
const aiModal = document.getElementById('aiModal');
const aiPrompt = document.getElementById('aiPrompt');
const generateBtn = document.getElementById('generateBtn');
const aiResult = document.getElementById('aiResult');
const aiResultText = document.getElementById('aiResultText');
const useAiResultBtn = document.getElementById('useAiResultBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const previewModal = document.getElementById('previewModal');
const previewVersionSelect = document.getElementById('previewVersionSelect');
const previewContent = document.getElementById('previewContent');
const generateAudioBtn = document.getElementById('generateAudioBtn');
const copyTextBtn = document.getElementById('copyTextBtn');
const audioPlayer = document.getElementById('audioPlayer');
const meditationAudio = document.getElementById('meditationAudio');
const compareModal = document.getElementById('compareModal');
const compareVersionsCheckboxes = document.getElementById('compareVersionsCheckboxes');
const compareContent = document.getElementById('compareContent');

// 关闭模态框
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        aiModal.style.display = 'none';
        previewModal.style.display = 'none';
        compareModal.style.display = 'none';
    });
});

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
    if (e.target === aiModal) {
        aiModal.style.display = 'none';
    }
    if (e.target === previewModal) {
        previewModal.style.display = 'none';
    }
    if (e.target === compareModal) {
        compareModal.style.display = 'none';
    }
});

// 初始化应用
function initApp() {
    loadFromLocalStorage();
    renderCurrentVersion();
    
    // 添加事件监听器
    scriptTitle.addEventListener('input', handleScriptTitleChange);
    versionSelect.addEventListener('change', handleVersionChange);
    versionName.addEventListener('input', handleVersionNameChange);
    addSectionBtn.addEventListener('click', handleAddSection);
    addVersionBtn.addEventListener('click', handleAddVersion);
    deleteVersionBtn.addEventListener('click', handleDeleteVersion);
    previewBtn.addEventListener('click', handlePreview);
    compareBtn.addEventListener('click', handleCompare);
    newScriptBtn.addEventListener('click', handleNewScript);
    exportScriptBtn.addEventListener('click', handleExportScript);
    importScriptInput.addEventListener('change', handleImportScript);
    generateBtn.addEventListener('click', handleGenerateAiContent);
    useAiResultBtn.addEventListener('click', handleUseAiResult);
    regenerateBtn.addEventListener('click', handleRegenerateAiContent);
    generateAudioBtn.addEventListener('click', handleGenerateAudio);
    copyTextBtn.addEventListener('click', handleCopyText);
}

// 从本地存储加载数据
function loadFromLocalStorage() {
    const savedScript = localStorage.getItem('meditationScript');
    if (savedScript) {
        try {
            currentScript = JSON.parse(savedScript);
            
            // 确保每个片段都有visible属性（兼容旧数据）
            currentScript.versions.forEach(version => {
                version.sections.forEach(section => {
                    if (section.visible === undefined) {
                        section.visible = true;
                    }
                    // 确保每个片段都有title属性（兼容旧数据）
                    if (section.title === undefined) {
                        section.title = `片段 ${section.id}`;
                    }
                    // 确保每个片段都有versions属性（兼容旧数据）
                    if (section.versions === undefined) {
                        section.versions = [{
                            id: 1,
                            text: section.text,
                            pauseDuration: section.pauseDuration
                        }];
                        section.currentVersionId = 1;
                    }
                });
            });
            
            scriptTitle.value = currentScript.title;
            updateVersionSelect();
        } catch (e) {
            console.error('Failed to load script from localStorage:', e);
        }
    } else {
        handleAddSection(); // 添加一个初始片段
    }
}

// 保存到本地存储
function saveToLocalStorage() {
    try {
        localStorage.setItem('meditationScript', JSON.stringify(currentScript));
    } catch (e) {
        console.error('Failed to save script to localStorage:', e);
    }
}

// 更新版本下拉选择框
function updateVersionSelect() {
    versionSelect.innerHTML = '';
    previewVersionSelect.innerHTML = '';
    
    currentScript.versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version.id;
        option.textContent = version.name || `版本 ${version.id}`;
        
        const previewOption = option.cloneNode(true);
        
        versionSelect.appendChild(option);
        previewVersionSelect.appendChild(previewOption);
    });
    
    versionSelect.value = currentScript.currentVersionId;
    previewVersionSelect.value = currentScript.currentVersionId;
    
    // 更新版本名称输入框
    const currentVersion = getCurrentVersion();
    versionName.value = currentVersion.name || `版本 ${currentVersion.id}`;
}

// 获取当前版本
function getCurrentVersion() {
    return currentScript.versions.find(v => v.id === currentScript.currentVersionId);
}

// 获取指定片段
function getSection(sectionId) {
    const currentVersion = getCurrentVersion();
    return currentVersion.sections.find(s => s.id === sectionId);
}

// 获取片段当前版本
function getSectionCurrentVersion(section) {
    return section.versions.find(v => v.id === section.currentVersionId);
}

// 渲染当前版本
function renderCurrentVersion() {
    const currentVersion = getCurrentVersion();
    scriptSections.innerHTML = '';
    
    if (currentVersion && currentVersion.sections) {
        currentVersion.sections.forEach((section, index) => {
            addSectionToDOM(section, index + 1);
        });
    }
}

// 向DOM添加片段
function addSectionToDOM(section, number) {
    const sectionClone = document.importNode(sectionTemplate.content, true);
    const sectionElement = sectionClone.querySelector('.script-section');
    
    sectionElement.dataset.id = section.id;
    
    // 设置片段标题
    const sectionTitleDisplay = sectionClone.querySelector('.section-title-display');
    const sectionTitleEdit = sectionClone.querySelector('.section-title-edit');
    sectionTitleDisplay.textContent = section.title || `片段 ${number}`;
    sectionTitleEdit.value = section.title || `片段 ${number}`;
    
    // 获取当前片段版本
    const currentSectionVersion = getSectionCurrentVersion(section);
    
    // 设置文本和停顿时长
    sectionClone.querySelector('.section-text').value = currentSectionVersion.text || '';
    sectionClone.querySelector('.pause-seconds').value = currentSectionVersion.pauseDuration || 3;
    
    // 设置可见性复选框状态
    const visibilityCheckbox = sectionClone.querySelector('.visibility-checkbox');
    visibilityCheckbox.checked = section.visible !== false;
    
    // 根据可见性更新UI样式
    if (section.visible === false) {
        sectionElement.classList.add('hidden-section');
    }
    
    // 添加事件监听器
    // 1. 文本和停顿时长变更
    const textArea = sectionClone.querySelector('.section-text');
    textArea.addEventListener('input', () => handleSectionTextChange(section.id, textArea.value));
    
    const pauseInput = sectionClone.querySelector('.pause-seconds');
    pauseInput.addEventListener('input', () => handlePauseDurationChange(section.id, pauseInput.value));
    
    // 2. 标题编辑
    const editTitleBtn = sectionClone.querySelector('.edit-title');
    editTitleBtn.addEventListener('click', () => {
        if (sectionTitleDisplay.classList.contains('hidden')) {
            // 保存标题
            sectionTitleDisplay.textContent = sectionTitleEdit.value;
            sectionTitleDisplay.classList.remove('hidden');
            sectionTitleEdit.classList.add('hidden');
            editTitleBtn.textContent = '编辑';
            
            // 更新数据
            handleSectionTitleChange(section.id, sectionTitleEdit.value);
        } else {
            // 显示编辑框
            sectionTitleDisplay.classList.add('hidden');
            sectionTitleEdit.classList.remove('hidden');
            sectionTitleEdit.focus();
            editTitleBtn.textContent = '保存';
        }
    });
    
    // 编辑框回车确认
    sectionTitleEdit.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            editTitleBtn.click();
        }
    });
    
    // 3. 版本管理
    const sectionVersionsBtn = sectionClone.querySelector('.section-versions-btn');
    const sectionVersions = sectionClone.querySelector('.section-versions');
    const sectionVersionsList = sectionClone.querySelector('.section-versions-list');
    const addSectionVersionBtn = sectionClone.querySelector('.add-section-version');
    
    // 如果片段有多个版本，默认展开版本列表
    if (section.versions.length > 1) {
        sectionVersions.classList.remove('hidden');
        sectionVersionsBtn.textContent = '关闭版本';
        renderSectionVersions(section.id, sectionVersionsList);
        currentSectionForVersionManagement = section.id;
    }
    
    sectionVersionsBtn.addEventListener('click', () => {
        if (sectionVersions.classList.contains('hidden')) {
            sectionVersions.classList.remove('hidden');
            sectionVersionsBtn.textContent = '关闭版本';
            renderSectionVersions(section.id, sectionVersionsList);
            currentSectionForVersionManagement = section.id;
        } else {
            sectionVersions.classList.add('hidden');
            sectionVersionsBtn.textContent = '版本';
            currentSectionForVersionManagement = null;
        }
    });
    
    addSectionVersionBtn.addEventListener('click', () => {
        handleAddSectionVersion(section.id);
    });
    
    // 4. 可见性切换
    visibilityCheckbox.addEventListener('change', () => {
        handleSectionVisibilityChange(section.id, visibilityCheckbox.checked);
        if (visibilityCheckbox.checked) {
            sectionElement.classList.remove('hidden-section');
        } else {
            sectionElement.classList.add('hidden-section');
        }
    });
    
    // 5. AI生成和删除
    const aiGenBtn = sectionClone.querySelector('.ai-generate');
    aiGenBtn.addEventListener('click', () => handleOpenAiModal(section.id));
    
    const deleteBtn = sectionClone.querySelector('.delete-section');
    deleteBtn.addEventListener('click', () => handleDeleteSection(section.id));
    
    // 添加"添加片段"按钮事件
    const addSectionAfterBtn = sectionClone.querySelector('.add-section-after');
    addSectionAfterBtn.addEventListener('click', () => {
        handleAddSectionAfter(section.id);
    });
    
    scriptSections.appendChild(sectionClone);
}

// 处理脚本标题变更
function handleScriptTitleChange() {
    currentScript.title = scriptTitle.value;
    saveToLocalStorage();
}

// 处理版本名称变更
function handleVersionNameChange() {
    const currentVersion = getCurrentVersion();
    if (currentVersion) {
        currentVersion.name = versionName.value.trim() || `版本 ${currentVersion.id}`;
        updateVersionSelect();
        saveToLocalStorage();
    }
}

// 处理版本变更
function handleVersionChange() {
    currentScript.currentVersionId = parseInt(versionSelect.value);
    const currentVersion = getCurrentVersion();
    versionName.value = currentVersion.name || `版本 ${currentVersion.id}`;
    renderCurrentVersion();
    saveToLocalStorage();
}

// 处理片段标题变更
function handleSectionTitleChange(sectionId, title) {
    const section = getSection(sectionId);
    if (section) {
        section.title = title;
        saveToLocalStorage();
    }
}

// 处理片段文本变更
function handleSectionTextChange(sectionId, text) {
    const section = getSection(sectionId);
    
    if (section) {
        // 更新当前片段版本的文本
        const currentSectionVersion = getSectionCurrentVersion(section);
        currentSectionVersion.text = text;
        saveToLocalStorage();
    }
}

// 处理停顿时长变更
function handlePauseDurationChange(sectionId, duration) {
    const section = getSection(sectionId);
    
    if (section) {
        // 更新当前片段版本的停顿时长
        const currentSectionVersion = getSectionCurrentVersion(section);
        currentSectionVersion.pauseDuration = parseInt(duration) || 0;
        saveToLocalStorage();
    }
}

// 处理片段可见性变更
function handleSectionVisibilityChange(sectionId, isVisible) {
    const section = getSection(sectionId);
    
    if (section) {
        section.visible = isVisible;
        saveToLocalStorage();
    }
}

// 渲染片段的版本列表
function renderSectionVersions(sectionId, sectionVersionsList) {
    const section = getSection(sectionId);
    if (!section) return;
    
    sectionVersionsList.innerHTML = '';
    
    section.versions.forEach(version => {
        const versionElement = document.importNode(sectionVersionTemplate.content, true);
        
        // 设置版本编号和名称
        const versionNumber = versionElement.querySelector('.section-version-number');
        const versionName = versionElement.querySelector('.section-version-name');
        const editNameBtn = versionElement.querySelector('.edit-version-name');
        
        versionNumber.textContent = version.name || `版本 ${version.id}`;
        versionName.value = version.name || `版本 ${version.id}`;
        
        // 添加版本名称编辑功能
        editNameBtn.addEventListener('click', () => {
            if (versionName.classList.contains('hidden')) {
                // 显示编辑框
                versionNumber.classList.add('hidden');
                versionName.classList.remove('hidden');
                versionName.focus();
                editNameBtn.textContent = '保存';
            } else {
                // 保存名称
                const newName = versionName.value.trim() || `版本 ${version.id}`;
                version.name = newName;
                versionNumber.textContent = newName;
                versionNumber.classList.remove('hidden');
                versionName.classList.add('hidden');
                editNameBtn.textContent = '编辑名称';
                saveToLocalStorage();
            }
        });
        
        // 编辑框回车确认
        versionName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                editNameBtn.click();
            }
        });
        
        // 设置预览内容（截取前30个字符）
        const previewText = version.text || '';
        versionElement.querySelector('.section-version-preview').textContent = previewText.length > 30 ? 
            previewText.substring(0, 30) + '...' : previewText;
        
        // 添加使用按钮事件
        const useBtn = versionElement.querySelector('.use-section-version');
        useBtn.addEventListener('click', () => {
            handleUseSectionVersion(sectionId, version.id);
        });
        
        // 添加删除按钮事件（除非只有一个版本）
        const deleteBtn = versionElement.querySelector('.delete-section-version');
        if (section.versions.length <= 1) {
            deleteBtn.disabled = true;
            deleteBtn.style.opacity = 0.5;
        } else {
            deleteBtn.addEventListener('click', () => {
                handleDeleteSectionVersion(sectionId, version.id);
            });
        }
        
        // 高亮当前使用的版本
        const versionItem = versionElement.querySelector('.section-version-item');
        if (version.id === section.currentVersionId) {
            versionItem.classList.add('current-version');
        }
        
        sectionVersionsList.appendChild(versionElement);
    });
}

// 添加片段版本
function handleAddSectionVersion(sectionId) {
    const section = getSection(sectionId);
    if (!section) return;
    
    // 创建新版本（复制当前使用的版本）
    const currentSectionVersion = getSectionCurrentVersion(section);
    const newVersionId = section.versions.length + 1;
    
    const newVersion = {
        id: newVersionId,
        name: `版本 ${newVersionId}`, // 添加默认版本名称
        text: currentSectionVersion.text,
        pauseDuration: currentSectionVersion.pauseDuration
    };
    
    section.versions.push(newVersion);
    section.currentVersionId = newVersionId;
    
    // 更新显示
    const sectionElement = document.querySelector(`.script-section[data-id="${sectionId}"]`);
    if (sectionElement) {
        const textArea = sectionElement.querySelector('.section-text');
        const pauseInput = sectionElement.querySelector('.pause-seconds');
        
        textArea.value = newVersion.text;
        pauseInput.value = newVersion.pauseDuration;
        
        const sectionVersionsList = sectionElement.querySelector('.section-versions-list');
        renderSectionVersions(sectionId, sectionVersionsList);
    }
    
    saveToLocalStorage();
}

// 使用指定版本
function handleUseSectionVersion(sectionId, versionId) {
    const section = getSection(sectionId);
    if (!section) return;
    
    section.currentVersionId = versionId;
    const versionToUse = section.versions.find(v => v.id === versionId);
    
    // 更新显示
    const sectionElement = document.querySelector(`.script-section[data-id="${sectionId}"]`);
    if (sectionElement) {
        const textArea = sectionElement.querySelector('.section-text');
        const pauseInput = sectionElement.querySelector('.pause-seconds');
        
        textArea.value = versionToUse.text;
        pauseInput.value = versionToUse.pauseDuration;
        
        const sectionVersionsList = sectionElement.querySelector('.section-versions-list');
        renderSectionVersions(sectionId, sectionVersionsList);
    }
    
    saveToLocalStorage();
}

// 删除片段版本
function handleDeleteSectionVersion(sectionId, versionId) {
    const section = getSection(sectionId);
    if (!section || section.versions.length <= 1) return;
    
    // 确认是否删除
    if (!confirm(`确定要删除版本 ${versionId} 吗？`)) {
        return;
    }
    
    const versionIndex = section.versions.findIndex(v => v.id === versionId);
    section.versions.splice(versionIndex, 1);
    
    // 如果删除的是当前使用的版本，切换到第一个版本
    if (section.currentVersionId === versionId) {
        section.currentVersionId = section.versions[0].id;
        const versionToUse = section.versions[0];
        
        // 更新显示
        const sectionElement = document.querySelector(`.script-section[data-id="${sectionId}"]`);
        if (sectionElement) {
            const textArea = sectionElement.querySelector('.section-text');
            const pauseInput = sectionElement.querySelector('.pause-seconds');
            
            textArea.value = versionToUse.text;
            pauseInput.value = versionToUse.pauseDuration;
        }
    }
    
    // 更新版本列表
    const sectionElement = document.querySelector(`.script-section[data-id="${sectionId}"]`);
    if (sectionElement) {
        const sectionVersionsList = sectionElement.querySelector('.section-versions-list');
        renderSectionVersions(sectionId, sectionVersionsList);
    }
    
    saveToLocalStorage();
}

// 添加新版本
function handleAddVersion() {
    const newVersionId = currentScript.versions.length + 1;
    
    // 复制当前版本作为新版本的起点
    const currentVersion = getCurrentVersion();
    const newSections = currentVersion.sections.map(section => ({
        ...section,
        id: Date.now() + section.id // 创建新的ID
    }));
    
    const newVersion = {
        id: newVersionId,
        name: `版本 ${newVersionId}`,
        sections: newSections
    };
    
    currentScript.versions.push(newVersion);
    currentScript.currentVersionId = newVersionId;
    
    updateVersionSelect();
    renderCurrentVersion();
    saveToLocalStorage();
}

// 删除当前版本
function handleDeleteVersion() {
    if (currentScript.versions.length <= 1) {
        alert('至少需要保留一个版本！');
        return;
    }
    
    const versionToDelete = currentScript.currentVersionId;
    const versionIndex = currentScript.versions.findIndex(v => v.id === versionToDelete);
    
    currentScript.versions.splice(versionIndex, 1);
    
    // 如果删除的是最后一个版本，选择前一个版本
    if (versionIndex >= currentScript.versions.length) {
        currentScript.currentVersionId = currentScript.versions[currentScript.versions.length - 1].id;
    } else {
        currentScript.currentVersionId = currentScript.versions[versionIndex].id;
    }
    
    updateVersionSelect();
    renderCurrentVersion();
    saveToLocalStorage();
}

// 删除片段
function handleDeleteSection(sectionId) {
    const currentVersion = getCurrentVersion();
    const sectionIndex = currentVersion.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex !== -1) {
        currentVersion.sections.splice(sectionIndex, 1);
        renderCurrentVersion();
        saveToLocalStorage();
    }
}

// 打开AI生成模态框
function handleOpenAiModal(sectionId) {
    currentSectionId = sectionId;
    aiPrompt.value = '';
    aiResult.classList.add('hidden');
    aiResultText.textContent = '';
    aiModal.style.display = 'block';
}

// 模拟AI生成内容
async function handleGenerateAiContent() {
    const prompt = aiPrompt.value.trim();
    if (!prompt) {
        alert('请输入提示词描述你想要的内容');
        return;
    }
    
    const style = document.querySelector('input[name="aiStyle"]:checked').value;
    
    // 显示加载状态
    generateBtn.textContent = '生成中...';
    generateBtn.disabled = true;
    
    try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 根据不同风格生成不同的占位文本
        let generatedText;
        
        if (style === 'calm') {
            generatedText = generateCalmText(prompt);
        } else if (style === 'poetic') {
            generatedText = generatePoeticText(prompt);
        } else {
            generatedText = generateMindfulText(prompt);
        }
        
        aiResultText.textContent = generatedText;
        aiResult.classList.remove('hidden');
    } catch (error) {
        console.error('内容生成失败', error);
        alert('内容生成失败，请重试');
    } finally {
        generateBtn.textContent = '生成内容';
        generateBtn.disabled = false;
    }
}

// 使用生成的内容
function handleUseAiResult() {
    const generatedText = aiResultText.textContent;
    
    if (currentSectionId) {
        const section = getSection(currentSectionId);
        
        if (section) {
            // 更新当前片段版本的文本
            const currentSectionVersion = getSectionCurrentVersion(section);
            currentSectionVersion.text = generatedText;
            
            // 更新DOM
            const sectionElement = document.querySelector(`.script-section[data-id="${currentSectionId}"]`);
            if (sectionElement) {
                sectionElement.querySelector('.section-text').value = generatedText;
            }
            
            saveToLocalStorage();
            aiModal.style.display = 'none';
        }
    }
}

// 重新生成AI内容
function handleRegenerateAiContent() {
    handleGenerateAiContent();
}

// 预览脚本
function handlePreview() {
    updatePreviewContent();
    audioPlayer.classList.add('hidden');
    previewModal.style.display = 'block';
    
    // 设置预览版本选择框事件
    previewVersionSelect.onchange = updatePreviewContent;
}

// 更新预览内容
function updatePreviewContent() {
    const versionId = parseInt(previewVersionSelect.value);
    const version = currentScript.versions.find(v => v.id === versionId);
    
    if (version) {
        let content = '';
        
        version.sections.forEach((section, index) => {
            // 只显示标记为可见的片段
            if (section.visible !== false) {
                // 获取片段当前使用的版本
                const sectionVersion = section.versions.find(v => v.id === section.currentVersionId);
                
                if (sectionVersion && sectionVersion.text) {
                    // 只添加片段内容和停顿时长，不添加片段标题
                    content += sectionVersion.text + '\n\n';
                    
                    if (sectionVersion.pauseDuration > 0) {
                        content += `[停顿 ${sectionVersion.pauseDuration} 秒]\n\n`;
                    }
                }
            }
        });
        
        previewContent.textContent = content;
    }
}

// 生成语音
function handleGenerateAudio() {
    // 实际应用中，这里会调用语音合成API
    // 这里只是简单模拟
    alert('语音合成功能将在后续版本中实现');
    
    // 模拟语音生成成功后显示播放器
    audioPlayer.classList.remove('hidden');
    
    // 如果有实际的音频生成，可以这样设置
    // meditationAudio.src = '生成的音频URL';
}

// 复制文本
function handleCopyText() {
    const text = previewContent.textContent;
    
    if (text) {
        navigator.clipboard.writeText(text)
            .then(() => alert('文本已复制到剪贴板'))
            .catch(err => {
                console.error('无法复制文本: ', err);
                alert('复制失败，请手动选择并复制文本');
            });
    }
}

// 打开多版本对比模态框
function handleCompare() {
    // 重置已选版本
    selectedVersionsForCompare = [];
    
    // 生成版本复选框
    compareVersionsCheckboxes.innerHTML = '';
    
    currentScript.versions.forEach(version => {
        const label = document.createElement('label');
        label.className = 'compare-version-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = version.id;
        checkbox.checked = false;
        
        // 默认选中前两个版本
        if (selectedVersionsForCompare.length < 2) {
            checkbox.checked = true;
            selectedVersionsForCompare.push(version.id);
        }
        
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedVersionsForCompare.push(parseInt(checkbox.value));
            } else {
                selectedVersionsForCompare = selectedVersionsForCompare.filter(
                    id => id !== parseInt(checkbox.value)
                );
            }
            updateCompareContent();
        });
        
        const span = document.createElement('span');
        span.textContent = version.name || `版本 ${version.id}`;
        
        label.appendChild(checkbox);
        label.appendChild(span);
        
        compareVersionsCheckboxes.appendChild(label);
    });
    
    // 显示模态框
    compareModal.style.display = 'block';
    
    // 更新对比内容
    updateCompareContent();
}

// 更新多版本对比内容
function updateCompareContent() {
    compareContent.innerHTML = '';
    
    // 获取选中的版本
    const versions = currentScript.versions.filter(v => 
        selectedVersionsForCompare.includes(v.id)
    );
    
    // 添加每个版本的内容列
    versions.forEach(version => {
        const column = document.createElement('div');
        column.className = 'compare-version-column';
        
        // 添加版本标题
        const header = document.createElement('div');
        header.className = 'compare-version-header';
        header.textContent = version.name || `版本 ${version.id}`;
        column.appendChild(header);
        
        // 添加版本内容
        const content = document.createElement('div');
        content.className = 'compare-version-text';
        
        let text = '';
        version.sections.forEach(section => {
            // 只显示标记为可见的片段
            if (section.visible !== false) {
                // 获取片段当前使用的版本
                const sectionVersion = section.versions.find(v => v.id === section.currentVersionId);
                
                if (sectionVersion && sectionVersion.text) {
                    // 只添加片段内容和停顿时长，不添加片段标题
                    text += sectionVersion.text + '\n\n';
                    
                    if (sectionVersion.pauseDuration > 0) {
                        text += `[停顿 ${sectionVersion.pauseDuration} 秒]\n\n`;
                    }
                }
            }
        });
        
        content.textContent = text;
        column.appendChild(content);
        
        compareContent.appendChild(column);
    });
    
    // 如果没有选中任何版本，显示提示
    if (versions.length === 0) {
        const message = document.createElement('div');
        message.className = 'no-versions-message';
        message.textContent = '请选择至少一个版本来进行对比';
        compareContent.appendChild(message);
    }
}

// 新建脚本
function handleNewScript() {
    if (confirm('确定要创建新脚本吗？当前脚本将被保存。')) {
        // 保存当前脚本
        localStorage.setItem('meditationScript', JSON.stringify(currentScript));
        
        // 重置脚本
        currentScript = {
            title: '',
            versions: [
                {
                    id: 1,
                    name: '版本 1',
                    sections: []
                }
            ],
            currentVersionId: 1
        };
        
        // 重置UI
        scriptTitle.value = '';
        updateVersionSelect();
        renderCurrentVersion();
        handleAddSection(); // 添加一个初始片段
    }
}

// 生成冥想文本（不同风格）
function generateCalmText(prompt) {
    // 这里是模拟的生成结果
    const calmTemplates = [
        "慢慢地深呼吸，感受空气流入你的身体。让每一次呼吸都带走一点紧张和压力。",
        "闭上眼睛，感受这一刻的平静。让你的思绪像云一样自由飘过，不要试图抓住它们。",
        "感受你的身体与地面或座椅的接触点，将注意力带到这些接触点上，让它们成为你的锚定。",
        "让你的呼吸变得深沉而均匀，每一次吸气都带来新鲜的能量，每一次呼气都带走所有的疲惫。"
    ];
    
    return calmTemplates[Math.floor(Math.random() * calmTemplates.length)] + 
           " " + prompt.slice(0, 10) + "... 让这种感觉流过你的全身，带来深度的放松和平静。";
}

function generatePoeticText(prompt) {
    // 这里是模拟的生成结果
    const poeticTemplates = [
        "如清晨的露珠滑落树叶，让你的思绪轻盈地滑走，留下纯净的当下。",
        "像高山流水一般，让你的呼吸流淌，穿过身体的每一处山谷和峡湾。",
        "宛如月光照耀平静的湖面，让内心的波澜逐渐平息，映照出本真的自我。",
        "如同春风拂过花海，让你的觉知轻抚身体的每一个角落，唤醒沉睡的感官。"
    ];
    
    return poeticTemplates[Math.floor(Math.random() * poeticTemplates.length)] + 
           " " + prompt.slice(0, 10) + "... 在这诗意的时刻里，找到内心深处的那份宁静与和谐。";
}

function generateMindfulText(prompt) {
    // 这里是模拟的生成结果
    const mindfulTemplates = [
        "带着友善和温暖的态度，邀请你来到这一刻的体验中，如同老朋友相见一般亲切自然。",
        "像是握着一位朋友的手，温柔地把注意力带到你的呼吸上，感受这份亲切的陪伴。",
        "当思绪漫游时，像对待一个亲密的朋友那样，以理解和包容的态度，轻轻地将注意力带回当下。",
        "用温暖而亲切的态度对待自己，就像你对待最珍视的人那样，接纳此刻所有的感受。"
    ];
    
    return mindfulTemplates[Math.floor(Math.random() * mindfulTemplates.length)] + 
           " " + prompt.slice(0, 10) + "... 在这份亲切温暖的陪伴中，体验内心深处的宁静。";
}

// 导出脚本
function handleExportScript() {
    // 确保当前脚本已保存
    saveToLocalStorage();
    
    // 创建导出数据
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        script: currentScript,
        metadata: {
            totalSections: currentScript.versions.reduce((sum, v) => sum + v.sections.length, 0),
            totalVersions: currentScript.versions.length,
            lastModified: new Date().toISOString()
        }
    };
    
    // 创建Blob对象
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // 生成文件名：脚本标题_日期时间.json
    const date = new Date();
    const dateStr = date.toISOString().replace(/[:.]/g, '-').split('T')[0];
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
    const fileName = `${currentScript.title || '冥想脚本'}_${dateStr}_${timeStr}.json`;
    
    a.download = fileName;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // 显示导出成功提示
    showExportSuccessMessage();
}

// 显示导出成功提示
function showExportSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'export-message';
    message.innerHTML = `
        <div class="export-message-content">
            <h3>导出成功！</h3>
            <p>建议您：</p>
            <ul>
                <li>定期导出脚本作为备份</li>
                <li>将备份文件保存在安全的位置</li>
                <li>可以使用云存储服务保存备份</li>
            </ul>
            <button class="btn primary close-message">知道了</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // 添加关闭按钮事件
    message.querySelector('.close-message').addEventListener('click', () => {
        document.body.removeChild(message);
    });
    
    // 3秒后自动关闭
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 5000);
}

// 导入脚本
function handleImportScript(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // 验证导入数据
            if (!importData.script || !importData.script.versions || !Array.isArray(importData.script.versions)) {
                throw new Error('无效的脚本文件格式');
            }
            
            // 确认是否覆盖当前脚本
            if (currentScript.versions.length > 0) {
                if (!confirm('导入新脚本将覆盖当前脚本，是否继续？\n\n建议先导出当前脚本作为备份。')) {
                    return;
                }
            }
            
            // 更新当前脚本
            currentScript = importData.script;
            
            // 更新UI
            scriptTitle.value = currentScript.title;
            updateVersionSelect();
            renderCurrentVersion();
            
            // 保存到本地存储
            saveToLocalStorage();
            
            // 显示导入成功提示
            alert('脚本导入成功！\n\n导入的脚本包含：\n' +
                  `- ${importData.metadata?.totalSections || '未知'} 个片段\n` +
                  `- ${importData.metadata?.totalVersions || '未知'} 个版本\n` +
                  `- 导出时间：${importData.exportDate || '未知'}`);
        } catch (error) {
            console.error('导入脚本失败:', error);
            alert('导入失败：无效的脚本文件格式');
        }
        
        // 重置文件输入
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

// 添加新函数：在指定片段后添加新片段
function handleAddSectionAfter(sectionId) {
    const currentVersion = getCurrentVersion();
    const sectionIndex = currentVersion.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex !== -1) {
        const newSectionId = Date.now();
        const newSection = {
            id: newSectionId,
            title: `片段 ${currentVersion.sections.length + 1}`,
            visible: true,
            versions: [
                {
                    id: 1,
                    text: '',
                    pauseDuration: 3
                }
            ],
            currentVersionId: 1
        };
        
        // 在指定片段后插入新片段
        currentVersion.sections.splice(sectionIndex + 1, 0, newSection);
        
        // 重新渲染所有片段
        renderCurrentVersion();
        saveToLocalStorage();
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', initApp); 
# 冥想脚本创作平台

一个简洁优雅的冥想脚本创作工具，帮助用户创建、编辑和预览冥想引导文案。

## 功能特点

### 1. 人工填写冥想片段
- 每个冥想片段支持多个版本
- 支持为每个片段单独管理多个版本（新增、删除、修改和切换）
- 片段标题支持自定义修改
- 可以为每个时长创建不同版本的冥想稿
- 支持在版本间切换和预览
- 可以新增、保存和删除版本
- 可以在片段后填写停顿时长
- 支持开关控制片段是否显示在最终脚本中

### 2. AI生成内容
- 在任意片段中点击"AI生成"按钮
- 输入提示词描述想要的内容
- 选择期望的文案风格
- 点击"生成内容"获取AI建议
- 可以重新生成或使用生成的内容

### 3. 多版本预览与对比
- 在预览模态框中切换不同版本
- 查看完整的冥想引导文案
- 可以为每个版本生成语音
- 支持复制文本到剪贴板
- 支持横向对比查看多个版本的完整脚本

## 使用方法

1. 打开`index.html`文件，即可直接使用本应用
2. 所有数据存储在本地浏览器中，无需担心数据丢失
3. 点击"新建脚本"可以创建新的冥想脚本
4. 点击"保存脚本"会将当前脚本保存到本地存储中
5. 使用片段旁的复选框控制是否在最终脚本中显示该片段
6. 点击"多版本对比"可以横向对比查看不同版本的脚本内容
7. 点击片段的"版本"按钮可以管理该片段的多个版本
8. 点击片段标题旁的"编辑"按钮可以自定义片段标题

## 技术说明

本应用使用纯HTML、CSS和JavaScript构建，无需任何额外依赖或后端服务器：

- HTML：提供基础页面结构和模板
- CSS：提供日式极简风格的界面设计
- JavaScript：实现全部业务逻辑和数据管理

## 未来计划

1. 实现真实的AI生成功能（目前为模拟生成）
2. 添加语音合成功能
3. 支持导出/导入脚本
4. 增加更多的冥想文案模板和风格
5. 添加片段拖拽排序功能 
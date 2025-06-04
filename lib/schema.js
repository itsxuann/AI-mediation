// 数据库字段结构定义
export const scriptSchema = {
    _id: 'main', // 主文档ID
    title: '', // 脚本标题
    description: '', // 脚本描述
    isPublic: false, // 是否公开
    tags: [], // 标签
    lastModifiedBy: 'system', // 最后修改者
    createdAt: new Date(), // 创建时间
    updatedAt: new Date(), // 更新时间
    versions: [ // 版本数组
        {
            id: 1, // 版本ID
            name: '版本 1', // 版本名称
            author: 'system', // 作者
            createdAt: new Date(), // 创建时间
            updatedAt: new Date(), // 更新时间
            sections: [ // 片段数组
                {
                    id: 1, // 片段ID
                    title: '', // 片段标题
                    text: '', // 片段文本
                    pauseDuration: 3, // 停顿时长
                    visible: true, // 是否可见
                    author: 'system', // 作者
                    createdAt: new Date(), // 创建时间
                    updatedAt: new Date(), // 更新时间
                    versions: [ // 片段版本数组
                        {
                            id: 1, // 版本ID
                            text: '', // 文本内容
                            pauseDuration: 3, // 停顿时长
                            author: 'system', // 作者
                            createdAt: new Date(), // 创建时间
                            updatedAt: new Date() // 更新时间
                        }
                    ],
                    currentVersionId: 1 // 当前使用的版本ID
                }
            ]
        }
    ],
    currentVersionId: 1 // 当前使用的版本ID
}; 
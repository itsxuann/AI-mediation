import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: '只允许 GET 请求' });
    }

    try {
        const client = await clientPromise;
        const db = client.db('meditation');
        const collection = db.collection('scripts');

        // 查找数据
        const data = await collection.findOne({ _id: 'main' });

        // 如果数据不存在，返回默认数据
        if (!data) {
            console.log('未找到现有数据，创建默认数据');
            const defaultData = {
                _id: 'main',
                title: '',
                versions: [
                    {
                        id: 1,
                        name: '版本 1',
                        sections: []
                    }
                ],
                currentVersionId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // 插入默认数据
            const result = await collection.insertOne(defaultData);
            console.log('创建默认数据结果:', result);
            return res.status(200).json(defaultData);
        }

        // 验证数据格式
        const requiredFields = ['title', 'versions', 'currentVersionId'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                console.error('数据格式错误，缺少字段:', field);
                throw new Error(`数据格式错误，缺少字段: ${field}`);
            }
        }

        // 返回找到的数据
        res.status(200).json(data);
    } catch (error) {
        console.error('加载数据失败:', error);
        // 返回更详细的错误信息
        res.status(500).json({ 
            error: '加载数据失败',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
} 
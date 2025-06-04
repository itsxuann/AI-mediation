import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许 POST 请求' });
    }

    try {
        // 验证请求数据
        if (!req.body || typeof req.body !== 'object') {
            throw new Error('无效的请求数据格式');
        }

        // 确保数据包含必要的字段
        const requiredFields = ['title', 'versions', 'currentVersionId'];
        for (const field of requiredFields) {
            if (!(field in req.body)) {
                throw new Error(`缺少必要字段: ${field}`);
            }
        }

        const client = await clientPromise;
        const db = client.db('meditation');
        const collection = db.collection('scripts');

        // 准备要保存的数据
        const dataToSave = {
            ...req.body,
            _id: 'main',
            updatedAt: new Date()
        };

        // 更新或插入数据
        const result = await collection.updateOne(
            { _id: 'main' },
            { $set: dataToSave },
            { upsert: true }
        );

        console.log('保存结果:', result);
        
        res.status(200).json({ 
            message: '保存成功',
            result: {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                upsertedCount: result.upsertedCount
            }
        });
    } catch (error) {
        console.error('保存数据失败:', error);
        // 返回更详细的错误信息
        res.status(500).json({ 
            error: '保存数据失败',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
} 
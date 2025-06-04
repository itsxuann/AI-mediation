import clientPromise from '../lib/mongodb';
import { scriptSchema } from '../lib/schema';

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
            const defaultData = {
                ...scriptSchema,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // 插入默认数据
            await collection.insertOne(defaultData);
            return res.status(200).json(defaultData);
        }

        // 确保返回的数据包含所有必要字段
        const completeData = {
            ...scriptSchema,
            ...data,
            updatedAt: new Date()
        };

        res.status(200).json(completeData);
    } catch (error) {
        console.error('加载数据失败:', error);
        res.status(500).json({ 
            error: '加载数据失败',
            details: error.message
        });
    }
} 
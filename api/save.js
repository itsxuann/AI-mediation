import clientPromise from '../lib/mongodb';
import { scriptSchema } from '../lib/schema';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许 POST 请求' });
    }

    try {
        const client = await clientPromise;
        const db = client.db('meditation');
        const collection = db.collection('scripts');

        // 获取当前数据
        const currentData = await collection.findOne({ _id: 'main' });
        
        // 准备新数据
        const newData = {
            ...scriptSchema, // 使用默认结构
            ...currentData, // 保留现有数据
            ...req.body, // 使用请求中的数据
            updatedAt: new Date() // 更新修改时间
        };

        // 更新数据
        const result = await collection.updateOne(
            { _id: 'main' },
            { $set: newData },
            { upsert: true } // 如果不存在则创建
        );

        res.status(200).json({ 
            success: true, 
            message: '保存成功',
            data: newData
        });
    } catch (error) {
        console.error('保存失败:', error);
        res.status(500).json({ 
            error: '保存失败',
            details: error.message
        });
    }
} 
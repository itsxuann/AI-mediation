import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许 POST 请求' });
    }

    try {
        const client = await clientPromise;
        const db = client.db('meditation');
        const collection = db.collection('scripts');

        // 更新或插入数据
        await collection.updateOne(
            { _id: 'main' }, // 使用固定的 _id
            { $set: { ...req.body, updatedAt: new Date() } },
            { upsert: true } // 如果文档不存在则创建
        );
        
        res.status(200).json({ message: '保存成功' });
    } catch (error) {
        console.error('保存数据失败:', error);
        res.status(500).json({ error: '保存数据失败' });
    }
} 
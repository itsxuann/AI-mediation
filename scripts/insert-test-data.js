import { MongoClient } from 'mongodb';
import { scriptSchema } from '../lib/schema.js';

// MongoDB 连接字符串
const uri = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/meditation?retryWrites=true&w=majority';

async function insertTestData() {
    const client = new MongoClient(uri);

    try {
        // 连接到 MongoDB
        console.log('正在连接数据库...');
        await client.connect();
        console.log('数据库连接成功！');

        // 获取数据库
        const db = client.db('meditation');
        const collection = db.collection('scripts');

        // 准备测试数据
        const testData = {
            ...scriptSchema,
            title: '测试脚本',
            description: '这是一个测试脚本',
            tags: ['测试', '冥想'],
            versions: [
                {
                    id: 1,
                    name: '测试版本',
                    sections: [
                        {
                            id: 1,
                            title: '测试片段',
                            text: '这是一个测试片段',
                            pauseDuration: 5
                        }
                    ]
                }
            ]
        };

        // 插入数据
        console.log('正在插入测试数据...');
        const result = await collection.insertOne(testData);
        console.log('插入结果:', result);

        // 验证数据
        const insertedData = await collection.findOne({ _id: 'main' });
        console.log('插入的数据:', JSON.stringify(insertedData, null, 2));

    } catch (error) {
        console.error('插入测试数据失败:', error);
    } finally {
        await client.close();
    }
}

// 运行插入
insertTestData(); 
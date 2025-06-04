import { MongoClient } from 'mongodb';

// MongoDB 连接字符串
const uri = 'mongodb+srv://chen:chen1122@xuan.rpayomw.mongodb.net/meditation';

async function testDatabase() {
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 0,
        maxIdleTimeMS: 30000,
        family: 4
    });

    try {
        // 连接到 MongoDB
        console.log('正在连接数据库...');
        await client.connect();
        console.log('数据库连接成功！');

        // 获取数据库
        const db = client.db('meditation');
        console.log('成功获取 meditation 数据库');

        // 获取集合
        const collection = db.collection('scripts');
        console.log('成功获取 scripts 集合');

        // 查找所有数据
        console.log('正在查找数据...');
        const data = await collection.find({}).toArray();
        console.log('数据库中的数据:', JSON.stringify(data, null, 2));

        // 检查数据库和集合是否存在
        const collections = await db.listCollections().toArray();
        console.log('数据库中的集合:', collections.map(c => c.name));

    } catch (error) {
        console.error('测试失败:', error);
        if (error.cause) {
            console.error('错误原因:', error.cause);
        }
    } finally {
        await client.close();
    }
}

// 运行测试
testDatabase(); 
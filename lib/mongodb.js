import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('请在环境变量中设置 MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

let client;
let clientPromise;

async function connectWithRetry(retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            client = new MongoClient(uri, options);
            await client.connect();
            console.log('MongoDB 连接成功');
            return client;
        } catch (error) {
            console.error(`MongoDB 连接失败 (尝试 ${i + 1}/${retries}):`, error);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

if (process.env.NODE_ENV === 'development') {
    // 在开发环境中，使用全局变量来保存连接
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = connectWithRetry();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // 在生产环境中，创建新的连接
    clientPromise = connectWithRetry();
}

// 添加连接错误处理
clientPromise.catch(error => {
    console.error('MongoDB 连接错误:', error);
    // 在生产环境中，你可能想要通知管理员或记录到错误跟踪服务
});

export default clientPromise; 
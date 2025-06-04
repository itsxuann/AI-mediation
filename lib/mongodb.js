import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('请在环境变量中设置 MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    // 在开发环境中，使用全局变量来保存连接
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // 在生产环境中，创建新的连接
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise; 
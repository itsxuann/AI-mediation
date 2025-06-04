import { MongoClient } from 'mongodb';
import dns from 'dns';

// MongoDB 连接字符串
const uri = 'mongodb+srv://chen:chen1122@xuan.rpayomw.mongodb.net/meditation';

async function testDNS() {
    console.log('开始 DNS 测试...');
    
    try {
        // 解析 MongoDB 域名
        const hostname = 'xuan.rpayomw.mongodb.net';
        console.log(`正在解析 ${hostname}...`);
        
        const addresses = await dns.promises.resolve4(hostname);
        console.log('DNS 解析结果:', addresses);
        
        // 测试连接
        console.log('正在连接数据库...');
        const client = new MongoClient(uri);
        await client.connect();
        console.log('连接成功！');
        
        // 关闭连接
        await client.close();
        console.log('连接已关闭');
        
    } catch (error) {
        console.error('测试失败:', error);
    }
}

// 运行测试
testDNS(); 
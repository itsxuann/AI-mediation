import fs from 'fs';
import path from 'path';

// 使用环境变量获取数据文件路径，如果没有则使用默认路径
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const SCRIPT_FILE = path.join(DATA_DIR, 'script.json');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许 POST 请求' });
    }

    try {
        // 确保数据目录存在
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        // 写入数据到文件
        fs.writeFileSync(SCRIPT_FILE, JSON.stringify(req.body, null, 2));
        
        res.status(200).json({ message: '保存成功' });
    } catch (error) {
        console.error('保存数据失败:', error);
        res.status(500).json({ error: '保存数据失败' });
    }
} 
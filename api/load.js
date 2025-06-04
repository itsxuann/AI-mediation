import fs from 'fs';
import path from 'path';

// 使用环境变量获取数据文件路径，如果没有则使用默认路径
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const SCRIPT_FILE = path.join(DATA_DIR, 'script.json');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: '只允许 GET 请求' });
    }

    try {
        // 如果文件不存在，返回默认数据
        if (!fs.existsSync(SCRIPT_FILE)) {
            const defaultData = {
                title: '',
                versions: [
                    {
                        id: 1,
                        name: '版本 1',
                        sections: []
                    }
                ],
                currentVersionId: 1
            };
            
            // 确保数据目录存在
            if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true });
            }
            
            // 创建默认数据文件
            fs.writeFileSync(SCRIPT_FILE, JSON.stringify(defaultData, null, 2));
            return res.status(200).json(defaultData);
        }

        // 读取并返回数据
        const data = JSON.parse(fs.readFileSync(SCRIPT_FILE, 'utf8'));
        res.status(200).json(data);
    } catch (error) {
        console.error('加载数据失败:', error);
        res.status(500).json({ error: '加载数据失败' });
    }
} 
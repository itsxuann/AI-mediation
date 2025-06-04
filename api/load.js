import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const filePath = path.join(process.cwd(), 'data', 'script.json');
            
            // 如果文件不存在，返回空数据
            if (!fs.existsSync(filePath)) {
                return res.status(200).json({
                    title: '',
                    versions: [
                        {
                            id: 1,
                            name: '版本 1',
                            sections: []
                        }
                    ],
                    currentVersionId: 1
                });
            }
            
            // 读取文件内容
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.status(200).json(data);
        } catch (error) {
            console.error('读取失败:', error);
            res.status(500).json({ error: '读取失败' });
        }
    } else {
        res.status(405).json({ error: '方法不允许' });
    }
} 
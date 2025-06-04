import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const data = req.body;
            const filePath = path.join(process.cwd(), 'data', 'script.json');
            
            // 确保 data 目录存在
            if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
                fs.mkdirSync(path.join(process.cwd(), 'data'));
            }
            
            // 保存数据到文件
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            
            res.status(200).json({ message: '保存成功' });
        } catch (error) {
            console.error('保存失败:', error);
            res.status(500).json({ error: '保存失败' });
        }
    } else {
        res.status(405).json({ error: '方法不允许' });
    }
} 
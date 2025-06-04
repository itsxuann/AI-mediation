import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
    let client;
    try {
        const data = await request.json();
        
        client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('meditation');
        const collection = db.collection('scripts');
        
        // 准备要保存的数据
        const scriptToSave = {
            title: data.title,
            version: data.version,
            sections: data.sections.map(section => ({
                sectionId: section.sectionId,
                title: section.title,
                visible: section.visible,
                note: section.note || '',
                currentVersionId: section.currentVersionId,
                versions: section.versions
            })),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // 保存到数据库
        const result = await collection.insertOne(scriptToSave);
        
        return new Response(JSON.stringify({ 
            success: true, 
            message: '保存成功',
            id: result.insertedId 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('保存失败:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            message: '保存失败',
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
} 
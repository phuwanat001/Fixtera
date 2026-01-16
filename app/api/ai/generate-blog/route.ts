import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function getGeminiApiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

interface GenerateRequest {
  topic: string;
  contextId?: string;
  customPrompt?: string;
  language?: string;
  model?: string;
  author?: string;
  authorEmail?: string;
}

async function callGeminiAPI(
  systemPrompt: string,
  userPrompt: string,
  model: string = "gemini-2.0-flash"
): Promise<string> {
  const apiUrl = getGeminiApiUrl(model);
  const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\n---\n\n${userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return generatedText;
}

function parseGeneratedBlog(text: string): {
  title: string;
  summary: string;
  content: string;
  tags: string[];
} {
  // Try to extract structured data from generated text
  let title = "";
  let summary = "";
  let content = text;
  let tags: string[] = [];

  // Extract title (first # heading or first line)
  const titleMatch = text.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
    content = text.replace(titleMatch[0], "").trim();
  } else {
    const firstLine = text.split("\n")[0];
    if (firstLine && firstLine.length < 200) {
      title = firstLine.replace(/^[#*]+\s*/, "").trim();
      content = text.split("\n").slice(1).join("\n").trim();
    }
  }

  // Extract summary (first paragraph or first 200 chars)
  const paragraphs = content.split("\n\n").filter((p) => p.trim());
  if (paragraphs.length > 0) {
    summary = paragraphs[0].replace(/[#*_]/g, "").trim().substring(0, 300);
  }

  // Extract tags from content (look for keywords)
  const tagPatterns = [
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "nodejs",
    "python",
    "ai",
    "machine learning",
    "web",
    "api",
    "database",
    "mongodb",
    "docker",
    "kubernetes",
    "devops",
    "tutorial",
    "guide",
  ];
  const lowerContent = content.toLowerCase();
  tags = tagPatterns
    .filter((tag) => lowerContent.includes(tag.replace(" ", "")))
    .slice(0, 5);

  return { title, summary, content, tags };
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    console.log("GEMINI_API_KEY exists:", !!GEMINI_API_KEY);
    console.log("GEMINI_API_KEY length:", GEMINI_API_KEY?.length || 0);

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "AI service not configured. Please set GEMINI_API_KEY in .env",
        },
        { status: 500 }
      );
    }

    const body: GenerateRequest = await request.json();
    const {
      topic,
      contextId,
      customPrompt,
      language = "th",
      model = "gemini-2.0-flash",
      author,
      authorEmail,
    } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const contextsCollection = db.collection("ai_contexts");
    const blogsCollection = db.collection("blogs");

    // Get AI context (fixed prompt)
    let systemPrompt = `คุณเป็นนักเขียนบทความเทคโนโลยีมืออาชีพ เขียนบทความที่มีคุณภาพสูง อ่านง่าย และให้ข้อมูลที่ถูกต้อง

โครงสร้างบทความ (Markdown):
1. **Title**: เริ่มต้นด้วย # หัวข้อ...
2. **Summary**: ย่อหน้าแรกต้องเป็นบทสรุปสั้นๆ (Introduction)
3. **Content**: เนื้อหาหลักแบ่งเป็นหัวข้อย่อย (##, ###)
4. **Conclusion**: สรุปปิดท้าย

กฎการเขียน:
- เขียนเป็นภาษา${language === "th" ? "ไทย" : "อังกฤษ"}
- ใช้ภาษาที่เป็นธรรมชาติ น่าอ่าน (Engagement)
- มี Code Examples ประกอบเสมอถ้าเป็นเรื่อง Technical
- **สำคัญ**: ข้อมูลต้องถูกต้องและอ้างอิงได้ (Fact-based)
- **ห้าม** มีคำเกริ่นนำ (เช่น "ได้ครับ", "Okay", "Here is...") ให้เริ่มบรรทัดแรกด้วย # ชื่อบทความ ทันที`;

    // Fetch an example known good blog (Few-Shot Prompting)
    try {
      const exampleBlog = await blogsCollection.findOne(
        {
          status: "published",
          content: { $exists: true, $ne: "" },
          language: language,
        },
        { projection: { title: 1, content: 1 } }
      );

      if (exampleBlog) {
        systemPrompt += `\n\n## ตัวอย่างสไตล์การเขียนที่ต้องการ (Reference Style):
Title: ${exampleBlog.title}
Content Example:
${exampleBlog.content?.substring(0, 500)}...
`;
      }
    } catch (e) {
      console.log("Could not fetch example blog for context");
    }

    let userPromptTemplate =
      "เขียนบทความเกี่ยวกับ: {{topic}} \n\nเน้นละเอียดและเจาะลึก";

    if (contextId) {
      const context = await contextsCollection.findOne({
        _id: new ObjectId(contextId),
      });
      if (context) {
        systemPrompt = context.systemPrompt;
        userPromptTemplate = context.userPromptTemplate || userPromptTemplate;

        // Update usage count
        await contextsCollection.updateOne(
          { _id: new ObjectId(contextId) },
          { $inc: { usageCount: 1 } }
        );
      }
    } else {
      // Try to get default context
      const defaultContext = await contextsCollection.findOne({
        isDefault: true,
        isActive: true,
      });
      if (defaultContext) {
        systemPrompt = defaultContext.systemPrompt;
        userPromptTemplate =
          defaultContext.userPromptTemplate || userPromptTemplate;

        await contextsCollection.updateOne(
          { _id: defaultContext._id },
          { $inc: { usageCount: 1 } }
        );
      }
    }

    // Build user prompt
    const userPrompt =
      customPrompt || userPromptTemplate.replace("{{topic}}", topic);

    // Call Gemini API
    const generatedText = await callGeminiAPI(systemPrompt, userPrompt, model);

    // Parse generated content
    const { title, summary, content, tags } = parseGeneratedBlog(generatedText);

    // Create blog with pending_review status
    const now = new Date();
    const slug = (title || topic)
      .toLowerCase()
      .replace(/[^a-z0-9ก-๙]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .substring(0, 100);

    const blogData = {
      title: title || `บทความเกี่ยวกับ ${topic}`,
      slug: `${slug}-${Date.now()}`,
      summary,
      content,
      coverImage: "",
      tags,
      author: author || "AI Writer",
      authorEmail: authorEmail || "",
      status: "pending_review",
      source: "ai",
      aiMetadata: {
        topic,
        contextId: contextId || null,
        generatedAt: now,
        model,
      },
      difficultyLevel: "intermediate",
      language,
      viewCount: 0,
      likeCount: 0,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
      updatedBy: authorEmail || "system", // Added trackability
    };

    const result = await blogsCollection.insertOne(blogData);

    return NextResponse.json({
      success: true,
      blogId: result.insertedId,
      blog: { ...blogData, _id: result.insertedId },
      message: "Blog generated successfully. Pending admin review.",
    });
  } catch (error: any) {
    console.error("Error generating blog:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate blog" },
      { status: 500 }
    );
  }
}

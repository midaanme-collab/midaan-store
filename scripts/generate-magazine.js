const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generatePdf = async () => {
    const alexandriaFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'Alexandria-Regular.ttf')).toString('base64');
    const messiriFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'ElMessiri-Bold.ttf')).toString('base64');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>مجلة ميدان — العدد صفر</title>
        <style>
            @font-face {
                font-family: 'Alexandria';
                src: url(data:font/truetype;charset=utf-8;base64,${alexandriaFont}) format('truetype');
            }
            @font-face {
                font-family: 'El Messiri';
                src: url(data:font/truetype;charset=utf-8;base64,${messiriFont}) format('truetype');
            }
            body {
                font-family: 'Alexandria', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #fffff8; /* warm ivory */
                color: #111; /* near-black */
            }
            .page {
                width: 210mm;
                height: 297mm;
                padding: 20mm;
                box-sizing: border-box;
                page-break-after: always;
                position: relative;
            }
            .cover {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                text-align: center;
            }
            h1 { font-family: 'El Messiri', sans-serif; font-size: 4rem; color: #D80032; margin-bottom: 0; }
            h2 { font-size: 2rem; margin-top: 0; }
            .issue-label { font-size: 1.2rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0; margin-top: 2rem; color: #555; }
            
            .article-title { font-family: 'El Messiri', sans-serif; font-size: 2.5rem; margin-bottom: 0.5rem; color: #D80032; }
            .author { font-size: 1rem; color: #555; margin-bottom: 2rem; font-weight: bold; }
            
            .content {
                column-count: 2;
                column-gap: 8mm;
                text-align: justify;
                line-height: 1.8;
                font-size: 11pt;
            }
            
            .illustration {
                width: 100%;
                height: 200px;
                background-color: #f0f0f0;
                margin: 2rem 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #ddd;
            }
            
            .pull-quote {
                font-family: 'El Messiri', sans-serif;
                font-size: 1.5rem;
                color: #D80032;
                border-right: 4px solid #D80032;
                padding-right: 1rem;
                margin: 2rem 0;
                line-height: 1.6;
            }
            
            .page-number {
                position: absolute;
                bottom: 15mm;
                left: 20mm;
                font-family: 'Courier New', monospace;
                font-size: 0.8rem;
                color: #888;
            }
        </style>
    </head>
    <body>
        <!-- Cover Page -->
        <div class="page cover">
            <div style="margin-top: 20%">
                <div class="issue-label">Issue Zero (انتحاب)</div>
                <h1>ميدان</h1>
                <h2>Midaan Magazine</h2>
            </div>
            
            <div style="margin-bottom: 10%">
                <p>إصدار فكري ثقافي مستقل يبحث في قضايا الهوية، التحولات الاجتماعية، ودور الفن في التعبير المدني.</p>
                <p>Independent Civil Society Action</p>
            </div>
        </div>

        <!-- TOC -->
        <div class="page">
            <h2 style="color: #D80032; margin-bottom: 2rem; font-family: 'El Messiri', sans-serif;">الفهرس</h2>
            <div style="font-size: 1.2rem; line-height: 2.5;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; margin-bottom: 1rem;">
                    <span>افتتاحية العدد: صراع الأرض والسماء</span>
                    <span>٣</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; margin-bottom: 1rem;">
                    <span>سأموت قبل الأربعين</span>
                    <span>٥</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; margin-bottom: 1rem;">
                    <span>حبر اليقين: من مشقة الوداع إلى سكينة الشهادة</span>
                    <span>٧</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; margin-bottom: 1rem;">
                    <span>سجل وصايا الشهداء الفلسطينيين</span>
                    <span>٩</span>
                </div>
            </div>
            <div class="page-number">2</div>
        </div>

        <!-- Article 1 -->
        <div class="page">
            <h2 class="article-title">صراع الأرض والسماء</h2>
            <div class="author">افتتاحية مجلة ميدان</div>
            
            <svg class="illustration" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#222" />
                <path d="M 0 300 Q 200 250 400 300 T 800 300 L 800 400 L 0 400 Z" fill="#111" />
                <circle cx="400" cy="200" r="80" fill="#f4f4f0" opacity="0.8" />
                <line x1="0" y1="300" x2="800" y2="300" stroke="#D80032" stroke-width="2" />
            </svg>
            
            <div class="content">
                <p>عندما تتأمل المشهد الثقافي والمدني في المنطقة، تدرك أن الصراع لم يكن يوماً مجرد صراع على الموارد أو الحدود، بل هو صراع سرديات بامتياز. صراع بين واقع يُفرض بقوة الحديد والنار، وبين أمل يُنسج بخيوط الكلمة، الصورة، والفعل المدني.</p>
                
                <div class="pull-quote">
                    "نكتب لأن الصمت في حضرة هذه التحولات لم يعد خياراً، بل تواطؤاً."
                </div>
                
                <p>ميدان ليست مجرد مساحة فيزيائية أو علامة تجارية، بل هي امتداد طبيعي للحاجة الملحة لخلق منصات تعبير مستقلة. في هذا العدد الصفر، نؤسس للغة بصرية ونصية تحاول أن تلتقط نبض الشارع، وتوثق لحظات الفقد، الصمود، والبحث المستمر عن المعنى.</p>
            </div>
            <div class="page-number">3</div>
        </div>
        
        <!-- Article 2 -->
        <div class="page">
            <h2 class="article-title">سأموت قبل الأربعين</h2>
            
            <div class="content">
                <p>هذا النص ليس نبوءة تشاؤمية بقدر ما هو تشريح لحالة القلق الوجودي التي يعيشها جيل كامل. جيل وُلد في فجوة بين عصرين، وشهد تقلبات جذرية جعلت من فكرة المستقبل ترفاً يصعب تصوره.</p>
                <p>أن تفكر في الموت قبل الأربعين في هذا الجزء من العالم ليس بالضرورة حالة اكتئاب فردية، بل هو وعي مبكر بهشاشة الحياة أمام قسوة السياق السياسي والاجتماعي. هو انعكاس لواقع تُختطف فيه الأحلام قبل أن تنضج.</p>
                
                <svg class="illustration" style="height: 150px; margin: 1rem 0;" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#fff" />
                    <!-- Abstract shadow/chair -->
                    <path d="M 150 150 L 170 100 L 230 100 L 250 150 Z" fill="none" stroke="#222" stroke-width="2" />
                    <line x1="170" y1="100" x2="170" y2="50" stroke="#222" stroke-width="2" />
                    <line x1="230" y1="100" x2="230" y2="50" stroke="#222" stroke-width="2" />
                    <path d="M 100 150 L 300 150" stroke="#D80032" stroke-width="4" />
                </svg>
                
                <p>رغم هذه السوداوية الظاهرة، هناك طاقة خفية في هذا الإدراك. عندما تتقبل فكرة النهاية المبكرة، تتخلص من عبء التخطيط الطويل وتندفع نحو الفعل الآني. يصبح الإنتاج الإبداعي، التعبير، والاشتباك مع الواقع ضرورة يومية لا تقبل التأجيل.</p>
            </div>
            <div class="page-number">5</div>
        </div>

        <!-- Article 3 -->
        <div class="page">
            <h2 class="article-title">حبر اليقين: من مشقة الوداع إلى سكينة الشهادة</h2>
            <div class="author">صوت ميدان | مقال فكري</div>
            
            <div class="content">
                <p>تُعد كتابة الوصية واحدة من أكثر التجارب الإنسانية عُمقاً وقسوة؛ فهي اللحظة التي يواجه فيها الإنسان فكرة الفناء وجهاً لوجه، ويحاول اختزال عمر كامل بمشاعره وأفكاره وعلاقاته في سطور معدودة.</p>
                <p>إنها اعتراف خطي بالرحيل، ومحاولة صادقة لمد جسر من الكلمات بين عالمين. ولكن حين تُقرأ وصايا الشهداء، نجد أنفسنا أمام ظاهرة نفسية وفريدة: كيف يتحول هذا العبء الوجودي الثقيل إلى حالة من السكينة المطلقة واليقين؟</p>
                
                <div class="pull-quote">
                    "كلمات بين عالمين؛ حين تُقرأ وصايا الشهداء نجد أنفسنا أمام تحول العبء إلى يقين خالص."
                </div>
                
                <p>مشقة البداية هي مواجهة الحبر، لكن ختامها هو التسليم الكامل لقضية تتجاوز الفرد وحدود الجسد الفاني. يصبح النص هنا ليس مجرد وداع، بل إعلاناً لميلاد معنى جديد للحرية والكرامة الإنسانية.</p>
            </div>
            <div class="page-number">7</div>
        </div>

        <!-- Article 4 -->
        <div class="page">
            <h2 class="article-title">سجل وصايا الشهداء الفلسطينيين</h2>
            <div class="author">توثيق ميدان | وثيقة تاريخية</div>
            
            <div class="content">
                <p>وصايا الشهداء: السجل الخالد في الوجدان الفلسطيني. وثيقة فكرية وتاريخية تجمع أبرز وصايا الشهداء الفلسطينيين التي شكلت محطات فارقة في الوعي الجمعي، تنوعت بين التأصيل الثقافي والرسائل الميدانية العفوية تحت النيران.</p>
                
                <div style="margin: 1.5rem 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 10pt; text-align: right;">
                        <tr style="background: #222; color: #fff;">
                            <th style="padding: 8px 12px;">الشهيد</th>
                            <th style="padding: 8px 12px;">العام</th>
                            <th style="padding: 8px 12px;">طبيعة الوصية</th>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 12px; font-weight: bold;">باسل الأعرج</td>
                            <td style="padding: 8px 12px;">2017</td>
                            <td style="padding: 8px 12px;">فكرية / ثقافية ثورية</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 12px; font-weight: bold;">بهاء عليان</td>
                            <td style="padding: 8px 12px;">2015</td>
                            <td style="padding: 8px 12px;">الوصايا العشر (اجتماعية وفكرية)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 12px; font-weight: bold;">دلال المغربي</td>
                            <td style="padding: 8px 12px;">1978</td>
                            <td style="padding: 8px 12px;">سياسية وعسكرية</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; font-weight: bold;">إبراهيم النابلسي</td>
                            <td style="padding: 8px 12px;">2022</td>
                            <td style="padding: 8px 12px;">ميدانية وصوتية</td>
                        </tr>
                    </table>
                </div>

                <div class="pull-quote">
                    "تنوعت بين التأصيل الثقافي والرسائل الميدانية تحت الرصاص."
                </div>

                <p>إن توثيق هذه الوصايا في أرشيف ميدان هو فعل مقاومة للنسيان، وتأكيد على أن كل كلمة خُطت قبل الارتقاء هي جزء من السردية الوطنية المستمرة.</p>
            </div>
            <div class="page-number">9</div>
        </div>

    </body>
    </html>
    `;

    const htmlPath = path.join(__dirname, '..', 'public', 'magazine', 'temp-issue-zero.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log('Launching Puppeteer to generate PDF...');
    
    try {
        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        
        await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
        
        const pdfPath = path.join(__dirname, '..', 'public', 'magazine', 'issue-zero.pdf');
        
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });
        
        console.log('PDF generated successfully at', pdfPath);
        
        await browser.close();
        
        // Clean up temp file
        fs.unlinkSync(htmlPath);
    } catch (err) {
        console.error('Failed to generate PDF:', err);
    }
};

generatePdf();

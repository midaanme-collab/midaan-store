export interface Article {
  id: string;
  categoryAr: string;
  categoryEn: string;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  date: string;
  readTimeAr: string;
  readTimeEn: string;
  excerptAr: string;
  excerptEn: string;
  pullQuoteAr: string;
  pullQuoteEn: string;
  contentAr: string[];
  contentEn: string[];
  merchLink?: string;
}

export const ARTICLES: Article[] = [
  {
    id: "art-1",
    categoryAr: "ملف العدد صفر / Issue Zero Dossier",
    categoryEn: "Issue Zero Dossier",
    titleAr: "انتحاب | في معنى الفقد والذاكرة الجمعية",
    titleEn: "Entehab | On Loss and Collective Memory",
    authorAr: "محررو ميدان",
    authorEn: "Midaan Editors",
    date: "2026-10-01",
    readTimeAr: "٥ دقائق",
    readTimeEn: "5 min read",
    excerptAr: "كيف تتشكل الهوية عبر تجارب الفقد المتكررة؟ ملف العدد صفر يطرح أسئلة الوجود والانتماء في الشارع الأردني.",
    excerptEn: "How is identity shaped through recurring experiences of loss? Issue Zero questions existence and belonging on the Jordanian street.",
    pullQuoteAr: "«في كل حارة، حكاية نُسجت من خيوط الفقد، نرتديها لئلا ننسى.»",
    pullQuoteEn: "«In every alleyway, a tale woven from threads of loss, worn lest we forget.»",
    contentAr: [
      "في مدينتنا، الفقد ليس مجرد غياب، بل هو حضور دائم يشكل ملامح الشوارع، الوجوه، والأزياء التي نرتديها. العدد صفر من مجلة ميدان، «انتحاب»، يسلط الضوء على هذه الثنائية.",
      "لقد أردنا من خلال هذا الملف أن نوثق الذاكرة الجمعية عبر الحبر والقماش. الكلمات هنا لا تُقرأ فقط، بل تُرتدى، لتتحول من أفكار مجردة إلى بيانات بصرية تتحرك في الساحات العامة."
    ],
    contentEn: [
      "In our city, loss is not merely an absence, but a persistent presence that shapes the contours of our streets, our faces, and the garments we wear. Midaan Magazine's Issue Zero, 'Entehab', highlights this duality.",
      "Through this dossier, we wanted to document collective memory through ink and fabric. Words here are not just read; they are worn, transforming from abstract thoughts into visual statements that move across public squares."
    ],
    merchLink: "drop-core-02"
  },
  {
    id: "art-2",
    categoryAr: "مقابلة / Interview",
    categoryEn: "Interview",
    titleAr: "الموسيقى كمنصة للمقاومة | الفرعي",
    titleEn: "Music as a Platform for Resistance | El Far3i",
    authorAr: "تجمع ميدان",
    authorEn: "Midaan Collective",
    date: "2026-10-10",
    readTimeAr: "٧ دقائق",
    readTimeEn: "7 min read",
    excerptAr: "حوار خاص مع طارق أبو كويك (الفرعي) حول دور موسيقى الراب والهيب هوب الصوتي في تشكيل وعي الشباب.",
    excerptEn: "An exclusive conversation with Tareq Abu Kwaik (El Far3i) on the role of acoustic hip-hop in shaping youth consciousness.",
    pullQuoteAr: "«الكلمة التي تخرج من الحنجرة الصادقة، تكسر كل حواجز الصوت.»",
    pullQuoteEn: "«A word uttered from a sincere throat shatters all sound barriers.»",
    contentAr: [
      "في هذا الحوار، نجلس مع الفرعي لنناقش تقاطعات الفن المستقل مع قضايا الشارع. كيف يمكن للموسيقى أن تكون أداة حقيقية للتغيير وليست مجرد انعكاس للواقع؟",
      "يرى الفرعي أن الكلمة المغناة هي امتداد طبيعي للحوار المدني، وهي الوسيلة الأقرب لقلوب وعقول الشباب الباحث عن هوية وصوت."
    ],
    contentEn: [
      "In this interview, we sit down with El Far3i to discuss the intersections of independent art and street issues. How can music be a genuine tool for change rather than a mere reflection of reality?",
      "El Far3i believes that sung lyrics are a natural extension of civic dialogue, the medium closest to the hearts and minds of youth searching for identity and voice."
    ],
    merchLink: "drop-elfar3i-01"
  },
  {
    id: "art-3",
    categoryAr: "سينما / Cinema",
    categoryEn: "Cinema",
    titleAr: "درع التراب | السرد البصري للشارع",
    titleEn: "Dira'a Al Turab | Visual Storytelling of the Street",
    authorAr: "نادي ميدان السينمائي",
    authorEn: "Midaan Film Club",
    date: "2026-10-15",
    readTimeAr: "٤ دقائق",
    readTimeEn: "4 min read",
    excerptAr: "نظرة متعمقة في مشروع الفيلم القصير 'درع التراب'، وكيف توظف السينما الرمزية لتوثيق التحولات الديمقراطية.",
    excerptEn: "An in-depth look at the short film project 'Dira'a Al Turab', and how symbolic cinema is employed to document democratic shifts.",
    pullQuoteAr: "«الصورة لا تكذب، حتى حين تتنكر في ثوب الرمز.»",
    pullQuoteEn: "«The image does not lie, even when masquerading in the garb of symbol.»",
    contentAr: [
      "مشروع 'درع التراب' هو محاولتنا لتقديم سردية بصرية تتجاوز التقريرية الصحفية. نعتمد على الإضاءة الخافتة والوجوه المتعبة لنقل رسالة الشارع.",
      "الفيلم يسلط الضوء على جهود الشباب في خلق مساحات آمنة للتعبير، وسط ظروف تتسم بالتقلب والتعقيد."
    ],
    contentEn: [
      "The 'Dira'a Al Turab' project is our attempt to present a visual narrative that transcends journalistic reporting. We rely on low lighting and weary faces to convey the message of the street.",
      "The film highlights the efforts of youth to create safe spaces for expression amid volatile and complex conditions."
    ]
  },
  {
    id: "art-4",
    categoryAr: "مقالة / Essay",
    categoryEn: "Essay",
    titleAr: "الاقتصاد الإبداعي | من الاستهلاك إلى الإنتاج",
    titleEn: "The Creative Economy | From Consumption to Production",
    authorAr: "عمر الكيلاني",
    authorEn: "Omar Al-Kilani",
    date: "2026-10-20",
    readTimeAr: "٦ دقائق",
    readTimeEn: "6 min read",
    excerptAr: "كيف يمكن لمشاريع مثل قبة ميدان أن تحول الشباب الأردني من مستهلكين للثقافة إلى منتجين فاعلين لها؟",
    excerptEn: "How can projects like the Midaan Dome transition Jordanian youth from consumers of culture to active producers?",
    pullQuoteAr: "«الاستقلال المادي للمبادرات هو حجر الزاوية لحرية التعبير.»",
    pullQuoteEn: "«Financial independence for initiatives is the cornerstone of freedom of expression.»",
    contentAr: [
      "في ظل التحديات الاقتصادية، يبرز الاقتصاد الإبداعي كحل مستدام. مشغل ميدان للطباعة ليس مجرد أداة إنتاج، بل هو نموذج للاكتفاء الذاتي.",
      "من خلال إعادة استثمار العوائد، نضمن استمرارية الورش والمبادرات الثقافية، ونخلق بيئة تدعم النمو المستقل بعيداً عن شروط التمويل التقليدية."
    ],
    contentEn: [
      "In light of economic challenges, the creative economy emerges as a sustainable solution. The Midaan Print Dome is not just a production tool; it is a model of self-sufficiency.",
      "By reinvesting revenues, we ensure the continuity of workshops and cultural initiatives, creating an environment that supports independent growth away from the constraints of traditional funding."
    ]
  }
];

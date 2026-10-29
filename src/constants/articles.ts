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
    categoryAr: "افتتاحية | Editorial",
    categoryEn: "Editorial",
    titleAr: "صراع الأرض والسماء",
    titleEn: "The Conflict of Earth and Sky",
    authorAr: "محررو ميدان",
    authorEn: "Midaan Editors",
    date: "2026-10-01",
    readTimeAr: "٣ دقائق",
    readTimeEn: "3 min read",
    excerptAr: "لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟",
    excerptEn: "Why the Palestinian cause cannot be understood apart from dogma.",
    pullQuoteAr: "«نكتب لأن الصمت في حضرة هذه التحولات لم يعد خياراً، بل تواطؤاً.»",
    pullQuoteEn: "«We write because silence in the presence of these transformations is no longer a choice, but complicity.»",
    contentAr: [
      "عندما تتأمل المشهد الثقافي والمدني في المنطقة، تدرك أن الصراع لم يكن يوماً مجرد صراع على الموارد أو الحدود، بل هو صراع سرديات بامتياز. صراع بين واقع يُفرض بقوة الحديد والنار، وبين أمل يُنسج بخيوط الكلمة، الصورة، والفعل المدني.",
      "ميدان ليست مجرد مساحة فيزيائية أو علامة تجارية، بل هي امتداد طبيعي للحاجة الملحة لخلق منصات تعبير مستقلة. في هذا العدد الصفر، نؤسس للغة بصرية ونصية تحاول أن تلتقط نبض الشارع، وتوثق لحظات الفقد، الصمود، والبحث المستمر عن المعنى."
    ],
    contentEn: [
      "When contemplating the cultural and civic landscape of the region, one realizes that the conflict has never been merely about resources or borders, but rather a profound clash of narratives. A conflict between a reality imposed by iron and fire, and a hope woven with threads of word, image, and civic action.",
      "Midaan is not just a physical space or a brand; it is a natural extension of the urgent need to create independent platforms for expression. In this Issue Zero, we establish a visual and textual language attempting to capture the pulse of the street, documenting moments of loss, resilience, and the continuous search for meaning."
    ],
  },
  {
    id: "art-2",
    categoryAr: "مقالة | Essay",
    categoryEn: "Essay",
    titleAr: "سأموت قبل الأربعين",
    titleEn: "I Will Die Before Forty",
    authorAr: "صوت ميدان",
    authorEn: "Midaan Voice",
    date: "2026-10-10",
    readTimeAr: "٥ دقائق",
    readTimeEn: "5 min read",
    excerptAr: "تشريح لحالة القلق الوجودي التي يعيشها جيل كامل.",
    excerptEn: "An anatomy of the existential anxiety experienced by an entire generation.",
    pullQuoteAr: "«أن تفكر في الموت قبل الأربعين في هذا الجزء من العالم ليس بالضرورة حالة اكتئاب فردية، بل هو وعي مبكر بهشاشة الحياة أمام قسوة السياق السياسي والاجتماعي.»",
    pullQuoteEn: "«To think of death before forty in this part of the world is not necessarily an individual depression, but rather an early awareness of life's fragility against the harshness of the political and social context.»",
    contentAr: [
      "هذا النص ليس نبوءة تشاؤمية بقدر ما هو تشريح لحالة القلق الوجودي التي يعيشها جيل كامل. جيل وُلد في فجوة بين عصرين، وشهد تقلبات جذرية جعلت من فكرة المستقبل ترفاً يصعب تصوره.",
      "أن تفكر في الموت قبل الأربعين في هذا الجزء من العالم ليس بالضرورة حالة اكتئاب فردية، بل هو وعي مبكر بهشاشة الحياة أمام قسوة السياق السياسي والاجتماعي. هو انعكاس لواقع تُختطف فيه الأحلام قبل أن تنضج.",
      "رغم هذه السوداوية الظاهرة، هناك طاقة خفية في هذا الإدراك. عندما تتقبل فكرة النهاية المبكرة، تتخلص من عبء التخطيط الطويل وتندفع نحو الفعل الآني. يصبح الإنتاج الإبداعي، التعبير، والاشتباك مع الواقع ضرورة يومية لا تقبل التأجيل."
    ],
    contentEn: [
      "This text is not a pessimistic prophecy as much as it is an anatomy of the existential anxiety experienced by an entire generation. A generation born in the gap between two eras, witnessing radical shifts that have made the concept of a future an unimaginable luxury.",
      "To think of death before forty in this part of the world is not necessarily a state of individual depression, but an early awareness of life's fragility in the face of a harsh political and social context. It is a reflection of a reality where dreams are hijacked before they can mature.",
      "Despite this apparent bleakness, there is a hidden energy in this realization. When you accept the idea of an early end, you shed the burden of long-term planning and rush toward immediate action. Creative production, expression, and engaging with reality become a daily necessity that brooks no delay."
    ],
  },
  {
    id: "art-3",
    categoryAr: "مقال | Essay",
    categoryEn: "Essay",
    titleAr: "حبر اليقين: من مشقة الوداع إلى سكينة الشهادة",
    titleEn: "The Ink of Certainty: From the Hardship of Farewell to the Tranquility of Martyrdom",
    authorAr: "صوت ميدان",
    authorEn: "Midaan Voice",
    date: "2026-10-15",
    readTimeAr: "٤ دقائق",
    readTimeEn: "4 min read",
    excerptAr: "تُعد كتابة الوصية واحدة من أكثر التجارب الإنسانية عُمقاً.",
    excerptEn: "Writing a will is considered one of the most profound human experiences.",
    pullQuoteAr: "«كلمات بين عالمين، ولكن حين تُقرأ وصايا الشهداء، نجد أنفسنا أمام ظاهرة نفسية فريدة.»",
    pullQuoteEn: "«Words between two worlds, but when reading the wills of martyrs, we find ourselves before a unique psychological phenomenon.»",
    contentAr: [
      "تُعد كتابة الوصية واحدة من أكثر التجارب الإنسانية عُمقاً؛ وقسوة فهي اللحظة التي يواجه فيها الإنسان فكرة الفناء وجهاً لوجه، ويحاول اختزال عمر كامل، بمشاعره وأفكاره، وعلاقاته في سطور معدودة.",
      "إنها اعتراف خطي بالرحيل، ومحاولة يائسة وصادقة لمد جسر من الكلمات بين عالمين، ولكن حين تُقرأ وصايا الشهداء، نجد أنفسنا أمام ظاهرة نفسية فريدة: كيف يتحول هذا العبء الوجودي الثقيل إلى حالة من السكينة المطلقة والراحة النفسية؟",
      "مشقة البداية: مواجهة الحبر..."
    ],
    contentEn: [
      "Writing a will is considered one of the most profound and harsh human experiences; it is the moment a person confronts the idea of mortality face to face, attempting to distill an entire lifetime—with all its feelings, thoughts, and relationships—into a few lines.",
      "It is a written confession of departure, a desperate and honest attempt to build a bridge of words between two worlds. But when the wills of martyrs are read, we find ourselves facing a unique psychological phenomenon: how does this heavy existential burden transform into a state of absolute tranquility and psychological peace?",
      "The hardship of the beginning: confronting the ink..."
    ]
  },
  {
    id: "art-4",
    categoryAr: "توثيق | Documentation",
    categoryEn: "Documentation",
    titleAr: "سجل وصايا الشهداء الفلسطينيين",
    titleEn: "Register of Palestinian Martyrs' Wills",
    authorAr: "توثيق ميدان",
    authorEn: "Midaan Archive",
    date: "2026-10-20",
    readTimeAr: "٦ دقائق",
    readTimeEn: "6 min read",
    excerptAr: "وثيقة فكرية وتاريخية تجمع أبرز وصايا الشهداء.",
    excerptEn: "An intellectual and historical document compiling prominent martyrs' wills.",
    pullQuoteAr: "«تنوعت بين التأصيل الثقافي والرسائل الميدانية العفوية تحت الرصاص.»",
    pullQuoteEn: "«Ranging from cultural grounding to spontaneous field messages under fire.»",
    contentAr: [
      "وصايا الشهداء: السجل الخالد في الوجدان الفلسطيني.",
      "وثيقة فكرية وتاريخية تجمع أبرز وصايا الشهداء الفلسطينيين التي شكلت محطات فارقة في الوعي الجمعي، تنوعت بين التأصيل الثقافي والرسائل الميدانية العفوية تحت النيران.",
      "جدول تعريفي بالوصايا المدرجة يعرض سنة الاستشهاد وطبيعة الوصية من باسل الأعرج إلى إبراهيم النابلسي."
    ],
    contentEn: [
      "Martyrs' Wills: The Immortal Register in the Palestinian Conscience.",
      "An intellectual and historical document compiling the most prominent wills of Palestinian martyrs that formed milestones in collective awareness, ranging from cultural grounding to spontaneous field messages under fire.",
      "An introductory table of the listed wills displays the year of martyrdom and the nature of the will, from Basil Al-Araj to Ibrahim Al-Nabulsi."
    ]
  }
];

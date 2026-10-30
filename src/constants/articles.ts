export interface ArticleSection {
  headingAr?: string;
  headingEn?: string;
  paragraphsAr: string[];
  paragraphsEn: string[];
  quoteAr?: string;
  quoteEn?: string;
}

export interface ArticleTable {
  headersAr: string[];
  headersEn: string[];
  rowsAr: string[][];
  rowsEn: string[][];
}

export interface Article {
  id: string;
  issueId: 'issue-zero';
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
  sections?: ArticleSection[];
  table?: ArticleTable;
  merchLink?: string;
}

export const FOUNDING_MANIFESTO = {
  "titleAr": "البيان التأسيسي: انتحاب (العدد صفر)",
  "titleEn": "Founding Manifesto: Entihab / Lamentation (Issue Zero)",
  "paragraphsAr": [
    "في هذا الميدان، نحن لا نكتب الرثاء، بل نوثق النبض الذي لا يموت.",
    "«انتحاب» ليس تسليماً بالانكسار، بل هو وقوف مهيب في حضرة الدم، وإجلال مطلق للشهداء والأحرار الذين جعلوا من أجسادهم جسوراً نعبر بها نحو البقاء. الحزن هنا ليس استسلاماً، بل هو غضب يُشحذ، وذاكرة تأبى النسيان.",
    "لقد ظنوا أن الساحات قد فرغت، لكن «الميدان» لم يُخلَ يوماً ولن يُخلى. ما دامت المقاومة فكرة، والفكرة لا تُغتال، فإن المعركة مستمرة، تتوارثها الأجيال حتى لحظة التحرير.",
    "نطلق «ميدان» اليوم كـ خندق فني وثقافي، نحرس فيه الرواية، ونغزل من ألم الفقد راية لا تُنكس. نأخذ من الحزن وقوداً، ومن الكلمة سلاحاً، ومن الفن متراساً نقف خلفه لندافع عن هويتنا.",
    "هذا هو «العدد صفر».. صرختنا الصامتة، وعهدنا المكتوب بوجع الأرض. تأملوا هذا الانتحاب جيداً، واقرأوا ما بين سطور الفقد.. وتجهزوا، فخلف هذا الصمت الثقيل، عاصفة قادمة ستُكتب في العدد الأول."
  ],
  "paragraphsEn": [
    "In this Midaan (arena), we do not write elegies; we document the pulse that refuses to die.",
    "'Entihab' (Lamentation) is not a surrender to defeat; it is a solemn stand in the presence of blood, and absolute reverence for the martyrs and free spirits who turned their bodies into bridges upon which we cross toward survival. Grief here is not submission; it is wrath being sharpened, and memory that defies oblivion.",
    "They thought the arenas were emptied, but 'Midaan' has never been vacated, nor shall it ever be. As long as resistance remains an idea, and ideas cannot be assassinated, the battle continues—inherited across generations until the hour of liberation.",
    "Today we launch 'Midaan' as an artistic and cultural trench wherein we guard the narrative and weave from the pain of loss a banner that never falters. We take fuel from sorrow, weapons from the word, and barricades from art behind which we stand to defend our identity.",
    "This is 'Issue Zero'.. our silent cry, and our covenant inscribed with the agony of the land. Reflect deeply upon this lamentation, read between the lines of loss.. and prepare, for behind this heavy silence lies a coming storm that shall be written in Issue One."
  ]
};

export const ARTICLES: Article[] = [
  {
    "id": "art-1",
    "issueId": "issue-zero",
    "categoryAr": "افتتاحية العدد",
    "categoryEn": "Editorial",
    "titleAr": "صراع الأرض والسماء: لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟",
    "titleEn": "Conflict of Earth and Sky: Why the Palestine Cause Cannot Be Understood Apart from Creed",
    "authorAr": "محررو ميدان",
    "authorEn": "Midaan Editorial Collective",
    "date": "2026-10-01",
    "readTimeAr": "٨ دقائق",
    "readTimeEn": "8 min read",
    "excerptAr": "على طاولات المفاوضات الباردة يتحدث الساسة بلغة الأرقام والحدود، لكن على الأرض يتحدث الواقع بلغة جغرافيا العقيدة.",
    "excerptEn": "At cold diplomatic tables, politicians speak the language of numbers and borders; on the ground, reality speaks in the geography of creed.",
    "pullQuoteAr": "«لا يمكن فهم الصراع الفلسطيني كنزاع حدودي عابر؛ إنه صراع وجودي تتداخل فيه نصوص الكتب المقدسة مع بنادق المشاة.»",
    "pullQuoteEn": "«The Palestinian struggle cannot be reduced to a passing border dispute; it is an existential conflict where sacred texts intertwine with infantry rifles.»",
    "contentAr": [
      "على طاولات المفاوضات الباردة، يتحدث الساسة بلغة الأرقام، مساحات الأراضي، الكثافة السكانية، والحدود الآمنة. يعتقدون أن ورقة وقلم وخرائط ملونة تكفي لتقسيم الأرض وإنهاء عقود من الصراع. لكن على الأرض، حيث تُسفك الدماء وتُهدم البيوت وتُتلى الصلوات تحت دوي المدافع، يتحدث الواقع لغة أخرى تماماً؛ لغة لا تعترف بجغرافيا السياسة، بل بـ «جغرافيا العقيدة».",
      "إن الخطأ الأكبر الذي يقع فيه المراقب الخارجي هو محاولة اختزال الصراع الفلسطيني الإسرائيلي في كونه مجرد نزاع حدودي أو خلاف سياسي على دولة وموارد. الحقيقة أعمق وأكثر تجذراً؛ إنه صراع وجودي تتداخل فيه نصوص الكتب المقدسة مع بنادق المشاة، وتختلط فيه روايات الأنبياء بقرارات الأمم المتحدة.",
      "التوراة كخريطة طريق.. العقيدة في خدمة الاستعمار: لفهم جوهر الصراع، يجب أن ننظر إلى كيف وظفت الحركة الصهيونية «العقيدة» كأداة استعمارية إحلالية. رغم أن الآباء المؤسسين للصهيونية كانوا علمانيين بامتياز، إلا أنهم أدركوا مبكراً أن مشروعهم لا يمكن أن ينجح دون تعبئة روحية.",
      "لم يأتِ المهاجرون من أقاصي الأرض من أجل دولة ديمقراطية فحسب، بل جاؤوا مدفوعين بسردية «أرض الميعاد» ومفهوم «شعب الله المختار». لقد تحولت النصوص التوراتية في أيديهم من طقوس دينية إلى وثائق ملكية عقارية، ومن صلوات روحية إلى أوامر عسكرية بإخلاء الأرض وإحلال مستوطنين مكان أصحابها الأصليين.",
      "«آية في كتاب».. الجذور في العقل الجمعي الإسلامي: في المقابل، لا يمكن فهم الصمود الفلسطيني الأسطوري دون فهم المحرك العقائدي الذي يغذي هذا الصمود. بالنسبة للفلسطيني وللعربي والمسلم من خلفه، فلسطين ليست مجرد مساحة ترابية يمكن التعويض عنها في مكان آخر. إنها ليست مجرد وطن بالمعنى القومي الحديث، بل هي آية من القرآن.",
      "ارتباط المسلمين بفلسطين هو ارتباط نصي وروحي غير قابل للتفاوض، ويتلخص في ركيزتين:\n• أولاً: عقيدة الإسراء والمعراج، فالمسجد الأقصى ليس مجرد بناء حجري، بل هو بوابة الأرض إلى السماء وثاني المسجدين وأولى القبلتين.\n• ثانياً: عقيدة الرباط، ففي الموروث الثقافي والديني يُنظر إلى التواجد في هذه الأرض على أنه حالة «رباط» دائم وحراسة مستمرة لثغور الحق، مما يحول البقاء إلى عبادة مقدسة.",
      "مقارنة تحليلية: أبعاد الصراع بين الرؤية والواقع:\n• طبيعة الخلاف: المنظور السياسي التقليدي يراه نزاعاً على الحدود والموارد، بينما الواقع العقائدي يدرك أنه صراع وجودي يمس الهوية والكتب المقدسة والإرث الروحي.\n• أدوات الحل: المنظور السياسي يراهن على طاولات المفاوضات والحلول الوسطى، بينما الواقع العقائدي يرى التمسك بالحقوق التاريخية والدينية غير القابلة للتجزئة.\n• محرك الصمود: المنظور السياسي يطالب بحقوق مواطنة في إطار القانون الدولي، بينما المحرك الحقيقي هو اليقين العقائدي والرباط وحماية المقدسات كواجب ديني وأخلاقي.",
      "سقوط وهم «البراغماتية» ومعركة الروايات: الجواب يكمن في استحالة تفكيك العقيدة بالسياسة. يمكن للسياسي أن يقبل بالتنازل عن نسبة من مساحة الأرض مقابل امتيازات معينة، لكن كيف يمكنه التنازل عن مقدسات منسوجة في صلب هوية الإنسان؟",
      "إن إسرائيل تزداد انزلاقاً نحو اليمين الديني المتطرف؛ فالصهيونية الدينية اليوم تشكل الحكومات وتتخذ قرارات الحرب بناءً على نبوءات ورؤى إقصائية، مما يجهض أي أمل في التسويات البراغماتية السطحية.",
      "إن صراع الفلسطينيين مع الاحتلال هو حرب روايات وهويات قبل أن يكون حرب بنادق. وبينما تحاول الصهيونية ليّ عنق التاريخ لصناعة شرعية زائفة، تقف الرواية الفلسطينية متجذرة كشجر الزيتون، تستمد بقاءها من عقيدة راسخة بأن الحق لا يسقط بالتقادم، وأن الأرض في النهاية تنطق بلغة أصحابها الأصليين."
    ],
    "contentEn": [
      "At cold diplomatic tables, politicians converse in the dialect of metrics, surface acreage, demographic density, and secure perimeter borders. They operate under the illusion that pen, paper, and colored cartography suffice to partition the soil and conclude decades of struggle. Yet upon the earth itself—where blood is spilled, ancestral dwellings are leveled, and prayers resonate under the roar of artillery—reality speaks a completely different tongue; one that recognizes neither the cartography of diplomacy, but rather the 'geography of creed'.",
      "The gravest error committed by detached observers is the reduction of the Palestinian-Israeli struggle into a standard territorial dispute or political friction over state apparatus and natural resources. The reality is incomparably deeper and profoundly rooted: an existential clash wherein scriptural verses intersect with infantry rifles, and the oral traditions of prophets intermingle with resolutions of the United Nations.",
      "The Torah as a Colonial Roadmap.. Creed in the Service of Settlement: To comprehend the core of this struggle, one must examine how the Zionist movement operationalized 'creed' as an instrument of settler-colonial dispossession. Although Zionism's founding figures were avowed secularists, they recognized early on that their project could never achieve mobilization without spiritual fervor.",
      "Immigrants did not journey from the far corners of the earth merely to establish a liberal democracy; they arrived impelled by the narrative of the 'Promised Land' and the construct of the 'Chosen People'. Scriptural passages were transformed in their hands from liturgical devotions into real estate deeds, and from spiritual prayers into tactical military mandates commanding the clearance of the land and the substitution of indigenous inhabitants with settlers.",
      "'A Verse in a Sacred Book'.. Roots in the Islamic Collective Consciousness: Conversely, one cannot fathom legendary Palestinian steadfastness (Sumud) without decoding the creedal engine that sustains it. For the Palestinian—and the Arab and Muslim behind them—Palestine is not an exchangeable tract of soil compensable elsewhere. It is not merely a modern nation-state construct, but an indelible verse in the Quran.",
      "The bond is non-negotiable and anchored upon two immovable pillars:\n• First, the Creed of the Night Journey and Ascension (Al-Isra' wal-Mi'raj), where Al-Aqsa Mosque is not a stone structure, but the gateway of earth to heaven, the second sanctuary established, and Islam's first Qibla.\n• Second, the Creed of Ribat (Vigilance on the Frontier), wherein dwelling upon this land is revered as permanent spiritual guard over the frontiers of truth, transforming physical presence into sanctified worship.",
      "Analytical Comparison: Dimensions of the Conflict:\n• Nature of Conflict: Traditional politics sees a territorial dispute over borders and resources; the creedal reality recognizes an existential struggle touching identity, sanctified scripture, and spiritual inheritance.\n• Mechanisms of Resolution: Politics relies on diplomatic summits and compromise; the creedal reality holds fast to historical and religious rights that brook no partition or concession.\n• Engine of Steadfastness: Politics demands civic rights under international law; the creedal engine is spiritual certainty, front-line vigil (Ribat), and safeguarding holy sanctuaries as a sacred moral duty.",
      "The Demise of Political 'Pragmatism': The crux lies in the impossibility of dissolving theological conviction through political negotiation. A diplomat might concede territory in exchange for guarantees; but how does a people surrender sanctities interwoven into the marrow of human identity?",
      "Simultaneously, Israel drifts relentlessly toward religious extremism; religious Zionism commands cabinets and dictates military actions based on exclusionary prophecies, extinguishing all hopes in superficial pragmatic compromises.",
      "Conclusion: The War of Narratives and Certainty: The Palestinian struggle against colonial occupation is first and foremost a battle of memory, identity, and narrative before it is an exchange of gunfire. While settler colonialism twists history to manufacture synthetic legitimacy, the Palestinian narrative stands deep-rooted like ancient olive trees, deriving its endurance from an unwavering conviction: that truth does not lapse through the passage of time, and that the earth ultimately speaks the language of its indigenous sons."
    ]
  },
  {
    "id": "art-2",
    "issueId": "issue-zero",
    "categoryAr": "مقال فكري",
    "categoryEn": "Philosophical Essay",
    "titleAr": "سأموت قبل الأربعين",
    "titleEn": "I Will Die Before Forty",
    "authorAr": "صوت ميدان",
    "authorEn": "Midaan Voice",
    "date": "2026-10-10",
    "readTimeAr": "٧ دقائق",
    "readTimeEn": "7 min read",
    "excerptAr": "عمري الآن واحد وثلاثون عاماً. تسع سنوات فقط تفصلني عن الأربعين وعن النهاية الحتمية لروحي إن استمرت داخل هذه المصفوفة المبرمجة.",
    "excerptEn": "I am thirty-one years old. Only nine years separate me from forty and from the inevitable demise of my soul if it remains inside this programmed matrix.",
    "pullQuoteAr": "«لم أعد أخشى الموت البيولوجي، بل أخشى الموت البطيء: موت الشغف، موت التساؤل، وموت الذات داخل آلة عملاقة ابتلعتنا جميعاً.»",
    "pullQuoteEn": "«I no longer fear biological death; I fear the slow death: the death of passion, the death of inquiry, and the death of self inside a colossal machine that swallowed us all.»",
    "contentAr": [
      "عمري الآن واحد وثلاثون عاماً. تسع سنوات فقط تفصلني عن الأربعين، وتفصلني عن النهاية الحتمية لروحي إن استمرت في محاولة النجاة داخل هذه المصفوفة المبرمجة. لم أعد أخشى الموت البيولوجي، بل أخشى الموت البطيء؛ موت الشغف، موت التساؤل، وموت الذات داخل آلة عملاقة ابتلعتنا جميعاً منذ صرختنا الأولى. آلة يسمونها.. «النظام»، «السستم».",
      "السستم: المصفوفة الكبرى: لقد ولدتُ لأجد نفسي عالقاً في شبكة عنكبوتية من الأنظمة المتداخلة. قوالب مُعدة مسبقاً لا خيار لك سوى أن تُحشر فيها لكي تُمنح صك «الرضا». لم أفهم هذا السستم يوماً، ولم يفهمني. أنا فيه مجرد خطأ في الشيفرة (Glitch)، ترس يرفض الدوران مع البقية لأنه يرى الهاوية التي يتجهون إليها.",
      "النظام الأبوي: صكوك الملكية: بدأ الترويض في البيت. النظام الأبوي لم يكن يوماً حضناً أو دليلاً، بل كان سلطة هرمية لا تقبل النقاش. لقد عاملونا كمشاريع استثمارية أو كامتداد لنقصهم، لا كأرواح مستقلة. «افعل هذا لأنني الأكبر»، «اختر هذا المسار لأنه يرفع رأس العائلة». لم أفهم يوماً كيف يُترجم الحب إلى شروط، وكيف أصبحت الطاعة العمياء هي المقياس الوحيد لبر الأبناء. لقد صادروا هويتي قبل أن أكتشفها، وأخبروني أن هذا هو «الاحترام».",
      "النظام التعليمي: مقصلة العقول: ثم سلموني إلى النظام التعليمي.. مصنع النسخ المتطابقة. هناك تم تلقيني أول دروس النفاق: كيف تحفظ ما لا تؤمن به لتجتاز امتحاناً لا يقيس سوى قدرتك على الخضوع. لم يعلمونا كيف نتساءل، بل كيف نردد. كان النظام مصمماً بدقة لقص أجنحة الخيال، لقتل أي تفكير نقدي، ولتحويلنا إلى براغيث مطيعة تقفز في نفس المستوى، جاهزة لسوق العمل. من يخرج عن النص، من يسأل «لماذا؟»، يُعاقب ويُصنف كفاشل.",
      "النظام المجتمعي: مسرح العبث والنفاق: خرجت إلى الشارع لأصطدم بالنظام المجتمعي.. مسرحية عبثية أبطالها بارعون في ارتداء الأقنعة. مجتمع مهووس بالمظاهر، يقدس الاستهلاك ويقيم الإنسان بناءً على ماركة سيارته ورصيده البنكي. رسموا لنا «الكتالوج»: تخرج، توظف، اقترض لترهن عمرك للبنك، تزوج لترضي المجتمع، وأنجب أطفالاً لتعيد إدخالهم في نفس المفرمة. النفاق هنا ليس خللاً، بل هو «زيت المحرك» الذي يجعل هذا المجتمع يدور. الصادق منبوذ، والمختلف يمثل تهديداً للقطيع المخدر، لذلك يحاربونه بشراسة.",
      "النظام الربوبي: الأسئلة المحرمة: وهنا نصل إلى المتاهة الكبرى.. قمة الهرم الذي يبررون به كل ما سبق: النظام الربوبي كما صدّروه لنا. لم أفهم يوماً تلك الصورة المشوهة التي قدموها عن الإله؛ إله غاضب متربص يتعامل معنا بمنطق الثواب والعقاب التجاري البحت، وكأننا في صفقة مستمرة. في داخلي حنين لشيء أعظم، لطاقة كونية، لسلام حقيقي ومطلق، لكن نصوصهم وتفسيراتهم حوّلت الدين إلى أداة سيطرة، إلى نظام حراسة يقمع العقل ويحرّم التفكير. إذا سألت: «لماذا خُلقنا لنعاني في هذا العبث المستمر؟» يتهمونك بالزندقة. هم لا يريدونك أن تتصل بالخالق، بل يريدونك أن تخضع للنسخة التي فصّلوها هم عنه؛ نسخة تخدم سلطتهم وتبرر استبدادهم.",
      "تسع سنوات متبقية: الوقوف في وجه السستم: أنا في الواحدة والثلاثين، وأقف عارياً من كل هذه الأنظمة. أرفضها وترفضني. الاختلاف ليس ادعاءً أتباهى به، بل هو لعنة أعيشها كل يوم. أن ترى الخيوط التي تحرك الدمى يجعلك عاجزاً عن الاستمتاع بالعرض. لن أعيش حتى الأربعين. سأموت قبلها، ليس لأن جسدي سيفنى، بل لأن الاختيار قد حُسم: إما أن أتنازل، أطأطئ رأسي، أرتدي القناع وأقبل بتسوية مع «السستم» ليموت ما تبقى من إنسانيتي وصدقي.. وإما أن أستمر في هذه الحرب الوجودية العبثية، أقاوم تيار الأنظمة كلها حتى أحترق وأتلاشى بشرف. وفي كلتا الحالتين، الرجل الذي يحمل اسمي الآن، والذي ينبض بالحقيقة والرفض، لن يكون موجوداً بعد تسع سنوات."
    ],
    "contentEn": [
      "I am now thirty-one years old. Just nine years separate me from forty, and from the inevitable expiration of my soul if it persists in trying to survive inside this programmed matrix. I no longer fear biological cessation; I fear the slow death—the death of passion, the death of inquiry, and the extinction of the self within a gargantuan apparatus that swallowed us whole from our first cry. A machine they designate.. 'The System'.",
      "The System: The Great Matrix: I was born only to find myself entangled in an intricate web of interlocking systems. Pre-fabricated molds into which you have no choice but to be squeezed so you may be granted the stamp of 'Approval'. I never understood this system, and it never understood me. Within it, I am merely an anomaly in the code (a Glitch), a cog that refuses to turn with the rest because it clearly sees the abyss toward which they are heading.",
      "The Patriarchal System: Deeds of Ownership: Domestication commenced at home. The patriarchal order was never a sanctuary or a compass; it was a rigid hierarchy intolerant of dialogue. They treated us as financial investments or extensions of their own deficits, never as sovereign souls. 'Do this because I am elder', 'Pursue this path because it elevates the family name'. I never comprehended how affection is translated into conditional terms, or how blind compliance became the sole metric of filial piety. They foreclosed my identity before I could discover it, decreeing that this was 'respect'.",
      "The Educational System: The Guillotine of Intellect: Then they consigned me to the educational system.. the manufacturing plant of identical replicas. There, I was instructed in the foundational lessons of hypocrisy: how to memorize what you reject in order to pass examinations that measure nothing beyond your capacity for subservience. They never instructed us on how to question, only how to echo. The apparatus was calibrated to sever the wings of imagination, execute critical thinking, and convert us into obedient laborers suited for the corporate marketplace. Whoever deviated from the syllabus, whoever dared ask 'Why?', was penalized and categorized as defective.",
      "The Societal System: Theatre of the Absurd and Deceit: I emerged onto the streets to collide with the social establishment.. an absurd theater populated by virtuosos of masked performance. A society consumed by superficial veneers, canonizing consumerism and measuring human dignity by automotive brand and bank balance. They drafted the standard catalogue: graduate, get employed, mortgage your existence to financial lenders, marry to appease communal conventions, and procreate to feed new flesh into the identical meat-grinder. Hypocrisy here is no malfunction; it is the lubricating oil that keeps the machine spinning. The genuine soul is ostracized; the deviant is hunted as an existential hazard to the sedated herd.",
      "The Theological System: The Prohibited Interrogations: Here we reach the ultimate labyrinth.. the apex of the pyramid invoked to sanctify everything prior: the divine apparatus as exported to us. I never accepted the distorted portrait of divinity they purveyed: a vengeful, vigilant sovereign transacting with humanity through crude commercial balance sheets of reward and retribution. Inside me resides a longing for something infinitely greater, a cosmic presence, a peace unadulterated and unconditional. Yet their texts and doctrines converted faith into an instrument of domination, an armed watchtower suppressing thought and outlawing wonder. If you dare ask: 'Why were we brought forth to endure this perpetual absurdity?', you are condemned as a heretic. They seek not your communion with the Divine, but your submission to the version they tailored to legitimize their own tyranny.",
      "Nine Years Remaining: Defying the Matrix: I stand at thirty-one, stripped bare of all these systems. I disavow them, and they disavow me. Non-conformity is no vanity I flaunt; it is an agonizing reality I inhabit daily. Observing the strings that manipulate the marionettes incapacitates one from enjoying the spectacle. I shall not survive until forty. I shall perish before it—not because my biology will disintegrate, but because the ultimatum is resolved: either I capitulate, lower my head, fasten the mask, and negotiate terms with 'The System' until whatever remains of my humanity suffocates.. or I endure in this existential insurrection, resisting every current until I burn and dissipate with honor. In either outcome, the man who carries my name today, whose heart beats with truth and defiance, will cease to exist in nine years."
    ]
  },
  {
    "id": "art-3",
    "issueId": "issue-zero",
    "categoryAr": "دراسة فلسفية",
    "categoryEn": "Philosophical Study",
    "titleAr": "حبر اليقين: من مشقة الوداع إلى سكينة الشهادة",
    "titleEn": "Ink of Certainty: From the Hardship of Parting to the Serenity of Martyrdom",
    "authorAr": "صوت ميدان",
    "authorEn": "Midaan Voice",
    "date": "2026-10-15",
    "readTimeAr": "٨ دقائق",
    "readTimeEn": "8 min read",
    "excerptAr": "تُعد كتابة الوصية واحدة من أكثر التجارب الإنسانية عُمقاً وقسوة؛ فكيف يتحول هذا العبء الوجودي الثقيل إلى حالة من السكينة المطلقة واليقين؟",
    "excerptEn": "Drafting a testament is among the most profound and unforgiving human experiences; how does this existential weight transform into boundless serenity?",
    "pullQuoteAr": "«القلم عندما يُغمس في حبر اليقين يملك القدرة على هزم الخوف من الموت، وتحويل أصعب كتابة في حياة الإنسان إلى وثيقة للخلود والطمأنينة.»",
    "pullQuoteEn": "«When the pen is dipped into the ink of certainty, it possesses the power to vanquish the fear of mortality and transform humanity’s hardest writing into a covenant of eternity.»",
    "contentAr": [
      "تُعد كتابة الوصية واحدة من أكثر التجارب الإنسانية عُمقاً وقسوة؛ فهي اللحظة التي يواجه فيها الإنسان فكرة الفناء وجهاً لوجه، ويحاول اختزال عمر كامل بمشاعره وأفكاره وعلاقاته في سطور معدودة. إنها اعتراف خطي بالرحيل، ومحاولة يائسة وصادقة لمد جسر من الكلمات بين عالمين. ولكن حين تُقرأ وصايا الشهداء، نجد أنفسنا أمام ظاهرة نفسية فريدة: كيف يتحول هذا العبء الوجودي الثقيل إلى حالة من السكينة المطلقة والراحة النفسية؟",
      "مشقة البداية: مواجهة الحبر والعدم: تنبع الصعوبة البالغة في كتابة الوصية من كونها خطوة تتطلب تجرداً كاملاً من دافع البقاء الفطري. الإنسان بطبيعته يميل إلى تأجيل فكرة الموت وتجاهلها ليستمر في العيش. لذلك عندما يمسك المرء القلم ليكتب كلماته الأخيرة، فإنه يكسر هذا الدفاع النفسي ويضع حداً فاصلاً بين «الآن» و«ما بعد».",
      "في هذه اللحظة، يعيش الإنسان العادي حالة من القلق والاضطراب؛ فالأسئلة تهاجمه: ماذا سأترك خلفي؟ كيف سيذكرني الناس؟ هل أوفيت بعهودي؟ إنها مواجهة مع الحيرة والندم المحتمل. وكما عبّر الشهيد باسل الأعرج بصدق وعفوية في مطلع وصيته: «لكم من الصعب أن تكتب وصيتك»، مبرزاً تلك الحيرة الفلسفية والنفسية التي تسبق صياغة الوداع الفكري.",
      "التسامي النفسي: كيف وُلدت السكينة من رحم الخطر؟ على الرغم من تلك الصعوبة البدئية، أظهرت النصوص الأخيرة للشهداء تحولاً نفسياً مذهلاً يتجاوز الاضطراب المعتاد لدى البشر في لحظات المقاربة من الموت. هذا التحول يمكن تفسيره من خلال ثلاثة أبعاد فكرية ونفسية رئيسية:",
      "1. حسم الحيرة والوصول إلى الأجوبة: الحيرة هي المصدر الأكبر للقلق النفسي الإنساني. الشهيد في اللحظة التي يقرر فيها المضي في طريقه يكون قد حسم أعمق أسئلته الوجودية. عندما قال باسل الأعرج: «أنا الآن أسير إلى حتفي راضياً مقتنعاً وجدت أجوبتي»، كان يعلن عن شروق حالة من السلام الداخلي نتيجة التوافق التام بين مبادئه وأفعاله. هذا التوافق ينهي الصراع النفسي الداخلي ويحل محله رضا عميق وسكينة لا تهزها قعقعة السلاح.",
      "2. التجرد من «الأنا» والانصهار في الفكرة: في علم النفس الحديث، يرتبط الخوف من الموت غالباً بالخوف من ضياع الذات أو «الأنا». لكن الشهيد يمر بعملية تسامٍ (Sublimation) تجعله يرى نفسه ليس كجسد فانٍ، بل كامتداد لفكرة أسمى—كالوطن أو الحرية أو الكرامة. عندما تذوب «الأنا» الفردية في «النحن» الجماعية، يفقد الموت قوته المرعبة ويتحول من نهاية مأساوية إلى وسيلة لإحياء المجموع، كما يظهر في وصية عدي التميمي الذي كتب بوعي تام أن هدفه هو تحريك مئات الشباب ليحملوا البنادق من بعده.",
      "3. قلب معادلة الخوف والمواجهة المباشرة: تتسم وصايا الميدان (مثل رسالة إبراهيم النابلسي أو وديع الحوح) بنبرة صوتية ونفسية تخلو تماماً من التردد أو الانكسار. نفسياً، المواجهة المباشرة والمقبلة (غير المدبرة) تمنح العقل البشري تدفقاً من الشجاعة الأدرينالينية واليقين الروحي الذي يطرد الخوف. الشهيد لا ينتظر الموت السلبي، بل يذهب إلى مصيره بنشاط وإرادة، وهذا الامتلاك لقرار النهاية يمنحه تفوقاً نفسياً هائلاً على محاصريه.",
      "الأثر النفسي للوصية: نقل العبء إلى الأحياء: تتحول وصية الشهيد في نهاية المطاف من وثيقة رثاء شخصية إلى أداة توجيه نفسي وفكري للأحياء. الشهيد، بوصوله إلى غايته وسكينته، يضع القلم ويرحل تاركاً خلفه «الأسئلة» برسم الإجابة لمن بقي حياً. إنه يقول بلسان الحال: «أنا وجدت إجابتي واطمأن قلبي، فماذا أنتم فاعلون؟».",
      "إن الراحة النفسية والمكانة العالية التي تعكسها هذه النصوص ليست مجرد نتاج لحظة عاطفية عابرة، بل هي خلاصة وعي فكري وتصالح تام مع الذات. لقد أثبتت هذه الكلمات أن القلم، عندما يُغمس في حبر اليقين، يملك القدرة على هزم الخوف من الموت، وتحويل أصعب كتابة في حياة الإنسان إلى وثيقة للخلود والطمأنينة."
    ],
    "contentEn": [
      "The drafting of a final will stands as one of the most agonizing and profound encounters of human existence; it is the exact instant wherein mortality is confronted unvarnished, attempting to compress an entire biography—its passions, doubts, and bonds—into brief lines. It is a written acknowledgment of farewell, a vulnerable endeavor to span a linguistic bridge across two realms. Yet when studying the testaments of Palestinian martyrs, one encounters a remarkable psychological phenomenon: how does this crushing existential burden metamorphose into absolute composure, serenity, and inward peace?",
      "The Hardship of the Threshold: Confronting Ink and the Void: The immense gravity of composing a will originates in demanding unconditional detachment from biological self-preservation. Human psychology naturally defers contemplation of mortality to sustain daily function. Thus, when an individual grips the pen to inscribe final words, that protective defense collapses, engraving a definitive boundary between 'the now' and 'the beyond'.",
      "Here, ordinary individuals experience disquiet: What remains behind? How shall memory treat me? Have I honored my vows? It is a confrontation with uncertainty. As the martyr-intellectual Basil al-Araj phrased it with raw candor: 'How difficult it is to write your own testament', illuminating the philosophical hesitation preceding parting reflections.",
      "Psychological Sublimation: How Serenity Emerges from Mortal Peril: Notwithstanding the initial threshold, the final testaments reveal a startling psychological transformation surpassing standard existential agitation. This metamorphosis unfolds across three foundational dimensions:",
      "1. Resolving the Labyrinth and Attaining Certainty: Uncertainty is the supreme source of psychic anxiety. The martyr, having embraced their trajectory, has definitively answered life's heaviest questions. When Basil al-Araj declared: 'I march toward my end content, convinced, having found my answers', he proclaimed an inward dawn born of seamless synthesis between ethics and action. This coherence terminates inner dissonance, replacing anxiety with unshakable composure undisturbed by the roar of arms.",
      "2. Transcending the Ego and Merging into the Cause: Modern psychoanalysis frequently correlates thanatophobia with terror over ego extinction. Yet the martyr undergoes profound sublimation, perceiving the self not as frail biological matter, but as an enduring vehicle for higher ideals—liberation, dignity, and homelands. When individual ego dissolves into the collective 'we', death loses its paralyzing potency and transforms from catastrophe into collective renewal, evidenced in Oday al-Tamimi's declaration that his mission was to stir hundreds of youths to shoulder the vanguard after him.",
      "3. Inverting the Calculus of Fear through Direct Engagement: Battlefield testaments (such as the voice dispatches of Ibrahim al-Nabulsi or Wadee al-Hawah) exhibit vocal frequencies devoid of hesitation. Direct forward confrontation releases physiological resolve combined with spiritual conviction that expels dread. Refusing passive demise, the martyr advances autonomously, seizing destiny and securing psychological mastery over besieging forces.",
      "The Psychological Resonance: Bequeathing the Inquest to the Living: Ultimately, the martyr's testament evolves from personal eulogy into an intellectual catalyst directed at the living. Having attained tranquility, the author lays down the instrument, departing while casting existential interrogations upon those left behind. The subtext is clear: 'I have arrived at my certainty and stilled my heart; what will you do now?'.",
      "The composure radiating from these words is no temporary emotional impulse, but distilled consciousness and radical peace. They demonstrate that when the pen is submerged into the ink of certainty, it possesses the virtue to overcome mortality, transmuting life's most formidable composition into a charter of transcendence and calm."
    ]
  },
  {
    "id": "art-4",
    "issueId": "issue-zero",
    "categoryAr": "أرشيف وتوثيق",
    "categoryEn": "Historical Registry",
    "titleAr": "سجل وصايا الشهداء الفلسطينيين",
    "titleEn": "Register of Palestinian Martyrs' Wills",
    "authorAr": "توثيق ميدان الأرشيفي",
    "authorEn": "Midaan Archival Research",
    "date": "2026-10-20",
    "readTimeAr": "١٠ دقائق",
    "readTimeEn": "10 min read",
    "excerptAr": "وثيقة فكرية وتاريخية تجمع أبرز وصايا الشهداء الفلسطينيين التي شكلت محطات فارقة في الوعي الجمعي والاشتباك الميداني.",
    "excerptEn": "An intellectual and archival record compiling prominent testaments of Palestinian martyrs that forged milestones in collective awareness and frontline resistance.",
    "pullQuoteAr": "«تنوعت بين التأصيل الثقافي والرسائل الميدانية العفوية تحت النيران، لتشكل سجلاً خالداً في الوجدان الوطني.»",
    "pullQuoteEn": "«Ranging from cultural theory to spontaneous battlefield dispatches under fire, constituting an immortal ledger in the national consciousness.»",
    "contentAr": [
      "وثيقة فكرية وتاريخية تجمع أبرز وصايا الشهداء الفلسطينيين التي شكلت محطات فارقة في الوعي الجمعي، وتنوعت بين التأصيل الثقافي الثوري والرسائل الميدانية العفوية تحت النيران.",
      "جدول تعريفي بالوصايا المدرجة في السجل الأرشيفي:\n• 1. باسل الأعرج (2017) — فكرية / ثقافية ثورية.\n• 2. بهاء عليان (2015) — الوصايا العشر (اجتماعية وفكرية).\n• 3. دلال المغربي (1978) — سياسية وعسكرية استراتيجية.\n• 4. تامر الكيلاني (2022) — تنظيمية وروحية.\n• 5. إبراهيم النابلسي (2022) — ميدانية (تسجيل صوتي تحت الحصار).\n• 6. عدي التميمي (2022) — ميدانية مكتوبة (أثناء المطاردة والاشتباك).\n• 7. يحيى عياش (1996) — مقولات ومنهج اشتباك.\n• 8. وديع الحوح (2022) — ميدانية (عبر اللاسلكي العسكري).\n• 9. غسان كنفاني (1972) — أدبية وفلسفية مستخلصة.",
      "القسم الأول: الوصايا الفكرية والسياسية (وثائق الوعي الجمعي):",
      "1. وصية الشهيد المثقف باسل الأعرج (2017):\n«تحية العروبة والوطن والتحرير، أما بعد، فإن كنتم تقرؤون هذا فهذا يعني أني قد مت، وقد صعدت الروح إلى خالقها، وأدعو الله أن ألاقيه بقلب سليم مقبل غير مدبر بإخلاص بلا ذرة رياء.\nلكم من الصعب أن تكتب وصيتك، ومنذ سنين انقضت وأنا أتأمل كل وصايا الشهداء وتلك الحيرة كانت تفاجئني دائماً: مختصر مفيد دون إطالة. لماذا نكتب وصايانا؟ هل نكتبها لنرسم طريقاً لمن بعدنا أم نكتبها لتكون ملحمة شخصية، أم نكتبها كإعلان براءة من ذنب تركناه خلفنا؟\nأنا الآن أسير إلى حتفي راضياً مقتنعاً، وجدت أجوبتي، يا ويلي ما أحمقني، وهل هناك ما هو أكثر بلاغة وأفصح من فعل الشهيد؟ وكان من المفروض أن أكتب هذا قبل شهور طويلة إلا أن ما أقعدني عن هذا هو أن هذا سؤالكم أنتم الأحياء، فلماذا أجيب أنا عنكم؟ فلتبحثوا أنتم، أما نحن أهل القبور فلا نبحث إلا عن رحمة الله.»",
      "2. الوصايا العشر للشهيد بهاء عليان (2015):\n• أوصي الفصائل بعدم تبني شهادتي، فموتي كان للوطن وليس لكم.\n• أوصي بعدم طباعة البوسترات لي، فذاكرتكم أضعف من أن تبقيها، والجدران أقبح من أن تزينوها.\n• أوصي الأهالي بألا يحزنوا، بل يزغردوا، فلا تبكوا عليّ بل ابكوا على أنفسكم.\n• أوصي الصحفيين بألا يصوروا جثتي، فهذا يؤذي أمي.\n• أوصي ألا يكتبوا على قبري أي شعار أو اسم فصيل، بل يُكتب: هذا قبر الشهيد بهاء عليان.",
      "3. وصية الشهيدة دلال المغربي (1978):\n«وصيتي لكم جميعاً أيها الإخوة حملة البنادق أن تستمروا في الكفاح.. أرجو أن تتحدوا جميعاً في صف واحد وتوجيه البنادق إلى العدو الصهيوني. إن استقلال الإرادة الفلسطينية لا يتحقق إلا ضمن البندقية المستقلة.»",
      "4. وصية الشهيد تامر الكيلاني (2022):\n«أوصيكم ألا تبكوا عليّ بل زغردوا، وأوصيكم بعدم تنزيل أي صورة لي دون تغطية وجهي كي لا يُؤخذ عني طابع الاستعراض، وأطلب أن يُوضع سيفي الذي في غرفتي على قبري.»",
      "القسم الثاني: وصايا الميدان والاشتباك (رسائل اللحظات الأخيرة):",
      "5. رسالة الشهيد إبراهيم النابلسي (2022):\n«أنا استشهدت يا جماعة.. أنا بحب إمي كتير، وبحياة عرضكم ما حدا يترك البارودة، أنا محاصر ورايح أستشهد، ادعولي.»",
      "6. رسالة الشهيد عدي التميمي (2022):\n«أنا البطل عدي التميمي، منفذ عملية مخيم شعفاط. أعلم أنني لن أحرر فلسطين بعمليتي، ولكن نفذتها وأنا أعلم أن الهدف الأساسي أن أحرك مئات الشباب ليحملوا البنادق من بعدي.»",
      "7. مقولة الشهيد يحيى عياش (1996):\n«بإمكان اليهود اقتلاع جسدي من فلسطين، غير أنهم لن يستطيعوا اقتلاع الفكرة من عقول وقلوب الشباب.. إن المعركة لم تنتهِ ولن تنتهي إلا بزوال الاحتلال.»",
      "8. رسالة الشهيد وديع الحوح (2022):\n«لا تستسلموا.. اضربوهم من كل مكان، ما حد يرمي سلاحه، إحنا مشاريع شهادة يا شباب، ما حد يزعل علينا، استمروا، وراكم رجال.»",
      "القسم الثالث: وصايا أدبية وفلسفية من وحي القضية:",
      "9. وصية الأديب الشهيد غسان كنفاني (رؤية مستخلصة):\n• عن الموت: «إن قضية الموت ليست على الإطلاق قضية الميت.. إنها قضية الباقين المنتظرين بمرارة دورهم.»\n• عن الصمت: «لماذا لم تدقوا جدران الخزان؟ لماذا لم تقولوا؟ لماذا؟»\n• عن غزة والتمسك بالأرض: «لا يا صديقي، إني لن آتي إليك.. سأبقى هنا ولن أبرح أبداً. إنني أكتشف نفسي في غزة، هذه الملفات المعجونة بالدم هي وحدها التي تعطي للحياة معنى.»"
    ],
    "contentEn": [
      "An intellectual and historical archive cataloging foundational testaments of Palestinian martyrs that defined watershed epochs in collective awareness, oscillating between deep ideological grounding and spontaneous combat messages under fire.",
      "Synoptic Index of Documented Testaments:\n• 1. Basil al-Araj (2017) — Revolutionary intellectual & cultural theory.\n• 2. Baha Alyan (2015) — The Ten Commandments (Social & civic).\n• 3. Dalal al-Mughrabi (1978) — Strategic political & military imperative.\n• 4. Tamer al-Kilani (2022) — Organizational discipline & spiritual resolve.\n• 5. Ibrahim al-Nabulsi (2022) — Field audio dispatch under siege.\n• 6. Oday al-Tamimi (2022) — Field manuscript during active manhunt.\n• 7. Yahya Ayyash (1996) — Strategic doctrine & combat methodology.\n• 8. Wadee al-Hawah (2022) — Tactical transmission via military radio.\n• 9. Ghassan Kanafani (1972) — Distilled philosophical & literary paradigms.",
      "Part One: Intellectual and Political Testaments (Charters of Collective Consciousness):",
      "1. Testament of Intellectual Martyr Basil al-Araj (2017):\n'Greetings of Arab dignity, homeland, and liberation. To proceed: If you are reading this, it signifies that I have passed away, and my spirit has ascended to its Creator. I pray to meet God with a sound heart, advancing never retreating, in pure sincerity devoid of vanity.\nHow burdensome it is to write one's own testament. For long years I contemplated the wills of all martyrs; their brevity always astonished me: concise, purposeful, without superfluity. Why do we compose our wills? Do we write them to illuminate a path for those who follow, or do we write them as personal epics, or as declarations of absolution from sins left in our wake?\nI march toward my end content and convinced, having uncovered my answers. Woe unto me, how foolish was I—could anything prove more eloquent or articulate than the deed of the martyr? I ought to have written this months ago, yet what stayed my hand was knowing that this is an inquiry that belongs to you, the living. Why should I answer on your behalf? Seek for yourselves; as for us in the chambers of the grave, we seek nothing save the mercy of God.'",
      "2. The Ten Wills of Martyr Baha Alyan (2015):\n• I bid the factions not to adopt my martyrdom; my death was for the homeland, never for your apparatus.\n• I forbid the printing of commemorative posters; your collective memory is too frail to preserve them, and the walls too grim to be adorned.\n• I urge my family not to mourn, but to ululate with pride; weep not over me, but weep over your own state.\n• I command journalists not to photograph my corpse; such imagery wounds my mother.\n• I demand that no partisan insignia or factional acronym be inscribed upon my resting place; let it read simply: Here lies the martyr Baha Alyan.",
      "3. Testament of Martyr Dalal al-Mughrabi (1978):\n'My testament to all of you, comrades bearing arms: continue the struggle without pause. I beseech you to unite in a single line, directing your rifles exclusively toward the Zionist adversary. Sovereign Palestinian destiny can never be realized except through an independent rifle.'",
      "4. Testament of Martyr Tamer al-Kilani (2022):\n'I enjoin you not to shed tears over me, but to rejoice with honor. I prohibit the circulation of any unmasked portrait of mine, lest my legacy be misconstrued as vanity. And I request that the blade hanging in my room be placed upon my grave.'",
      "Part Two: Battlefield Testaments (Dispatches of the Final Hours):",
      "5. Message of Martyr Ibrahim al-Nabulsi (2022):\n'I have attained martyrdom, my people.. I love my mother immensely. By all that you hold sacred, never abandon the rifle. I am besieged and advancing to my end; pray for me.'",
      "6. Message of Martyr Oday al-Tamimi (2022):\n'I am the fighter Oday al-Tamimi, who carried out the Shuafat operation. I know well that my solitary operation will not liberate Palestine, but I executed it knowing that its primary purpose is to mobilize hundreds of youths to shoulder arms after me.'",
      "7. Maxim of Martyr Yahya Ayyash (1996):\n'The occupiers possess the capacity to uproot my physical body from Palestine, but they will never succeed in uprooting the idea from the intellect and hearts of the youth. The battle has not concluded, and will never conclude until the occupation is abolished.'",
      "8. Message of Martyr Wadee al-Hawah (2022):\n'Do not surrender.. strike them from every vantage. Let no fighter discard their weapon. We are projects of martyrdom, comrades; grieve not for our departure. Persevere; there are steadfast men behind you.'",
      "Part Three: Literary Testaments Inspired by the Cause:",
      "9. Philosophical Vision of Ghassan Kanafani (Distilled Legacy):\n• On Mortality: 'The problem of death is never the concern of the deceased.. it is the excruciating burden of those left behind, bitterly awaiting their turn.'\n• On Complicity and Silence: 'Why did you not pound on the walls of the tanker? Why did you remain silent? Why?'\n• On Gaza and the Soil: 'No, my friend, I shall never come to you in exile.. I shall remain here and never depart. I discover my true self in Gaza; these dossiers kneaded with blood are the solitary things that grant existence meaning.'"
    ]
  }
];

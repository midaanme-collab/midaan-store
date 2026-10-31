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
  authorAr?: string;
  authorEn?: string;
  date?: string;
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
    "In this arena, we do not write elegies; we document a pulse that does not die.",
    "'Entihab' (Lamentation) is no surrender to defeat. It is a solemn stance in the presence of blood, and deep reverence for the martyrs and free spirits who made of their bodies bridges for our survival. Grief here is not resignation; it is anger being sharpened, and memory that refuses to forget.",
    "They believed the squares had been emptied, but the Midaan has never been abandoned, nor will it ever be. So long as resistance remains an idea—and an idea cannot be assassinated—the struggle endures, passed down through generations until liberation.",
    "We launch Midaan today as an artistic and cultural trench to guard our narrative and weave from the pain of loss an unyielding banner. We draw fuel from sorrow, weapons from the word, and barricades from art behind which we stand to defend our identity.",
    "This is Issue Zero—our quiet cry, and our covenant written in the pain of the land. Contemplate this lamentation, read between the lines of loss, and be ready: behind this heavy silence lies a gathering storm that will unfold in Issue One."
  ]
};

export const ARTICLES: Article[] = [
  {
    "id": "art-1",
    "issueId": "issue-zero",
    "categoryAr": "افتتاحية العدد",
    "categoryEn": "Editorial",
    "titleAr": "صراع الأرض والسماء: لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟",
    "titleEn": "Conflict of Earth and Sky: Why the Palestine Cause Cannot Be Understood Apart from Faith",
    "readTimeAr": "٨ دقائق",
    "readTimeEn": "8 min read",
    "excerptAr": "على طاولات المفاوضات الباردة يتحدث الساسة بلغة الأرقام والحدود، لكن على الأرض يتحدث الواقع بلغة جغرافيا العقيدة.",
    "excerptEn": "At cold negotiating tables, politicians speak the language of numbers and borders; on the ground, reality speaks the geography of faith.",
    "pullQuoteAr": "«لا يمكن فهم الصراع الفلسطيني كنزاع حدودي عابر؛ إنه صراع وجودي تتداخل فيه نصوص الكتب المقدسة مع بنادق المشاة.»",
    "pullQuoteEn": "«The Palestinian struggle cannot be reduced to a passing border dispute; it is an existential conflict in which sacred scripture intertwines with infantry rifles.»",
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
      "At cold negotiating tables, politicians speak the language of numbers, land area, population density, and secure borders. They imagine that a pen, paper, and colored maps are enough to divide the land and settle decades of conflict. Yet on the ground—where blood is spilled, homes are demolished, and prayers are whispered beneath the roar of artillery—reality speaks an entirely different language: one that answers not to political geography, but to the geography of faith.",
      "The greatest error an outside observer can make is reducing the Palestinian-Israeli conflict to a mere border dispute or a political disagreement over statehood and resources. The truth is deeper and far more entrenched: an existential struggle where scriptural texts intertwine with infantry rifles, and the accounts of prophets mix with United Nations resolutions.",
      "The Torah as a Roadmap: Faith in the Service of Colonialism. To understand the heart of the conflict, one must examine how the Zionist movement employed religious faith as a tool of settler colonialism. Although Zionism's founding figures were avowedly secular, they recognized early on that their project could never take hold without spiritual mobilization.",
      "Immigrants did not journey from across the globe merely to establish a democratic state; they arrived driven by the narrative of the 'Promised Land' and the notion of a 'Chosen People.' In their hands, biblical verses turned from sacred liturgy into title deeds, and from spiritual prayers into military orders to clear the land and replace its indigenous people with settlers.",
      "'A Verse in the Book': Roots in the Islamic Collective Conscience. Conversely, one cannot understand the steadfastness of the Palestinian people without understanding the religious conviction that sustains it. For Palestinians—and for the Arabs and Muslims who stand behind them—Palestine is not a tract of earth that could be compensated elsewhere. It is not merely a homeland in the modern nationalist sense; it is a verse in the Quran.",
      "The Muslim bond with Palestine is textual, spiritual, and non-negotiable, resting on two pillars:\n• First: The belief in the Night Journey and Ascension (al-Isra wal-Miraj). Al-Aqsa Mosque is not merely a stone sanctuary; it is earth's gateway to heaven, the second mosque ever built, and the first Qibla of Islam.\n• Second: The duty of Ribat (steadfast vigil). In cultural and religious tradition, remaining on this land is understood as continuous guardianship over the frontiers of truth, transforming everyday endurance into an act of worship.",
      "Analytical Comparison: The Dimensions of the Conflict Between Politics and Faith:\n• Nature of the Dispute: Conventional politics treats it as a contest over borders and resources; religious reality recognizes an existential struggle touching identity, sacred texts, and spiritual heritage.\n• Instruments of Resolution: Politics wagers on negotiating tables and compromises; religious reality insists on undivided historical and sacred rights.\n• Engine of Steadfastness: Politics demands civil rights under international law; the living engine is faith, steadfast vigil (Ribat), and the moral duty to safeguard sacred heritage.",
      "The Collapse of Political 'Pragmatism': The dilemma lies in the impossibility of dismantling faith through politics. A politician might concede a percentage of land in exchange for concessions, but how does one surrender sanctities woven into the marrow of human identity?",
      "Israel slides ever further toward the religious far-right; religious Zionism now forms cabinets and shapes wartime decisions around exclusionary biblical prophecies, extinguishing any remaining illusion of pragmatic compromise.",
      "The Palestinian struggle against the occupation is a war of narratives and identity before it is a war of rifles. While Zionism strains history to manufacture artificial legitimacy, the Palestinian narrative stands rooted like an ancient olive tree, drawing its endurance from an unshakable conviction: that justice is never extinguished by the passage of time, and that the land will ultimately speak the language of its rightful people."
    ]
  },
  {
    "id": "art-2",
    "issueId": "issue-zero",
    "categoryAr": "مقال فكري",
    "categoryEn": "Philosophical Essay",
    "titleAr": "سأموت قبل الأربعين",
    "titleEn": "I Will Die Before Forty",
    "readTimeAr": "٧ دقائق",
    "readTimeEn": "7 min read",
    "excerptAr": "عمري الآن واحد وثلاثون عاماً. تسع سنوات فقط تفصلني عن الأربعين وعن النهاية الحتمية لروحي إن استمرت داخل هذه المصفوفة المبرمجة.",
    "excerptEn": "I am thirty-one years old. Just nine years stand between me and forty—and between me and the inevitable death of my spirit if it continues inside this programmed machine.",
    "pullQuoteAr": "«لم أعد أخشى الموت البيولوجي، بل أخشى الموت البطيء: موت الشغف، موت التساؤل، وموت الذات داخل آلة عملاقة ابتلعتنا جميعاً.»",
    "pullQuoteEn": "«I no longer fear biological death; I fear the slow death: the death of passion, the death of inquiry, and the extinction of the self within a monstrous machine that swallowed us whole.»",
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
      "I am thirty-one years old. Just nine years stand between me and forty—and between me and the inevitable death of my spirit if it continues trying to survive inside this programmed matrix. I no longer fear biological death; I fear the slow death: the death of passion, the death of inquiry, and the extinction of the self within a monstrous machine that swallowed us whole from our first cry. A machine they call 'the system.'",
      "The System: The Master Matrix. I was born only to find myself caught in a spiderweb of interlocking systems—pre-set molds you are forced into simply to earn a stamp of approval. I never understood this system, and it never understood me. To it, I am merely a glitch in the code, a gear refusing to turn with the rest because it sees the abyss ahead.",
      "The Patriarchal Order: Deeds of Ownership. The taming began at home. The patriarchal system was never a shelter or a guide; it was a hierarchy that permitted no discussion. They treated us as investment projects or extensions of their own shortcomings, not as autonomous souls. 'Do this because I am older'; 'Choose this path because it honors the family.' I never understood how love turned into conditions, or how blind obedience became the sole measure of devotion. They confiscated my identity before I could discover it, and told me this was 'respect.'",
      "The Educational System: The Guillotine of the Mind. Then they handed me over to the educational system—a factory for identical copies. There I learned my first lessons in hypocrisy: how to memorize what you do not believe in order to pass tests that measure nothing beyond your willingness to conform. They did not teach us to question, but to recite. The system was calibrated to clip the wings of imagination, crush critical thought, and turn us into obedient cogs ready for the labor market. Whoever stepped out of line, whoever asked 'Why?', was punished and branded a failure.",
      "The Social Order: A Theater of the Absurd. I walked out into the street only to collide with the social system—an absurd play staged by master mask-wearers. A society obsessed with appearances, worshipping consumption, and valuing a person by their car brand and bank account. They drew up the catalog: graduate, get a job, take a loan to mortgage your life to the bank, marry to satisfy society, and have children to feed them back into the same meat grinder. Hypocrisy here is no malfunction; it is the motor oil that keeps the machine turning. The honest person is an outcast; the one who differs threatens the sedated herd, and so they fight them fiercely.",
      "The Religious Order: Forbidden Questions. And here we reach the deepest maze: the summit used to justify all that came before—the theological order as they delivered it to us. I never accepted the distorted image of God they peddled: an angry, watchful deity who deals with us in the crude accounting of commercial transactions, as if life were a relentless bargain. Inside me is a longing for something infinitely greater, a cosmic grace, a pure and absolute peace. Yet their interpretations reduced faith to a tool of control, a guard tower to suppress reason and outlaw thought. If you ask: 'Why were we created to suffer in this endless absurdity?', they accuse you of heresy. They do not want you to connect with the Creator; they want you to submit to the version they tailored to protect their authority.",
      "Nine Years Remain: Standing Against the System. At thirty-one, I stand stripped bare of all these systems. I reject them, and they reject me. Being different is no boast; it is a curse I live every single day. Once you see the strings moving the marionettes, you can no longer enjoy the show. I will not live to forty. I will die before then—not because my body will fail, but because the choice has already been made: either I surrender, bow my head, put on the mask, and make peace with the system until whatever remains of my truth and humanity suffocates; or I continue this existential fight, swimming against every current until I burn out with honor. In either case, the man who carries my name today, whose heart beats with truth and defiance, will no longer be here in nine years."
    ]
  },
  {
    "id": "art-3",
    "issueId": "issue-zero",
    "categoryAr": "دراسة فلسفية",
    "categoryEn": "Philosophical Study",
    "titleAr": "حبر اليقين: من مشقة الوداع إلى سكينة الشهادة",
    "titleEn": "Ink of Certainty: From the Agony of Parting to the Serenity of Martyrdom",
    "readTimeAr": "٨ دقائق",
    "readTimeEn": "8 min read",
    "excerptAr": "تُعد كتابة الوصية واحدة من أكثر التجارب الإنسانية عُمقاً وقسوة؛ فكيف يتحول هذا العبء الوجودي الثقيل إلى حالة من السكينة المطلقة واليقين؟",
    "excerptEn": "Writing a final testament is among the most intense and unforgiving human acts; how does this crushing existential weight transform into complete inner peace?",
    "pullQuoteAr": "«القلم عندما يُغمس في حبر اليقين يملك القدرة على هزم الخوف من الموت، وتحويل أصعب كتابة في حياة الإنسان إلى وثيقة للخلود والطمأنينة.»",
    "pullQuoteEn": "«When the pen is dipped in the ink of certainty, it possesses the power to overcome the fear of death, turning humanity's hardest writing into a testament of eternity and peace.»",
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
      "Writing a final will is among the deepest and most unforgiving of human experiences. It is the moment when a person confronts mortality face to face, attempting to distill an entire lifetime—with its emotions, thoughts, and relationships—into a handful of lines. It is a written admission of departure, a raw and desperate effort to build a bridge of words between two worlds. Yet when one reads the wills of martyrs, a remarkable psychological reality emerges: how does this heavy existential burden transform into absolute serenity and peace of mind?",
      "The Agony of the Opening: Facing Ink and the Void. The immense difficulty of writing a will stems from the fact that it requires complete detachment from the instinct of self-preservation. By nature, humans postpone and push aside the thought of death in order to keep living. When a person takes up the pen to write their final words, they shatter that psychological shield, drawing a definitive boundary between the 'now' and the 'hereafter.'",
      "At that moment, an ordinary person experiences anguish and turmoil. Questions rush in: What will I leave behind? How will people remember me? Did I fulfill my promises? It is a reckoning with doubt and potential regret. As the martyr Basil al-Araj candidly expressed at the opening of his testament: 'How difficult it is to write your own will,' laying bare the philosophical and psychological hesitation that precedes the formulation of a farewell.",
      "Psychological Sublimation: How Serenity is Born from Peril. Despite that initial struggle, the final writings of martyrs reveal a remarkable psychological shift that transcends the usual dread humans feel in the face of death. This transformation can be understood through three main dimensions:",
      "1. Resolving Doubt and Finding Answers: Uncertainty is the greatest source of human anxiety. When a martyr chooses their path, they have already settled their deepest existential questions. When Basil al-Araj wrote, 'I march toward my death content and convinced, having found my answers,' he was announcing an inner dawn born of complete harmony between his principles and his actions. This alignment resolves inner conflict, replacing fear with an unyielding calm unbroken by the rattle of weapons.",
      "2. Shedding the Ego and Dissolving into the Cause: In modern psychology, the fear of death is often linked to the fear of losing the ego. Yet the martyr undergoes an act of sublimation, seeing themselves not as mortal flesh, but as an extension of a higher purpose—homeland, freedom, or dignity. When the individual 'I' dissolves into the collective 'we,' death loses its terror, transforming from a tragic end into a spark that breathes life into others, as seen in the will of Oday al-Tamimi, who wrote with clear intent that his aim was to move hundreds of young men to take up the rifle after him.",
      "3. Inverting Fear Through Direct Engagement: Battlefield testaments—such as the final voice messages of Ibrahim al-Nabulsi or Wadee al-Hawah—carry a tone entirely devoid of hesitation or despair. Psychologically, advancing directly into confrontation unleashes a surge of courage and spiritual certainty that drives out fear. The martyr does not await passive death; they march toward destiny with agency and will, and this ownership over their final choice grants them an immense psychological ascendancy over those laying siege to them.",
      "The Legacy of the Testament: Passing the Question to the Living. Ultimately, the martyr's will transforms from a personal farewell into an intellectual and moral catalyst for those who remain. Having attained peace and clarity, the martyr sets down the pen and departs, leaving behind questions for the living to answer. The unspoken words say: 'I found my answer and my heart is at rest; what will you do now?'",
      "The serenity reflected in these texts is not the product of a fleeting emotional moment, but the fruit of deep awareness and absolute reconciliation with the self. These words prove that the pen, when dipped in the ink of certainty, possesses the power to overcome the fear of death, turning humanity's most difficult writing into a testament of eternity and peace."
    ]
  },
  {
    "id": "art-4",
    "issueId": "issue-zero",
    "categoryAr": "أرشيف وتوثيق",
    "categoryEn": "Historical Registry",
    "titleAr": "سجل وصايا الشهداء الفلسطينيين",
    "titleEn": "Register of Palestinian Martyrs' Wills",
    "readTimeAr": "١٠ دقائق",
    "readTimeEn": "10 min read",
    "excerptAr": "وثيقة فكرية وتاريخية تجمع أبرز وصايا الشهداء الفلسطينيين التي شكلت محطات فارقة في الوعي الجمعي والاشتباك الميداني.",
    "excerptEn": "An intellectual and historical record compiling foundational testaments of Palestinian martyrs that marked turning points in collective consciousness.",
    "pullQuoteAr": "«تنوعت بين التأصيل الثقافي والرسائل الميدانية العفوية تحت النيران، لتشكل سجلاً خالداً في الوجدان الوطني.»",
    "pullQuoteEn": "«Ranging from cultural theory to spontaneous battlefield dispatches under fire, constituting an enduring record in the national consciousness.»",
    "contentAr": [
      "وثيقة فكرية وتاريخية تجمع أبرز وصايا الشهداء الفلسطينيين التي شكلت محطات فارقة في الوعي الجمعي، وتنوعت بين التأصيل الثقافي الثوري والرسائل الميدانية العفوية تحت النيران.",
      "جدول تعريفي بالوصايا المدرجة في السجل الأرشيفي:\n• 1. باسل الأعرج (2017) — فكرية / ثقافية ثورية.\n• 2. بهاء عليان (2015) — الوصايا العشر (مختارات اجتماعية وفكرية).\n• 3. دلال المغربي (1978) — سياسية وعسكرية استراتيجية.\n• 4. تامر الكيلاني (2022) — تنظيمية وروحية.\n• 5. إبراهيم النابلسي (2022) — ميدانية (تسجيل صوتي تحت الحصار).\n• 6. عدي التميمي (2022) — ميدانية مكتوبة (أثناء المطاردة والاشتباك).\n• 7. يحيى عياش (1996) — مقولات ومنهج اشتباك.\n• 8. وديع الحوح (2022) — ميدانية (عبر اللاسلكي العسكري).\n• 9. غسان كنفاني (1972) — أدبية وفلسفية مستخلصة.",
      "القسم الأول: الوصايا الفكرية والسياسية (وثائق الوعي الجمعي):",
      "1. وصية الشهيد المثقف باسل الأعرج (2017):\n«تحية العروبة والوطن والتحرير، أما بعد، فإن كنتم تقرؤون هذا فهذا يعني أني قد مت، وقد صعدت الروح إلى خالقها، وأدعو الله أن ألاقيه بقلب سليم مقبل غير مدبر بإخلاص بلا ذرة رياء.\nلكم من الصعب أن تكتب وصيتك، ومنذ سنين انقضت وأنا أتأمل كل وصايا الشهداء وتلك الحيرة كانت تفاجئني دائماً: مختصر مفيد دون إطالة. لماذا نكتب وصايانا؟ هل نكتبها لنرسم طريقاً لمن بعدنا أم نكتبها لتكون ملحمة شخصية، أم نكتبها كإعلان براءة من ذنب تركناه خلفنا؟\nأنا الآن أسير إلى حتفي راضياً مقتنعاً، وجدت أجوبتي، يا ويلي ما أحمقني، وهل هناك ما هو أكثر بلاغة وأفصح من فعل الشهيد؟ وكان من المفروض أن أكتب هذا قبل شهور طويلة إلا أن ما أقعدني عن هذا هو أن هذا سؤالكم أنتم الأحياء، فلماذا أجيب أنا عنكم؟ فلتبحثوا أنتم، أما نحن أهل القبور فلا نبحث إلا عن رحمة الله.»",
      "2. مختارات من الوصايا العشر للشهيد بهاء عليان (2015):\n• أوصي الفصائل بعدم تبني شهادتي، فموتي كان للوطن وليس لكم.\n• أوصي بعدم طباعة البوسترات لي، فذاكرتكم أضعف من أن تبقيها، والجدران أقبح من أن تزينوها.\n• أوصي الأهالي بألا يحزنوا، بل يزغردوا، فلا تبكوا عليّ بل ابكوا على أنفسكم.\n• أوصي الصحفيين بألا يصوروا جثتي، فهذا يؤذي أمي.\n• أوصي ألا يكتبوا على قبري أي شعار أو اسم فصيل، بل يُكتب: هذا قبر الشهيد بهاء عليان.",
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
      "An intellectual and historical record bringing together foundational testaments of Palestinian martyrs that marked turning points in collective consciousness, spanning revolutionary thought and spontaneous frontline messages under fire.",
      "Index of Documented Testaments:\n• 1. Basil al-Araj (2017) — Revolutionary thought and cultural theory.\n• 2. Baha Alyan (2015) — The Ten Wills (Selected Civic & Social Excerpts).\n• 3. Dalal al-Mughrabi (1978) — Strategic political and military imperative.\n• 4. Tamer al-Kilani (2022) — Organizational discipline and spiritual resolve.\n• 5. Ibrahim al-Nabulsi (2022) — Battlefield audio dispatch under siege.\n• 6. Oday al-Tamimi (2022) — Handwritten field message during active manhunt.\n• 7. Yahya Ayyash (1996) — Resistance doctrine and strategic methodology.\n• 8. Wadee al-Hawah (2022) — Tactical transmission over military radio.\n• 9. Ghassan Kanafani (1972) — Distilled literary and philosophical reflections.",
      "Part One: Intellectual and Political Testaments (Charters of Collective Consciousness):",
      "1. Testament of the Intellectual Martyr Basil al-Araj (2017):\n'Greetings of Arab dignity, homeland, and liberation. If you are reading this, it means I have died and my soul has ascended to its Creator. I pray to meet Him with a sound heart, advancing without retreating, in sincerity without a shred of hypocrisy.\nHow difficult it is to write your own will. For years I have reflected on the wills of martyrs, and that familiar question always surprised me: brief and purposeful, without excess. Why do we write our wills? Do we write them to illuminate a path for those after us, or as a personal epic, or as an acquittal from guilt left behind?\nI now walk toward my death content and convinced; I have found my answers. How foolish I was—is there anything more eloquent than the deed of a martyr? I should have written this months ago, but what stayed my hand was knowing that this is a question for you, the living. Why should I answer on your behalf? Search for yourselves. As for us in the grave, we seek nothing save God\\'s mercy.'",
      "2. Excerpts from the Ten Wills of Martyr Baha Alyan (2015):\n• I ask the factions not to claim my martyrdom; my death was for the homeland, not for you.\n• I ask that no posters be printed for me; your memory is too short to keep them, and walls are too bleak to be adorned.\n• I ask my family not to mourn, but to ululate; weep not for me, but weep for yourselves.\n• I ask journalists not to photograph my body, for that hurts my mother.\n• I ask that no factional emblem or slogan be written on my grave; let it simply read: Here lies the martyr Baha Alyan.",
      "3. Testament of Martyr Dalal al-Mughrabi (1978):\n'My will to all of you, comrades bearing arms: continue the struggle. I ask you to unite in a single line, directing your rifles toward the Zionist enemy. The independence of the Palestinian will cannot be realized except through an independent rifle.'",
      "4. Testament of Martyr Tamer al-Kilani (2022):\n'I ask you not to weep for me, but to rejoice with pride. I ask you never to publish any photo of me without my face covered, lest it be taken as vanity. And I ask that the sword in my room be placed upon my grave.'",
      "Part Two: Battlefield Testaments (Messages of the Final Hours):",
      "5. Message of Martyr Ibrahim al-Nabulsi (2022):\n'I have been martyred, my people... I love my mother dearly. By all you hold sacred, never let go of the rifle. I am surrounded and going to be martyred; pray for me.'",
      "6. Message of Martyr Oday al-Tamimi (2022):\n'I am the fighter Oday al-Tamimi, who carried out the Shuafat operation. I know that my operation will not liberate Palestine, but I carried it out knowing that its main goal is to move hundreds of young men to take up the rifle after me.'",
      "7. Maxim of Martyr Yahya Ayyash (1996):\n'The occupiers can uproot my body from Palestine, but they will never uproot the idea from the minds and hearts of our youth. The battle has not ended, and it will not end until the occupation is gone.'",
      "8. Message of Martyr Wadee al-Hawah (2022):\n'Do not surrender... Strike them from every side. Let no one throw down their weapon. We are projects of martyrdom, my brothers; let no one grieve for us. Keep going; there are men standing behind you.'",
      "Part Three: Literary and Philosophical Testaments Inspired by the Cause:",
      "9. Philosophical Vision of Ghassan Kanafani (Distilled Legacy):\n• On death: 'The question of death is not at all the concern of the dead; it is the concern of the living, waiting bitterly for their turn.'\n• On silence: 'Why didn\\'t you knock on the walls of the tank? Why didn\\'t you speak? Why?'\n• On Gaza and remaining: 'No, my friend, I will not come to you. I will stay here and never leave. I discover myself in Gaza; these blood-stained files are the only things that give life meaning.'"
    ]
  }
];

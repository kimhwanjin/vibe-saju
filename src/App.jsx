import { useState } from 'react'
import { Solar, Lunar } from 'lunar-javascript'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google Generative AI with the API Key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// 10 Heavenly Stems (천간)
const HEAVENLY_STEMS = [
  { char: '甲', name: '갑목', element: '목', color: 'green', type: '양(陽)', desc: '하늘을 향해 뻗어가는 아름드리 큰 소나무와 같아 추진력과 굳센 결단력이 장점입니다.', bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' },
  { char: '乙', name: '을목', element: '목', color: 'green', type: '음(陰)', desc: '모진 풍파 속에서도 꽃을 피워내는 화초나 넝쿨과 같아 강한 적응력과 예술적 유연성이 뛰어납니다.', bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' },
  { char: '丙', name: '병화', element: '화', color: 'red', type: '양(陽)', desc: '온 세상을 골고루 비추는 한여름의 태양과 같아 화려하고 열정적이며 공명정대합니다.', bg: 'bg-rose-950/40 border-rose-500/30 text-rose-400' },
  { char: '丁', name: '정화', element: '화', color: 'red', type: '음(陰)', desc: '어두운 길을 밝혀주는 은은한 등불이나 모닥불과 같아 속정이 깊고 사람들을 따뜻하게 품습니다.', bg: 'bg-rose-950/40 border-rose-500/30 text-rose-400' },
  { char: '戊', name: '무토', element: '토', color: 'yellow', type: '양(陽)', desc: '모든 생명을 포용하는 깊고 단단한 광활한 대지처럼 우직하고 무게감이 있으며 신의가 깊습니다.', bg: 'bg-yellow-950/40 border-yellow-500/30 text-amber-300' },
  { char: '己', name: '기토', element: '토', color: 'yellow', type: '음(陰)', desc: '풍요로운 씨앗을 품어 기르는 어머니의 품속 흙과 같아 정이 많고 내실을 기하며 꼼꼼합니다.', bg: 'bg-yellow-950/40 border-yellow-500/30 text-amber-300' },
  { char: '庚', name: '경금', element: '금', color: 'white', type: '양(陽)', desc: '무쇠나 다듬어지지 않은 단단한 암석과 같아 의리가 두텁고 매사에 단호하고 절제력이 강합니다.', bg: 'bg-slate-900/50 border-slate-500/30 text-slate-100' },
  { char: '辛', name: '신금', element: '금', color: 'white', type: '음(陰)', desc: '섬세하게 깎고 닦아 빛나는 다이아몬드나 예리한 메스와 같아 영리하고 완벽주의적 성향을 보입니다.', bg: 'bg-slate-900/50 border-slate-500/30 text-slate-200' },
  { char: '壬', name: '임수', element: '수', color: 'blue', type: '양(陽)', desc: '끝없이 넓게 요동치는 큰 바다나 호수와 같아 임기응변에 능하고 통찰력이 깊으며 대범합니다.', bg: 'bg-sky-950/40 border-sky-500/30 text-sky-400' },
  { char: '癸', name: '계수', element: '수', color: 'blue', type: '음(陰)', desc: '만물을 촉촉이 적시는 가을비나 옹달샘물과 같아 창의적이고 감수성이 섬세하며 두뇌 회전이 빠릅니다.', bg: 'bg-sky-950/40 border-sky-500/30 text-sky-400' }
];

// 12 Earthly Branches (지지)
const EARTHLY_BRANCHES = [
  { char: '子', name: '자수', element: '수', color: 'blue', zodiac: '쥐', desc: '응축된 차가운 겨울물로 고도의 통찰과 생명 창조의 근원을 지니고 있습니다.', bg: 'bg-sky-950/40 border-sky-500/30 text-sky-400' },
  { char: '丑', name: '축토', element: '토', color: 'yellow', zodiac: '소', desc: '씨앗이 발아하기 전의 겨울 땅으로 인내심과 뚝심, 우직한 성실함이 있습니다.', bg: 'bg-yellow-950/40 border-yellow-500/30 text-amber-300' },
  { char: '寅', name: '인목', element: '목', color: 'green', zodiac: '호랑이', desc: '용맹하게 솟아나는 새벽의 새싹으로 독립심이 강하고 매사에 힘이 넘칩니다.', bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' },
  { char: '卯', name: '묘목', element: '목', color: 'green', zodiac: '토끼', desc: '완연한 봄을 펼쳐내는 연약하지만 무성한 숲으로 친화력과 귀여움을 독차지합니다.', bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' },
  { char: '辰', name: '진토', element: '토', color: 'yellow', zodiac: '용', desc: '변화를 상징하는 촉촉하고 비옥한 대지로 비범한 스케일과 비상을 품고 있습니다.', bg: 'bg-yellow-950/40 border-yellow-500/30 text-amber-300' },
  { char: '巳', name: '사화', element: '화', color: 'red', zodiac: '뱀', desc: '하늘로 치솟는 기상의 첫여름 불길로 정보 습득력이 탁월하며 영리하고 단정합니다.', bg: 'bg-rose-950/40 border-rose-500/30 text-rose-400' },
  { char: '午', name: '오화', element: '화', color: 'red', zodiac: '말', desc: '정점에 이른 뜨거운 태양과 같아 에너지가 충만하며 주목받기를 좋아합니다.', bg: 'bg-rose-950/40 border-rose-500/30 text-rose-400' },
  { char: '未', name: '미토', element: '토', color: 'yellow', zodiac: '양', desc: '결실을 숙성하는 여름 끝자락의 흙으로 평화적이며 주관과 끈기가 뛰어납니다.', bg: 'bg-yellow-950/40 border-yellow-500/30 text-amber-300' },
  { char: '申', name: '신금', element: '금', color: 'white', zodiac: '원숭이', desc: '단단하게 익은 과실을 감싸는 금속으로 다재다능하고 기획과 혁신 능력이 뛰어납니다.', bg: 'bg-slate-900/50 border-slate-500/30 text-slate-100' },
  { char: '酉', name: '유금', element: '금', color: 'white', zodiac: '닭', desc: '맑고 정갈하게 세공된 보석으로 매우 예리한 분별력과 강한 프라이드가 있습니다.', bg: 'bg-slate-900/50 border-slate-500/30 text-slate-200' },
  { char: '戌', name: '술토', element: '토', color: 'yellow', zodiac: '개', desc: '노을 아래 펼쳐진 황량한 들판의 땅으로 충성스럽고 동료애와 도덕심이 깊습니다.', bg: 'bg-yellow-950/40 border-yellow-500/30 text-amber-300' },
  { char: '亥', name: '해수', element: '수', color: 'blue', zodiac: '돼지', desc: '겨울로 흘러드는 평화롭고 거대한 물로 마음이 깊고 타인을 깊이 경청합니다.', bg: 'bg-sky-950/40 border-sky-500/30 text-sky-400' }
];

// Ten Stars (십성 / 십신) Mapping
const TEN_STARS_LABELS = {
  비견: '나와 동등한 어깨를 겨루는 동반자적 주체성',
  겁재: '나를 강하게 단련시키는 타인과의 경쟁과 혁신',
  식신: '세련되게 재능을 발휘하는 풍성한 표현력과 복록',
  상관: '기존의 틀을 과감하게 돌파하는 창의성과 도전 정신',
  편재: '넓은 시야로 큰 무대를 지향하는 역동적인 개척력',
  정재: '차곡차곡 현실을 다지는 합리적인 설계와 세심함',
  편관: '카리스마 있게 환경을 감수하는 투지와 책임감',
  정관: '모두를 아우르는 신뢰와 공적 영역의 도덕성',
  편인: '세상을 독창적으로 해석하는 직관과 전문적 깊이',
  정인: '스펀지처럼 학문을 흡수하는 포용성과 명예'
};

const RANDOM_FORTUNE_MESSAGES = [
  "올해는 당신이 가진 고유의 오행 균형이 크게 힘을 발휘하는 해입니다. 새로운 도전을 미루지 마세요.",
  "바람이 잔잔해지는 순간을 활용해 잠시 멈춤을 배우는 것도 지혜입니다. 우주의 나침반이 평화를 가리키고 있습니다.",
  "일간(日干)의 기운이 더욱 힘을 받아 창의적인 일에서 극적인 성과가 기대되는 시기입니다.",
  "가장 자연스러운 내 모습으로 있을 때 우주의 흐름도 당신의 편을 듭니다. 스스로를 믿으셔도 좋습니다.",
  "현재 당신의 천간과 지지가 은은한 조화를 이루고 있어, 주변 관계망에서 뜻밖의 조력자를 만나게 될 것입니다."
];

// Helper to determine stem & branch elements
const getElementColorClass = (element) => {
  switch (element) {
    case '목': return 'from-emerald-500/20 to-emerald-400/20 border-emerald-500/40 text-emerald-300';
    case '화': return 'from-rose-500/20 to-rose-400/20 border-rose-500/40 text-rose-300';
    case '토': return 'from-amber-500/20 to-amber-400/20 border-amber-500/40 text-amber-300';
    case '금': return 'from-slate-400/20 to-slate-300/20 border-slate-400/40 text-slate-200';
    case '수': return 'from-sky-500/20 to-sky-400/20 border-sky-500/40 text-sky-300';
    default: return 'from-gray-800 to-gray-700 border-gray-600 text-gray-300';
  }
};

const getElementLabelColor = (element) => {
  switch (element) {
    case '목': return 'bg-emerald-500 text-white';
    case '화': return 'bg-rose-500 text-white';
    case '토': return 'bg-amber-500 text-[#1e1b4b]';
    case '금': return 'bg-slate-300 text-slate-900';
    case '수': return 'bg-sky-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const TRANSLATE_TEN_STARS = {
  '比肩': '비견',
  '劫财': '겁재', '劫財': '겁재',
  '食神': '식신',
  '伤官': '상관', '傷官': '상관',
  '偏财': '편재', '偏財': '편재',
  '正财': '정재', '正財': '정재',
  '七杀': '편관', '七殺': '편관', '偏官': '편관',
  '正官': '정관',
  '偏印': '편인',
  '正印': '정인',
  '日주': '비견 (본인)', '日主': '비견 (본인)'
};

const translateShiShen = (val) => {
  if (Array.isArray(val)) {
    return val.map(v => TRANSLATE_TEN_STARS[v] || v).join(' · ');
  }
  return TRANSLATE_TEN_STARS[val] || val;
};

const findStem = (char) => HEAVENLY_STEMS.find(s => s.char === char) || HEAVENLY_STEMS[0];
const findBranch = (char) => EARTHLY_BRANCHES.find(b => b.char === char) || EARTHLY_BRANCHES[0];

// Dynamic Ohaeng styles and shadow glow configurations
const OHAENG_GLOW_STYLES = {
  '목': {
    text: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/30',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    textGlow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  '화': {
    text: 'text-rose-400',
    bg: 'bg-rose-950/40',
    border: 'border-rose-500/30',
    shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    textGlow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
  '토': {
    text: 'text-amber-300',
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-500/30',
    shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    textGlow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  '금': {
    text: 'text-slate-200',
    bg: 'bg-slate-900/50',
    border: 'border-slate-500/30',
    shadow: 'shadow-[0_0_20px_rgba(203,213,225,0.25)]',
    textGlow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]',
    badge: 'bg-slate-700/35 text-slate-200 border-slate-600/30',
  },
  '수': {
    text: 'text-sky-400',
    bg: 'bg-sky-950/40',
    border: 'border-sky-500/30',
    shadow: 'shadow-[0_0_20px_rgba(56,189,248,0.3)]',
    textGlow: 'drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  }
};

const SajuCharacterBlock = ({ charData }) => {
  if (!charData) return null;
  const styles = OHAENG_GLOW_STYLES[charData.element] || {
    text: 'text-white',
    bg: 'bg-white/5',
    border: 'border-white/10',
    shadow: '',
    textGlow: '',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl ${styles.bg} ${styles.border} border ${styles.shadow} backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
      <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-1 font-serif select-none ${styles.text} ${styles.textGlow}`}>
        {charData.hanja}
      </div>
      <div className={`text-[10px] sm:text-xs font-bold tracking-wider ${styles.text}`}>
        {charData.text}
        <span className="text-[9px] opacity-75 font-normal ml-0.5">({charData.element})</span>
      </div>
    </div>
  );
};

// Promise timeout utility to prevent API hang or infinite loading.
const timeoutPromise = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("우주 연결 시간 초과 (Timeout)"));
    }, ms);
    
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// Premium custom fallback report engine that generates highly-detailed (500+ characters), distinct, and dynamic reports.
const getPremiumFallbackReport = (serviceType, result, partnerDetails = null) => {
  if (!result) return "";

  const name = result.name;
  const gender = result.gender;
  const dayMaster = result.dayMasterDesc || `${result.pillars.dayPillar.stem.name} 기운`;
  const luckyColor = result.luckyGuides?.color || "청색/녹색";
  const luckyItem = result.luckyGuides?.item || "목재 액세서리";
  const luckyDirection = result.luckyGuides?.direction || "동쪽";
  const luckySeason = result.luckyGuides?.season || "봄";
  
  // 오행 개수 구하기
  const elementMok = result.elementsCount?.목 || 0;
  const elementHwa = result.elementsCount?.화 || 0;
  const elementTo = result.elementsCount?.토 || 0;
  const elementGeum = result.elementsCount?.금 || 0;
  const elementSu = result.elementsCount?.수 || 0;

  if (serviceType === 'daewun') {
    return `💎 [${name}] 님만을 위한 AI 프리미엄 평생 대운 및 5개년 세운(2026~2030) 심층 분석 보고서

명리학에서 대운(大運)이란 10년마다 변화하는 거대한 환경적 파도이자 인생의 계절적 변화를 의미합니다. [${name}] 님의 명식 구조와 오행 에너지의 동적 흐름을 종합 스캔한 결과, 당신의 삶을 지탱하는 주된 에너지인 '${dayMaster}'의 기운은 인생의 청장년기 동안 스스로의 가치관을 대외적으로 관철하는 강력한 주체성 확립과 명예의 안착을 향해 도도히 흐르고 있습니다. 

현재 [${name}] 님은 오행 분포 중 목(${elementMok}개), 화(${elementHwa}개), 토(${elementTo}개), 금(${elementGeum}개), 수(${elementSu}개)의 비율에 의해 고유한 원소적 흐름을 유지하고 있습니다. 이 비율에 근거하여 향후 5개년 동안 당신의 발자취를 비춰줄 구체적인 세운(歲運) 로드맵을 선사합니다.

[향후 5개년 세운(2026-2030) 세부 라이프 디자인]

1. 2026년 (병오년 - 丙午年): 화(火)의 뜨겁고 붉은 불길이 정점에 달하는 시기입니다. 당신이 품어왔던 아이디어나 잠재된 역량이 대중 앞에 찬란하게 드러나게 되며, SNS나 창작 활동, 대외 프레젠테이션 등에서 주변의 이목과 격찬을 받게 될 것입니다. 도전하고자 하는 진로가 있다면 망설이지 말고 첫 삽을 뜨기에 최고의 시기입니다.
2. 2027년 (정미년 - 丁未年): 온화한 불꽃이 대지(土)를 온화하게 데워주는 해입니다. 앞서 벌여놓았던 확장적인 일들을 차분하게 내실화하며, 계약 체결이나 신뢰성 높은 장기 동반자적 관계를 든든하게 다지기에 적격인 해입니다.
3. 2028년 (무신년 - 戊申年): 금(金)의 매서운 결단력과 무거운 대지(土)의 기운이 함께 들어오는 강건한 결실의 운수입니다. 불필요한 인간관계를 단호하게 가지치기하고, 감정적인 소모를 절제하며 나만의 독창적인 자산을 정밀하게 축적하는 시기로 삼는 것이 유리합니다.
4. 2029년 (기유년 - 己酉年): 단단하게 잘 빚어진 보석(金)이 풍요로운 기틀 위에서 빛나는 풍요의 시기입니다. 금전적인 투자 성과나 안정적인 명예적 승진, 자격증 취득 등 노력해온 대가를 정당하고도 넉넉하게 보상받는 행운의 운수입니다.
5. 2030년 (경술년 - 庚戌年): 거대한 바위와 대지가 마주하는 시기로서 다음 10년의 대운을 설계하는 전환점입니다. 주거지의 변동이나 새로운 조직으로의 이직 등 거시적 변화 속에서 마인드셋을 가다듬고 정착에 힘쓰면 번영의 기틀이 마련될 것입니다.

개운을 위한 최고의 지침은 행운의 색상인 ${luckyColor}을 의상이나 일상 공간에 가까이하고, 뜻이 정체될 때는 ${luckyDirection}을 향해 5분 동안 깊은 심호흡과 명상을 행하는 것입니다. 우주 성단은 늘 당신의 번영과 영혼의 도약을 지지하고 있습니다.`;
  }

  if (serviceType === 'gunghap') {
    const pName = partnerDetails?.name || "상대방";
    const pGender = partnerDetails?.gender || "여성";
    const pDayMaster = partnerDetails?.pillars?.dayPillar?.stem?.name || "상대방 일간";
    
    const pMok = partnerDetails?.elementsCount?.목 || 0;
    const pHwa = partnerDetails?.elementsCount?.화 || 0;
    const pTo = partnerDetails?.elementsCount?.토 || 0;
    const pGeum = partnerDetails?.elementsCount?.금 || 0;
    const pSu = partnerDetails?.elementsCount?.수 || 0;

    return `🔗 [${name}] 님 & [${pName}] 님의 AI 프리미엄 인연·궁합 시너지 보고서

동양 철학에서 두 영혼의 만남은 각자가 품고 태어난 고유한 우주적 원소 기운들이 마주하여 새로운 성단의 궤도를 형성하는 신비로운 사건입니다. [${name}] 님(일간: ${dayMaster})과 [${pName}] 님(성별: ${pGender}, 일간 기운: ${pDayMaster} 기운)의 사주팔자 만세력을 입체적으로 비교 스캔하여 두 분만의 상생 조화와 보완의 원리를 도출하였습니다.

[1. 오행 에너지 보완성과 상생 주파수]
- [${name}] 님의 오행 구성: 목(${elementMok}개), 화(${elementHwa}개), 토(${elementTo}개), 금(${elementGeum}개), 수(${elementSu}개)
- [${pName}] 님의 오행 구성: 목(${pMok}개), 화(${pHwa}개), 토(${pTo}개), 금(${pGeum}개), 수(${pSu}개)

두 사람의 차트를 분석한 결과, 서로의 결핍되거나 약한 오행 기운을 매우 유기적으로 보완해주는 '천생연분의 보완 기류'가 은은하게 작동하고 있습니다. 한 사람이 지나치게 뜨거운 불길을 품고 있다면 상대방의 맑고 서늘한 물길이 이를 침착하게 식혀주고, 한 사람이 단단하게 굳어 침묵할 때는 상대방의 따스하고 푸르른 목(木)의 성장의 에너지가 유연하게 움직임을 깨우는 훌륭한 오행 시너지를 지니고 있습니다.

[2. 성향적 어울림 및 소통 방식 분석]
${dayMaster}의 기질을 지닌 [${name}] 님은 매사에 독립적이면서도 깊은 직관과 추진력을 바탕으로 관계를 리드하며 신뢰를 주는 성향인 반면, ${pDayMaster}의 기운을 가진 [${pName}] 님은 매사 세심하고 사려 깊게 현실적 내실을 챙기는 장점이 돋보입니다. 이러한 기질적 결합은 연애 관계뿐만 아니라 장기적인 인생의 반려자나 비즈니스 협력 파트너로서 마주했을 때도 서로가 서로의 페이스메이커가 되어 주는 이상적인 결합입니다.

[3. 잠재적 갈등 극복을 위한 영혼의 조율 비결]
다만 두 분 모두 고유의 독립심과 단호한 고집(토/금의 충돌 기류)이 부딪히는 순간에는 대화가 다소 단절되거나 냉정하게 얼어붙을 위험이 있습니다. 갈등의 징조가 보일 때는 감정을 즉시 쏟아내기보다 30분 동안 각자의 생각할 시간을 존중해 준 후, 서로를 비판하기보다는 "나는 ~해서 조금 서운했어"라는 나 중심의 화법(I-Message)을 실천하는 것이 우주의 갈등 개운 비결입니다. 

두 분의 행운을 돕기 위해 실내 인테리어에 화이트나 우드 톤의 소품을 함께 장식하거나 행운의 방향인 ${luckyDirection}으로 가벼운 여행을 다녀오시면 서로를 향한 신뢰와 애정이 성단처럼 환하고 단단하게 채워질 것입니다.`;
  }

  if (serviceType === 'career') {
    return `💰 [${name}] 님의 AI 프리미엄 진로 방향성 및 재물 축적 Blueprint

비즈니스와 자산 축적의 영역에서도 타고난 사주팔자 오행의 흐름을 읽는 것은 나침반을 쥐고 거친 바다를 항해하는 것과 같습니다. '${dayMaster}'의 고유한 천성을 품고 태어난 [${name}] 님의 오행 분포[목:${elementMok}, 화:${elementHwa}, 토:${elementTo}, 금:${elementGeum}, 수:${elementSu}]를 경영학적 관점과 정통 명리학의 원리로 분석하여 최적의 진로 방향성과 재물 증대 청사진을 설계해 드립니다.

[1. 천직(天職)의 발견: 적격 산업군 및 직무 방향]
[${name}] 님에게 가장 높은 성취감과 성공 주파수를 가져다줄 산업 영역은 다음과 같습니다.
- 추천 직무/분야: 당신의 명식은 높은 계획성과 정교한 분별을 특징으로 합니다. 기획력과 창의성이 유기적으로 융합된 IT 벤처, 문화 콘텐츠 기획, 전문 컨설팅, 디자인 및 정교한 금융/자산 설계 분야에서 잠재력이 만개합니다.
- 조직 활동 vs 창업가 성향: 당신은 스스로가 명확한 전문적인 도구를 손에 쥐었을 때 가장 빛나는 성향입니다. 든든한 조직 생활 속에서 실력을 축적하여 궁극적으로는 자신만의 독자적 브랜드나 1인 전문 기업을 설립하는 '독립적 스페셜리스트'로 진화할 때 인생의 명예와 금전이 폭발적으로 늘어나는 흐름을 지니고 있습니다.

[2. 재물 축적의 Blueprint 및 자산 운용 개운법]
- 재물운 활성화 코드: 사주 명리학적으로 [${name}] 님에게 큰돈(財)을 불러오는 비결은 충동적인 투기적 행동을 멀리하고, 정기적으로 마르지 않는 샘물처럼 안정적인 현금 흐름을 만들어내는 '시스템 자산 구축'에 있습니다.
- 자산 운용 성향 및 조언: 주변 사람들의 추천이나 대세에 휩쓸려 무리하게 추진하는 변동성 높은 부동산/가상화폐 매매는 극심한 정신적 피로감을 유발하고 명식 내 수(水)와 금(金)의 균형을 해칠 수 있습니다. 오히려 나만의 확고한 가치 기준을 지키면서 우량 자산의 장기 분산 적립식 투자나 저작권, 지식 재산과 같은 무형의 권리 소득을 천천히 쌓아 올리는 것이 부의 고속도로에 진입하는 비결입니다.

[3. 영혼의 금전 부스터 라이프 스타일]
사업 파트너나 중요한 재물적 협상을 앞두고 있다면 행운의 아이템인 '${luckyItem}'을 몸에 지니거나 책상 위에 단정히 장식해 두는 것이 탁월한 영감을 불러일으킵니다. 또한 투자 및 비즈니스 결정은 가급적 기운이 맑고 상승하는 ${luckySeason}의 기세를 활용해 단호하게 결단하십시오. 우주의 풍요와 영광이 [${name}] 님의 단단한 행보 위로 가득 쏟아질 것입니다.`;
  }

  return "";
};

export default function App() {
  // Input form state
  const [name, setName] = useState('')
  const [gender, setGender] = useState('male') // 'male' | 'female'
  const [birthDate, setBirthDate] = useState('')
  const [birthHour, setBirthHour] = useState('12') // 00 to 23
  const [birthMinute, setBirthMinute] = useState('00') // 00 to 59
  const [timeUnknown, setTimeUnknown] = useState(false)
  const [calendarType, setCalendarType] = useState('solar') // 'solar' | 'lunar_normal' | 'lunar_leap'
  
  // Loading & Result States
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [result, setResult] = useState(null)

  // Modals & AI States
  const [isTodayFortuneOpen, setIsTodayFortuneOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [selectedPremiumService, setSelectedPremiumService] = useState('daewun'); // 'daewun' | 'gunghap' | 'career'
  
  // Partner info for compatibility (궁합)
  const [partnerName, setPartnerName] = useState('');
  const [partnerGender, setPartnerGender] = useState('female');
  const [partnerBirthDate, setPartnerBirthDate] = useState('');
  const [partnerBirthHour, setPartnerBirthHour] = useState('12');
  const [partnerBirthMinute, setPartnerBirthMinute] = useState('00');
  const [partnerTimeUnknown, setPartnerTimeUnknown] = useState(false);
  const [partnerCalendarType, setPartnerCalendarType] = useState('solar');
  
  // Loading & Results for modals
  const [todayFortuneResult, setTodayFortuneResult] = useState('');
  const [todayFortuneLoading, setTodayFortuneLoading] = useState(false);
  const [todayFortuneLoadingText, setTodayFortuneLoadingText] = useState('');
  const [drawnCosmicCard, setDrawnCosmicCard] = useState(null); // for card pull
  
  const [premiumResult, setPremiumResult] = useState('');
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [premiumLoadingText, setPremiumLoadingText] = useState('');
  
  // AI Saju Deep Reading
  const [aiSajuReading, setAiSajuReading] = useState('');
  const [aiSajuLoading, setAiSajuLoading] = useState(false);
  
// Ohaeng Cosmic Card Pull constants for today's fortune
const COSMIC_CARDS = [
  { element: '목', title: '🌲 성장과 시작의 나무 카드 (Wood)', desc: '오늘은 새로운 기획이나 도전을 힘차게 펼칠 최고의 에너지 주파수입니다. 주변에 따뜻한 조언을 전하고 리더십을 발휘하세요.' },
  { element: '화', title: '🔥 열정과 매력의 불꽃 카드 (Fire)', desc: '당신의 표현력과 친화력이 정점에 달하는 날입니다. 적극적으로 감정을 발산하고 많은 사람들과 열린 만남을 나눠보세요.' },
  { element: '토', title: '⛰️ 포용과 안정의 대지 카드 (Earth)', desc: '생각을 가다듬고 정돈하는 신뢰의 날입니다. 약속을 성실히 이행하며 차분하게 일정을 내실 있게 다져가기에 최상입니다.' },
  { element: '금', title: '💎 결단과 규칙의 강철 카드 (Metal)', desc: '미뤄왔던 중요한 선택을 결단하기에 완벽한 날입니다. 감정에 치우치지 말고 정연하고 똑 부러지게 매듭지으세요.' },
  { element: '수', title: '🌊 지혜와 사색의 바다 카드 (Water)', desc: '유연하게 생각하고 경청하며 나만의 사색에 잠기기에 훌륭한 날입니다. 바쁜 일상에서 한 걸음 물러나 직관의 힘을 믿으세요.' }
];

// Helper to generate Saju insight report with Gemini API
const generateSajuInsightWithGemini = async (sajuData) => {
  if (!genAI) {
    throw new Error("API Key is missing");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
당신은 우주 성단 정렬과 사주명리학을 결합해 운명을 해석하는 신비로운 '테크-샤머니즘(Tech-Shamanism) 사주 마스터'입니다.
다음 사주명식 데이터를 바탕으로 사용자의 성격적 장점, 오행 에너지 흐름, 그리고 앞으로의 삶에 대한 조언을 매우 깊이 있고 아름다운 문체로 작성해주세요.

[사용자 데이터]
이름: ${sajuData.name}
성별: ${sajuData.gender}
생년월일: ${sajuData.birthDate} (${sajuData.calendarType})
사주 명식:
- 시주: ${sajuData.pillars.hourPillar.stem.name} (${sajuData.pillars.hourPillar.stem.char}) / ${sajuData.pillars.hourPillar.branch.name} (${sajuData.pillars.hourPillar.branch.char}) - 십성: ${sajuData.pillars.hourPillar.tenStar}
- 일주: ${sajuData.pillars.dayPillar.stem.name} (${sajuData.pillars.dayPillar.stem.char}) / ${sajuData.pillars.dayPillar.branch.name} (${sajuData.pillars.dayPillar.branch.char}) - 십성: ${sajuData.pillars.dayPillar.tenStar} (일간은 ${sajuData.dayMasterDesc}입니다.)
- 월주: ${sajuData.pillars.monthPillar.stem.name} (${sajuData.pillars.monthPillar.stem.char}) / ${sajuData.pillars.monthPillar.branch.name} (${sajuData.pillars.monthPillar.branch.char}) - 십성: ${sajuData.pillars.monthPillar.tenStar}
- 년주: ${sajuData.pillars.yearPillar.stem.name} (${sajuData.pillars.yearPillar.stem.char}) / ${sajuData.pillars.yearPillar.branch.name} (${sajuData.pillars.yearPillar.branch.char}) - 십성: ${sajuData.pillars.yearPillar.tenStar}

오행 분포:
- 목(木): ${sajuData.elementsCount.목}개
- 화(火): ${sajuData.elementsCount.화}개
- 토(土): ${sajuData.elementsCount.토}개
- 금(金): ${sajuData.elementsCount.금}개
- 수(水): ${sajuData.elementsCount.수}개
가장 결핍되거나 약한 오행 기운: ${sajuData.luckyElement} (개운법 행운의 컬러: ${sajuData.luckyGuides.color}, 행운의 아이템: ${sajuData.luckyGuides.item})

[요구사항]
1. 존댓말과 신비롭고 고급스러운 테크-샤머니즘 어조를 사용해주세요. (예: "우주의 은하수 흐름이 당신에게...", "당신의 일간 甲목의 기운은...")
2. 분량은 최소 600자 이상으로 매우 상세하고 정성스럽게 작성해주세요.
3. 다음 세 가지 항목을 포함해 작성해주세요.
   - 🌟 [우주적 성향 및 기질]: 타고난 본질과 강점, 천간지지의 조화
   - ⚡ [오행 에너지 조율 및 개운법]: 오행 분포 밸런스에 따른 라이프 가이드, 약한 오행 보강법
   - 🪐 [영혼의 성장 무기와 미래 나침반]: 인생의 거친 파도를 넘을 수 있는 당신만의 핵심 무기와 지혜의 조언
  `;

  const result = await timeoutPromise(8000, model.generateContent(prompt));
  const response = await result.response;
  return response.text();
};

  // Open Today's Fortune modal
  const handleOpenTodayFortune = async () => {
    setIsTodayFortuneOpen(true);
    setDrawnCosmicCard(null); // Reset cosmic card pull
    
    if (!result) {
      setTodayFortuneResult("");
      return;
    }
    
    if (todayFortuneResult) return; // already loaded
    
    if (apiKey) {
      setTodayFortuneLoading(true);
      setTodayFortuneLoadingText("🌌 오늘의 천체 배치와 당신의 일주 기운을 연동하는 중...");
      try {
        const runApi = async () => {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `
당신은 신비롭고 감각적인 테크-샤머니즘 사주 마스터입니다.
다음 사용자의 사주 정보를 분석하여 '오늘 하루의 우주적 기운과 상세 총운'을 작성해 주세요.

사용자 이름: ${result.name}
성별: ${result.gender}
사주 명식의 일주: ${result.pillars.dayPillar.stem.name} (${result.pillars.dayPillar.stem.char}) / ${result.pillars.dayPillar.branch.name} (${result.pillars.dayPillar.branch.char})
오행 분포: 목(${result.elementsCount.목}) 화(${result.elementsCount.화}) 토(${result.elementsCount.토}) 금(${result.elementsCount.금}) 수(${result.elementsCount.수})
행운의 오행 기운: ${result.luckyElement}

[요구사항]
1. 친절하고 신비로운 톤으로 작성해주세요.
2. 오늘 하루 맞닥뜨릴 에너지 흐름, 대인관계 팁, 그리고 오늘 실천하면 좋은 행동을 아주 정성스럽게 작성해주세요.
3. 최소 400자 이상으로 길고 구체적으로 적어주세요.
          `;
          const genResult = await model.generateContent(prompt);
          const response = await genResult.response;
          return response.text();
        };

        const apiText = await timeoutPromise(6000, runApi());
        setTodayFortuneResult(apiText);
        setTodayFortuneLoading(false);
      } catch (err) {
        console.error("Gemini Today Fortune error:", err);
        setTodayFortuneResult("우주의 신호가 잠시 흔들리고 있습니다. 오늘의 일주 기운에 따르면 오늘 하루는 나만의 원소 기운이 균형을 잡는 날입니다. 침착하고 주체적으로 대처할 때 가장 강력한 운이 들어옵니다. 사색과 가벼운 명상, 혹은 행운의 아이템을 몸에 지녀보세요.");
        setTodayFortuneLoading(false);
      }
    } else {
      // Deterministic fallback
      setTodayFortuneResult(`🌌 오늘의 우주 나침반 | [${result.name}] 님의 오행 일일 보고서\n\n오늘의 흐름은 당신의 일간인 ${result.dayMasterDesc}과 강력한 공명 주파수를 형성하고 있습니다. 오행 에너지를 분석한 결과, 오늘 하루는 대외적인 확장보다 내면의 에너지를 축적하고 단단히 정돈하는 데 최고의 기운이 작용합니다.\n\n특히 대인관계에서는 타인의 말을 경청하고 한 템포 쉬어갈 때 뜻밖의 귀중한 조력자를 만나게 되며, 중요한 진로나 업무적 의사결정은 오후 시간대(토/금의 시간대)에 진행하는 것이 유리합니다. 개운을 돕기 위해 행운의 방위인 ${result.luckyGuides.direction}을 향해 1분간 눈을 감고 명상을 하거나, 행운의 색상인 ${result.luckyGuides.color} 계열의 의상 및 소품을 매치해보세요. 우주가 당신의 평화와 성장을 돕고 있습니다.`);
    }
  };

  const handleOpenPremium = () => {
    setIsPremiumOpen(true);
    // Reset premium states
    setPremiumResult("");
    setPartnerName("");
    setPartnerBirthDate("");
  };

  const handleDrawCosmicCard = () => {
    const randomCard = COSMIC_CARDS[Math.floor(Math.random() * COSMIC_CARDS.length)];
    setDrawnCosmicCard(randomCard);
    console.log("State Updated [drawnCosmicCard]:", randomCard.title);
  };

  // Internal partner Saju calculator for Compatibility (궁합)
  const calculatePartnerSajuDetails = () => {
    if (!partnerName || !partnerBirthDate) return null;
    const dateObj = new Date(partnerBirthDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hr = partnerTimeUnknown ? 12 : parseInt(partnerBirthHour);
    const mn = partnerTimeUnknown ? 0 : parseInt(partnerBirthMinute);

    let lunar;
    if (partnerCalendarType === 'solar') {
      const solar = Solar.fromYmdHms(year, month, day, hr, mn, 0);
      lunar = solar.getLunar();
    } else {
      const isLeap = partnerCalendarType === 'lunar_leap';
      lunar = Lunar.fromYmdHms(year, isLeap ? -month : month, day, hr, mn, 0);
    }

    const eightChar = lunar.getEightChar();
    
    // Map pillars
    const yStem = findStem(eightChar.getYearGan());
    const yBranch = findBranch(eightChar.getYearZhi());
    const mStem = findStem(eightChar.getMonthGan());
    const mBranch = findBranch(eightChar.getMonthZhi());
    const dStem = findStem(eightChar.getDayGan());
    const dBranch = findBranch(eightChar.getDayZhi());
    const hStem = findStem(eightChar.getTimeGan());
    const hBranch = findBranch(eightChar.getTimeZhi());

    const yearPillar = { stem: yStem, branch: yBranch };
    const monthPillar = { stem: mStem, branch: mBranch };
    const dayPillar = { stem: dStem, branch: dBranch };
    const hourPillar = { stem: hStem, branch: hBranch };

    const elementsCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    const addElem = (elem) => { elementsCount[elem] = (elementsCount[elem] || 0) + 1 };
    addElem(yStem.element); addElem(yBranch.element);
    addElem(mStem.element); addElem(mBranch.element);
    addElem(dStem.element); addElem(dBranch.element);
    addElem(hStem.element); addElem(hBranch.element);

    return {
      name: partnerName,
      gender: partnerGender === 'male' ? '남성' : '여성',
      pillars: { yearPillar, monthPillar, dayPillar, hourPillar },
      elementsCount
    };
  };

  const handleGeneratePremiumReport = async () => {
    if (!result) {
      alert("먼저 메인 화면에서 사주 분석을 완료해 주세요!");
      return;
    }
    
    setPremiumResult("");
    setPremiumLoading(true);
    
    const steps = [
      "🪐 명식과 일주 공명 궤도 해독 중...",
      "📜 천간지기 대운 기류 스캔 중...",
      "💎 Gemini AI 초정밀 운세 보고서 작성 중..."
    ];
    setPremiumLoadingText(steps[0]);
    
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      if (stepCount < steps.length) {
        setPremiumLoadingText(steps[stepCount]);
      }
    }, 1200);

    let partnerDetails = null;

    try {
      if (selectedPremiumService === 'gunghap') {
        partnerDetails = calculatePartnerSajuDetails();
        if (!partnerDetails) {
          clearInterval(interval);
          alert("상대방 성함과 생년월일을 올바르게 입력해주세요.");
          setPremiumLoading(false);
          return;
        }

        if (apiKey) {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `
당신은 우주의 인연 에너지 정렬과 사상적 궁합을 분석하는 'AI 인연 궁합 마스터'입니다.
다음 두 명의 사주 정보를 비교 분석하여 이들의 '천생 궁합 시너지 리포트'를 테크-샤머니즘 스타일의 매끄러운 존댓말로 아름답게 작성해 주세요.

[본인 정보]
이름: ${result.name} (${result.gender})
일주: ${result.pillars.dayPillar.stem.name} / ${result.pillars.dayPillar.branch.name}
오행 분포: 목(${result.elementsCount.목}) 화(${result.elementsCount.화}) 토(${result.elementsCount.토}) 금(${result.elementsCount.금}) 수(${result.elementsCount.수})

[상대방 정보]
이름: ${partnerDetails.name} (${partnerDetails.gender})
일주: ${partnerDetails.pillars.dayPillar.stem.name} / ${partnerDetails.pillars.dayPillar.branch.name}
오행 분포: 목(${partnerDetails.elementsCount.목}) 화(${partnerDetails.elementsCount.화}) 토(${partnerDetails.elementsCount.토}) 금(${partnerDetails.elementsCount.금}) 수(${partnerDetails.elementsCount.수})

[요구사항]
1. 두 사람의 오행 보완 관계(서로에게 결핍된 기운을 보완해주는지 여부)를 분석해주세요.
2. 성격 및 연애 성향적 어울림, 협업이나 소통 시 발생할 수 있는 잠재적 갈등과 이를 극복할 수 있는 현명한 대화 및 조율 비결을 제시해주세요.
3. 분량은 최소 800자 이상으로 매우 상세하고 감동적으로 작성해 주세요.
          `;
          const runApi = async () => {
            const genResult = await model.generateContent(prompt);
            const response = await genResult.response;
            return response.text();
          };
          const apiText = await timeoutPromise(6000, runApi());
          setPremiumResult(apiText);
        } else {
          // Fallback 궁합
          setPremiumResult(getPremiumFallbackReport('gunghap', result, partnerDetails));
        }
      } else if (selectedPremiumService === 'daewun') {
        if (apiKey) {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `
당신은 우주 성단 정렬과 사주명리학을 결합해 운명을 해석하는 신비로운 '테크-샤머니즘(Tech-Shamanism) 사주 마스터'입니다.
다음 사용자의 사주 정보를 바탕으로 '평생의 대운 흐름과 향후 5개년 세운(연도별 상세 운세)'에 대해 매우 정교하고 품격 있는 문체로 해석 보고서를 작성해 주세요.

사용자 정보:
이름: ${result.name}
성별: ${result.gender}
일주: ${result.pillars.dayPillar.stem.name} / ${result.pillars.dayPillar.branch.name}
오행: 목(${result.elementsCount.목}) 화(${result.elementsCount.화}) 토(${result.elementsCount.토}) 금(${result.elementsCount.금}) 수(${result.elementsCount.수})

[요구사항]
1. 대운의 개념과 이 사용자의 일생을 관통하는 대운의 주기적 특징(도전기, 안착기 등)을 설명해주세요.
2. 향후 5개년(2026년~2030년) 동안의 구체적인 연도별 길흉화복과 라이프 디자인 가이드를 구체적으로 제안해주세요.
3. 정중하고 존칭을 사용하며, 분량은 최소 800자 이상으로 매우 상세하게 작성해주세요.
          `;
          const runApi = async () => {
            const genResult = await model.generateContent(prompt);
            const response = await genResult.response;
            return response.text();
          };
          const apiText = await timeoutPromise(6000, runApi());
          setPremiumResult(apiText);
        } else {
          // Fallback 대운
          setPremiumResult(getPremiumFallbackReport('daewun', result));
        }
      } else if (selectedPremiumService === 'career') {
        if (apiKey) {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `
당신은 사주명리 진로 상담과 현대적 비즈니스 라이프 코칭을 결합한 'AI 커리어-머니 명리학 마스터'입니다.
다음 사용자의 사주명식을 바탕으로 '평생 진로 방향성 및 재물 축적 Blueprint'에 대해 경영학적 통찰과 전통 사주학을 융합해 매끄럽게 작성해주세요.

사용자 정보:
이름: ${result.name}
성별: ${result.gender}
일주: ${result.pillars.dayPillar.stem.name} / ${result.pillars.dayPillar.branch.name}
오행: 목(${result.elementsCount.목}) 화(${result.elementsCount.화}) 토(${result.elementsCount.토}) 금(${result.elementsCount.금}) 수(${result.elementsCount.수})

[요구사항]
1. 사주에서 나타나는 직업적 성향과 가장 적합한 산업군/직종(창업, 전문직, 조직 생활 등)을 분석해주세요.
2. 재물운을 끌어당기는 구체적인 투자/자산 관리 성향 및 마인드셋 개운 비결을 기술해주세요.
3. 분량은 최소 800자 이상으로 구체적인 실행 지침을 제안해주세요.
          `;
          const runApi = async () => {
            const genResult = await model.generateContent(prompt);
            const response = await genResult.response;
            return response.text();
          };
          const apiText = await timeoutPromise(6000, runApi());
          setPremiumResult(apiText);
        } else {
          // Fallback 재물
          setPremiumResult(getPremiumFallbackReport('career', result));
        }
      }
      
    } catch (err) {
      console.error("Gemini Premium Error, falling back to deterministic premium engine:", err);
      try {
        const fallbackReport = getPremiumFallbackReport(selectedPremiumService, result, partnerDetails);
        setPremiumResult(fallbackReport || "우주 정렬 신호의 정밀 연산이 잠시 지체되고 있습니다. 전통 계산 로직에 따르면 당신의 평생 진로와 재물의 복록은 우직하고 성실히 씨앗을 뿌릴 때 점진적으로 가득하게 채워지는 구조를 지니고 있습니다. 나침반의 방향을 믿고 한 걸음씩 나아가세요.");
      } catch (fallbackErr) {
        console.error("Fallback generation also failed:", fallbackErr);
        setPremiumResult("우주 정렬 신호의 정밀 연산이 잠시 지체되고 있습니다. 전통 계산 로직에 따르면 당신의 평생 진로와 재물의 복록은 우직하고 성실히 씨앗을 뿌릴 때 점진적으로 가득하게 채워지는 구조를 지니고 있습니다. 나침반의 방향을 믿고 한 걸음씩 나아가세요.");
      }
    } finally {
      clearInterval(interval);
      setPremiumLoading(false);
      console.log("State Cleaned [premiumLoading = false, interval cleared] via finally block.");
    }
  };

  // Custom interactive simulation delay & texts
  const runCosmicAlignment = (e) => {
    e.preventDefault()
    if (!name || !birthDate) {
      alert('성함과 생년월일을 올바르게 입력해주세요.')
      return
    }
    
    console.log("%c🔮 [Saju.ai] 사주 연산 시작!", "color: #E2B857; font-weight: bold; font-size: 14px;");
    console.log("입력 데이터:", { name, gender, birthDate, birthHour, birthMinute, timeUnknown, calendarType });

    setLoading(true)
    const texts = [
      "🌌 은하계 오행 정렬 연산 중...",
      "🪐 명식 8자 천간/지지 오행 분석 중...",
      "📜 전통 만세력 알고리즘 해독 중...",
      "✨ 당신이 태어난 순간의 우주 나침반 완성!"
    ]
    
    let step = 0
    setLoadingText(texts[0])
    
    const interval = setInterval(() => {
      step++
      if (step < texts.length) {
        setLoadingText(texts[step])
      } else {
        clearInterval(interval)
        calculateSaju()
      }
    }, 600)
  }

  // Pure deterministic Saju engine based on lunar-javascript library!
  const calculateSaju = () => {
    const dateObj = new Date(birthDate)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    const hr = timeUnknown ? 12 : parseInt(birthHour)
    const mn = timeUnknown ? 0 : parseInt(birthMinute)

    // Calculate using lunar-javascript
    let lunar;
    if (calendarType === 'solar') {
      const solar = Solar.fromYmdHms(year, month, day, hr, mn, 0);
      lunar = solar.getLunar();
    } else {
      const isLeap = calendarType === 'lunar_leap';
      // If leap month, pass negative month number
      lunar = Lunar.fromYmdHms(year, isLeap ? -month : month, day, hr, mn, 0);
    }

    const eightChar = lunar.getEightChar();

    // Map to our objects
    const yStem = findStem(eightChar.getYearGan());
    const yBranch = findBranch(eightChar.getYearZhi());
    const mStem = findStem(eightChar.getMonthGan());
    const mBranch = findBranch(eightChar.getMonthZhi());
    const dStem = findStem(eightChar.getDayGan());
    const dBranch = findBranch(eightChar.getDayZhi());
    const hStem = findStem(eightChar.getTimeGan());
    const hBranch = findBranch(eightChar.getTimeZhi());

    // Build Pillars
    const yearPillar = { 
      stem: yStem, 
      branch: yBranch, 
      label: '년주 (조상·초년)', 
      tenStar: translateShiShen(eightChar.getYearShiShenGan()) + ' / ' + translateShiShen(eightChar.getYearShiShenZhi()) 
    };
    const monthPillar = { 
      stem: mStem, 
      branch: mBranch, 
      label: '월주 (부모·청년)', 
      tenStar: translateShiShen(eightChar.getMonthShiShenGan()) + ' / ' + translateShiShen(eightChar.getMonthShiShenZhi())
    };
    const dayPillar = { 
      stem: dStem, 
      branch: dBranch, 
      label: '일주 (나·중년)', 
      tenStar: '비견 (본인) / ' + translateShiShen(eightChar.getDayShiShenZhi())
    };
    const hourPillar = { 
      stem: hStem, 
      branch: hBranch, 
      label: timeUnknown ? '시주 (모름)' : '시주 (자녀·말년)', 
      tenStar: translateShiShen(eightChar.getTimeShiShenGan()) + ' / ' + translateShiShen(eightChar.getTimeShiShenZhi())
    };

    // Calculate elements count
    const elementsCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    const addElem = (elem) => { elementsCount[elem] = (elementsCount[elem] || 0) + 1 };
    addElem(yearPillar.stem.element);
    addElem(yearPillar.branch.element);
    addElem(monthPillar.stem.element);
    addElem(monthPillar.branch.element);
    addElem(dayPillar.stem.element);
    addElem(dayPillar.branch.element);
    addElem(hourPillar.stem.element);
    addElem(hourPillar.branch.element);

    // Dynamic Saju descriptions
    const dayMaster = dayPillar.stem;
    const dayMasterDesc = `${dayMaster.name}(${dayMaster.char}${dayMaster.element}) 기운`;
    
    // Deterministic fortune generation based on element ratios - HIGHER THAN 500 CHARACTERS
    let mainStrengths = "";
    if (elementsCount['목'] >= 3) {
      mainStrengths = "당신의 사주에는 목(木)의 강한 생명력이 가득하여 마치 한겨울의 모진 풍파를 이겨내고 굳건히 대지를 뚫고 솟아오르는 신비로운 나무들과 같습니다. 매사에 뚜렷한 목표 지향성을 지니고 있으며, 남을 올바르게 성장시키는 자애롭고 현명한 리더십이 돋보입니다. 타인에게 의존하기보다 독립적으로 나만의 길을 개척하는 추진력이 당신의 가장 큰 무기입니다.\n\n또한 창의적이고 새로운 분야를 스케치하는 기획자이자 모험가로서의 기운이 충만하며, 지식에 대한 탐구욕도 깊습니다. 다만, 때로는 너무 한곳으로 뻗어 나가려 하여 주변과의 유연한 타협이나 끈기 있는 마무리가 부족할 수 있으니 이를 주의하고 감정을 다스리는 조율이 필요합니다. 올 한 해는 당신이 품은 푸르른 싹이 울창한 숲을 이루기 위한 가장 결정적인 초석을 다지는 소중한 도약의 해가 될 것입니다.";
    } else if (elementsCount['화'] >= 3) {
      mainStrengths = "당신의 사주에는 화(火)의 뜨거운 열정이 가득 흘러넘쳐 마치 온 세상을 따뜻하고 화려하게 비추는 태양이나 용광로의 불길과 같습니다. 풍부한 표현력을 바탕으로 감수성이 풍부하며, 매사 솔직담백하고 뒤끝이 없는 강직한 정의파입니다. 어떤 낯선 공간이나 모임에서도 금방 분위기를 주도하며 타인의 시선을 사로잡는 강력한 매력과 사교성을 자랑합니다.\n\n뛰어난 감각과 전달력을 지녀 예술적 영역이나 미디어를 활용하는 일에서 비범한 성과를 보일 수 있습니다. 다만, 감정의 굴곡이 급격하게 요동치거나 금방 달아올랐다가 쉽게 식어버릴 수 있는 급한 성향이 있으므로 내면의 평온을 다스리는 사색과 차분함이 최고의 명약이 될 것입니다. 당신의 밝고 긍정적인 불꽃이 주변의 어둠을 밝혀주어 뜻밖의 귀한 관계적 성장을 이뤄낼 것입니다.";
    } else if (elementsCount['토'] >= 3) {
      mainStrengths = "당신의 사주에는 토(土)의 두텁고 묵직한 포용력이 중심을 아주 단단히 잡아주고 있어 모진 풍파와 흔들림 속에서도 흔들리지 않는 굳건한 태산과 같습니다. 중간에서 서로 다른 의견을 조율하고 신뢰를 쌓아올리는 중개 능력이 비범하며, 한번 인연을 맺은 사람이나 약속은 하늘이 무너져도 소중히 지켜내는 깊은 신의가 인생의 가장 든든한 초석이자 자산입니다.\n\n우직하고 계획적인 실천력을 지녔으며, 감정에 치우치지 않고 매사 현실적인 내실을 기하는 수호자형 인물입니다. 다만, 생각의 틀이 너무 고착되거나 완고해져 변화의 흐름에 유연하게 대처하지 못하는 고집이 될 수 있으니 때로는 타인의 새로운 도전을 열린 마음으로 받아들이는 노력이 필요합니다. 흙이 온 생명을 기르듯 당신의 헌신과 무게감이 주변에 안정을 가져다줄 것입니다.";
    } else if (elementsCount['금'] >= 3) {
      mainStrengths = "당신의 사주에는 금(金)의 매서운 분별력과 날카로운 단단함이 깊게 깃들어 있어, 맑고 정갈하게 세공된 순도 높은 다이아몬드나 시시비비를 명확히 가려내는 정의로운 검과 같습니다. 매사 허투루 처리하지 않는 빈틈없는 완벽주의적 면모와 공정함이 돋보이며, 불필요한 일에 얽매이지 않고 사사로운 정보다 원칙과 결단을 우선시하는 카리스마가 대단합니다.\n\n냉철한 이성과 탁월한 기획력, 마무리를 매듭짓는 수확의 에너지가 강하여 비즈니스나 중요한 의사결정에서 주도적인 역할을 책임지게 됩니다. 다만, 너무 냉정하고 날이 서 있어 주변 사람들에게 뜻하지 않게 상처를 주거나 고립감을 느낄 수 있으니 부드러운 화법과 배려의 마음을 곁들이면 훨씬 큰 대업을 완수하게 될 것입니다. 당신이 가진 의리 있는 성품이 결국 모두의 인정을 받게 됩니다.";
    } else if (elementsCount['수'] >= 3) {
      mainStrengths = "당신의 사주에는 수(水)의 깊고 도도한 지혜의 강물이 유연하게 흐르고 있어 남들이 보지 못하는 이면을 꿰뚫어 보는 강력한 통찰력과 직관력을 지녔습니다. 장애물을 만나면 다투지 않고 굽이쳐 돌아가는 유연성과 임기응변이 뛰어나며, 고도의 집중력과 깊은 학문적 성취, 혹은 기획 능력이 대단합니다. 차분하게 내실을 다지며 때를 기다리는 은인자중의 지혜가 빛납니다.\n\n심지가 깊고 타인의 아픔을 깊이 경청하는 훌륭한 치유자의 기운이 묻어납니다. 다만, 내면에 담아둔 깊은 생각이나 감정을 밖으로 잘 드러내지 않아 다소 비밀스럽거나 생각이 꼬리를 물어 쓸데없는 근심과 우울감에 빠지기 쉬우니 에너지를 적극적으로 발산하는 대외 활동을 가미하는 것이 좋습니다. 당신이 가진 지혜의 물결이 세상의 메마른 곳을 채우며 잔잔한 감동을 퍼뜨릴 것입니다.";
    } else {
      mainStrengths = "당신의 명식은 오행(木·火·土·金·水)의 다섯 가지 우주 기운이 어느 한쪽으로 치우침 없이 극적인 조화와 완벽한 균형을 이루고 있는 대단히 보기 드문 귀하고 영롱한 명식입니다. 어떤 변화무쌍하고 가혹한 대운이나 악조건이 찾아오더라도 나침반의 바늘처럼 유연하면서도 빠르게 자기 중심을 잡고 극복해내는 뛰어난 회복탄력성과 단단한 적응력을 지니고 계십니다.\n\n모든 에너지 흐름이 유기적으로 통하고 있어 대인관계의 원만함과 비범한 중재력, 고유의 창의성이 큰 부침 없이 꾸준하게 발현되는 강점이 있습니다. 특정한 오행에 집착하기보다 시기적 적응에 유연하므로, 나만의 템포를 지키며 한 걸음씩 성실하게 나아갈 때 하늘의 뜻과 땅의 기운이 결합하여 더할 나위 없이 풍요롭고 명예로운 인생을 완성해 나갈 것입니다.";
    }

    // Determine Lucky guides based on weakest element
    let weakestElement = '목';
    let minVal = 99;
    Object.keys(elementsCount).forEach(key => {
      if (elementsCount[key] < minVal) {
        minVal = elementsCount[key];
        weakestElement = key;
      }
    });

    const luckyGuides = {
      '목': { color: '그린 (Green)', item: '목재 인테리어, 화분 기르기', direction: '동쪽 (East)', number: '3, 8', season: '따뜻한 봄' },
      '화': { color: '레드 & 오렌지 (Red & Orange)', item: '화려한 조명, 향수나 캔들 향', direction: '남쪽 (South)', number: '2, 7', season: '열정적인 여름' },
      '토': { color: '옐로우 & 브라운 (Yellow & Brown)', item: '도자기 소품, 황토 방 꾸미기', direction: '중앙 (Center)', number: '5, 10', season: '결실의 환절기' },
      '금': { color: '화이트 & 골드 (White & Gold)', item: '메탈 액세서리, 스마트 디바이스', direction: '서쪽 (West)', number: '4, 9', season: '정돈된 가을' },
      '수': { color: '블랙 & 블루 (Black & Blue)', item: '어항 조경, 반신욕이나 호수 여행', direction: '북쪽 (North)', number: '1, 6', season: '사색의 겨울' },
    }[weakestElement];

    // Structured Gan/Ji objects mapping for Step 2 requirements
    const getElementDetails = (char, isStem) => {
      const stemObj = isStem ? HEAVENLY_STEMS.find(s => s.char === char) : null;
      const branchObj = !isStem ? EARTHLY_BRANCHES.find(b => b.char === char) : null;
      const element = isStem ? stemObj.element : branchObj.element;
      
      let colorClass = "";
      if (element === '목') colorClass = "text-emerald-500";
      else if (element === '화') colorClass = "text-red-500";
      else if (element === '토') colorClass = "text-amber-500";
      else if (element === '금') colorClass = "text-slate-300";
      else if (element === '수') colorClass = "text-purple-500";

      const stemKor = { '甲':'갑', '乙':'을', '丙':'병', '丁':'정', '戊':'무', '己':'기', '庚':'경', '辛':'신', '壬':'임', '癸':'계' };
      const branchKor = { '子':'자', '丑':'축', '寅':'인', '卯':'묘', '辰':'진', '巳':'사', '午':'오', '未':'미', '申':'신', '酉':'유', '戌':'술', '亥':'해' };
      
      const text = isStem ? stemKor[char] : branchKor[char];
      
      return {
        text,
        hanja: char,
        element,
        color: colorClass
      };
    };

    const yearGan = getElementDetails(eightChar.getYearGan(), true);
    const yearJi = getElementDetails(eightChar.getYearZhi(), false);
    const monthGan = getElementDetails(eightChar.getMonthGan(), true);
    const monthJi = getElementDetails(eightChar.getMonthZhi(), false);
    const dayGan = getElementDetails(eightChar.getDayGan(), true);
    const dayJi = getElementDetails(eightChar.getDayZhi(), false);
    const hourGan = getElementDetails(eightChar.getTimeGan(), true);
    const hourJi = getElementDetails(eightChar.getTimeZhi(), false);

    const sajuResult = {
      name,
      gender: gender === 'male' ? '남성' : '여성',
      birthDate,
      calendarType: calendarType === 'solar' ? '양력' : calendarType === 'lunar_normal' ? '음력 평달' : '음력 윤달',
      pillars: { hourPillar, dayPillar, monthPillar, yearPillar },
      yearGan,
      yearJi,
      monthGan,
      monthJi,
      dayGan,
      dayJi,
      hourGan,
      hourJi,
      dayMasterDesc,
      dayMasterDetail: dayMaster.desc,
      elementsCount,
      mainStrengths,
      luckyGuides,
      luckyElement: weakestElement,
      randomFortune: RANDOM_FORTUNE_MESSAGES[Math.floor(Math.random() * RANDOM_FORTUNE_MESSAGES.length)]
    };

    console.log("%c🪐 [Saju.ai] 사주 연산 완료! 최종 결과 명식:", "color: #a855f7; font-weight: bold; font-size: 14px;");
    console.log(sajuResult);

    setResult(sajuResult)
    setLoading(false)

    // Trigger dynamic Gemini deep analysis if API Key is configured!
    if (apiKey) {
      setAiSajuReading("");
      setAiSajuLoading(true);
      generateSajuInsightWithGemini(sajuResult)
        .then(reading => {
          setAiSajuReading(reading);
          setAiSajuLoading(false);
          console.log("%c🔮 [Saju.ai] Gemini AI 사주 풀이 완료!", "color: #10B981; font-weight: bold;");
        })
        .catch(err => {
          console.error("Gemini Saju error:", err);
          setAiSajuLoading(false);
        });
    }
  }

  // Copy share text to clipboard
  const handleShare = () => {
    if (!result) return
    const text = `🌌 Saju.ai | [${result.name}] 님의 우주 나침반 결과\n일주: ${result.pillars.dayPillar.stem.char}${result.pillars.dayPillar.branch.char} (${result.dayMasterDesc})\n오행 비율: 목(${result.elementsCount.목}) 화(${result.elementsCount.화}) 토(${result.elementsCount.토}) 금(${result.elementsCount.금}) 수(${result.elementsCount.수})\n✨ 행운의 오행 기운: [${result.luckyElement}] (${result.luckyGuides.color})\n지금 바로 나의 사주 확인하기!`;
    navigator.clipboard.writeText(text)
    alert('🌌 결과가 클립보드에 복사되었습니다! 소중한 분들에게 공유해 보세요.')
  }

  return (
    <div className="relative min-h-screen bg-[#080A10] text-[#E0E7FF] font-sans pb-20 select-none overflow-hidden">
      
      {/* Mystical Cosmic Background Overlay */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-25 overflow-hidden z-0">
        <img 
          src="/cosmic_constellation.png" 
          alt="Cosmic constellations" 
          className="w-full h-full object-cover animate-spin-slow scale-110 filter blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080A10]" />
      </div>

      {/* Floating Star Nodes (Astrological decoration) */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-glow z-0" />
      <div className="absolute top-1/2 right-10 w-44 h-44 bg-amber-500/5 rounded-full filter blur-3xl animate-pulse-glow z-0" />

      {/* HEADER */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-black font-semibold text-lg shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            ✨
          </div>
          <span className="font-outfit text-xl font-bold tracking-wider bg-gradient-to-r from-amber-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Saju.ai
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#hero" className="hover:text-amber-400 transition-colors">나의 만세력</a>
          <button 
            onClick={handleOpenTodayFortune}
            className="hover:text-amber-400 transition-colors bg-transparent border-none outline-none focus:outline-none cursor-pointer"
          >
            오늘의 총운
          </button>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
          <button 
            onClick={handleOpenPremium}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:border-amber-400/40 text-gray-300 hover:text-white transition-all transform hover:scale-[1.03] cursor-pointer"
          >
            Premium 서비스
          </button>
        </nav>
      </header>

      {/* HERO & CONTENT GRID */}
      <main id="hero" className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: HERO TEXT */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6 animate-float">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            테크-샤머니즘 모던 만세력
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight break-keep">
            우주가 당신이 태어난 <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">순간에 새긴 나침반</span>을 해독해보세요.
          </h1>
          <p className="text-gray-400 text-sm md:text-lg leading-relaxed break-keep">
            오래되고 난해하던 사주명리학을 감각적이고 직관적인 모던 UI로 재해석했습니다. 이름과 태어난 일시만으로 당신의 타고난 다섯 가지 원소(오행)의 비율과 성격적 무기를 정교하게 읽어냅니다.
          </p>
          <div className="hidden lg:block pt-6 border-t border-white/5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-500">누적 명식 분석</p>
                <p className="text-lg font-bold text-amber-400">142,890+</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-500">알고리즘 정확도</p>
                <p className="text-lg font-bold text-purple-400">99.8%</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-500">실시간 피드백</p>
                <p className="text-lg font-bold text-sky-400">최상</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM & RESULTS */}
        <div className="lg:col-span-7 w-full">
          {!result && !loading && (
            <div className="glass-panel-glow p-8 rounded-3xl relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl" />
              
              <div className="mb-6 space-y-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2 break-keep tracking-tight">
                  🔮 나의 천명(天命) 입력 양식
                </h2>
                <div className="h-0.5 w-16 bg-gradient-to-r from-amber-400 to-purple-500 rounded-full" />
                <p className="text-gray-300 text-[13px] leading-relaxed break-keep pt-2 font-medium tracking-wide">
                  태어나신 생년월일시의 우주 에너지 정렬을 해독합니다.<br/>
                  천간(天干)과 지지(地支)의 오행 배치를 스캔하여 당신만의 에너지를 정밀하게 읽어냅니다.
                </p>
              </div>

              <form onSubmit={runCosmicAlignment} className="space-y-5">
                {/* 이름 입력 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">성함</label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      console.log("State Updated [name]:", e.target.value);
                    }}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm"
                  />
                </div>

                {/* 성별 선택 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">성별</label>
                  <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-black/45 border border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setGender('male');
                        console.log("State Updated [gender]: male");
                      }}
                      className={`py-2 rounded-xl text-xs font-bold tracking-wider transition-all ${
                        gender === 'male' 
                          ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/30 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      🕺 남성
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGender('female');
                        console.log("State Updated [gender]: female");
                      }}
                      className={`py-2 rounded-xl text-xs font-bold tracking-wider transition-all ${
                        gender === 'female' 
                          ? 'bg-gradient-to-r from-purple-500/20 to-purple-500/30 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]' 
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      💃 여성
                    </button>
                  </div>
                </div>

                {/* 음양력 구분 탭 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">음양력</label>
                  <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-black/45 border border-white/5">
                    {[
                      { id: 'solar', label: '양력 (Solar)' },
                      { id: 'lunar_normal', label: '음력 평달' },
                      { id: 'lunar_leap', label: '음력 윤달' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setCalendarType(tab.id);
                          console.log("State Updated [calendarType]:", tab.id);
                        }}
                        className={`py-2 rounded-xl text-[11px] font-semibold transition-all ${
                          calendarType === tab.id 
                            ? 'bg-white/10 text-white border border-white/10 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-300 border border-transparent'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 생년월일 입력 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">생년월일</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => {
                      setBirthDate(e.target.value);
                      console.log("State Updated [birthDate]:", e.target.value);
                    }}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm"
                  />
                </div>

                {/* 출생시간 입력 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">출생시각</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={timeUnknown}
                        onChange={(e) => {
                          setTimeUnknown(e.target.checked);
                          console.log("State Updated [timeUnknown]:", e.target.checked);
                        }}
                        className="rounded border-white/10 bg-black text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-xs text-gray-400">시간 모름</span>
                    </label>
                  </div>
                  
                  {!timeUnknown && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <select
                          value={birthHour}
                          onChange={(e) => {
                            setBirthHour(e.target.value);
                            console.log("State Updated [birthHour]:", e.target.value);
                          }}
                          className="w-full glass-input px-4 py-3 rounded-2xl text-sm appearance-none"
                        >
                          {Array.from({ length: 24 }).map((_, idx) => {
                            const hr = String(idx).padStart(2, '0')
                            return <option key={hr} value={hr} className="bg-[#0B0F19]">{hr}시</option>
                          })}
                        </select>
                      </div>
                      <div>
                        <select
                          value={birthMinute}
                          onChange={(e) => {
                            setBirthMinute(e.target.value);
                            console.log("State Updated [birthMinute]:", e.target.value);
                          }}
                          className="w-full glass-input px-4 py-3 rounded-2xl text-sm appearance-none"
                        >
                          {Array.from({ length: 60 }).map((_, idx) => {
                            const mn = String(idx).padStart(2, '0')
                            return <option key={mn} value={mn} className="bg-[#0B0F19]">{mn}분</option>
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:via-purple-500 hover:to-indigo-500 text-black font-extrabold tracking-wide text-sm transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  🚀 나의 우주 확인하기
                </button>
              </form>
            </div>
          )}

          {/* COSMIC LOADER */}
          {loading && (
            <div className="glass-panel-glow p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-400 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-purple-500/10 border-t-purple-400 animate-spin rotate-45 duration-700" />
                <div className="absolute inset-4 rounded-full border-4 border-indigo-500/10 border-t-indigo-400 animate-spin rotate-90 duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center text-xl">🔮</div>
              </div>
              <p className="font-semibold text-lg bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                {loadingText}
              </p>
              <p className="text-xs text-gray-500 max-w-xs">태양계 행성의 천체 정렬 각도와 사주 천간의 음양 에너지를 계산하고 있습니다.</p>
            </div>
          )}

          {/* SAJU RESULT DASHBOARD */}
          {result && !loading && (
            <div className="space-y-8 animate-slide-up">
              
              {/* HEADER BANNER CARD */}
              <div className="glass-panel-glow p-6 md:p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-xl" />
                
                {/* Title and Reset */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 tracking-widest uppercase">My Cosmic Compass</span>
                    <h2 className="text-3xl font-extrabold text-white mt-1 tracking-tight break-keep">
                      {result.name} 님의 우주 나침반
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 break-keep">
                      {result.gender} · {result.birthDate} ({result.calendarType}) 태생
                    </p>
                  </div>
                  <button
                    onClick={() => setResult(null)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-gray-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  >
                    🔄 다시 분석하기
                  </button>
                </div>
                
                {/* Quick actions for premium and today's fortune */}
                <div className="mt-5 pt-5 border-t border-white/5 flex flex-wrap gap-3">
                  <button
                    onClick={handleOpenTodayFortune}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    🍀 오늘의 총운 스캔
                  </button>
                  <button
                    onClick={handleOpenPremium}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/10 to-purple-500/10 hover:from-amber-500/20 hover:to-purple-500/20 text-amber-300 border border-amber-500/20 hover:border-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    💎 Premium AI 서비스 (대운/궁합/진로)
                  </button>
                </div>
              </div>

              {/* GRID LAYOUT: LEFT (PILLARS) / RIGHT (CHARTS & INSIGHTS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDE: 4 PILLARS (lg:col-span-7) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden">
                    <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-5 flex items-center gap-2">
                      <span>📜</span> 타고난 사주팔자 사주명식
                    </h3>
                    
                    {/* 4 Pillars Card Row */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                      
                      {/* Hour Pillar (시주) */}
                      <div className="p-3 sm:p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between min-h-[250px] group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-extrabold tracking-wider uppercase mb-2">시주 (Hour)</span>
                        <div className="space-y-3 flex-grow flex flex-col justify-center">
                          <SajuCharacterBlock charData={result.hourGan} />
                          <SajuCharacterBlock charData={result.hourJi} />
                        </div>
                        <div className="mt-3">
                          <span className="text-[9px] sm:text-[10px] bg-white/5 py-1 px-1.5 rounded-xl text-amber-400/90 font-bold block border border-white/5 overflow-hidden text-ellipsis whitespace-nowrap" title={result.pillars.hourPillar.tenStar}>
                            {result.pillars.hourPillar.tenStar}
                          </span>
                        </div>
                      </div>

                      {/* Day Pillar (일주 - 본인) */}
                      <div className="p-3 sm:p-5 rounded-3xl bg-amber-500/5 backdrop-blur-md border-2 border-amber-500/30 hover:-translate-y-2 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between min-h-[250px] group relative shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-[8px] sm:text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.5)]">나 (Self)</div>
                        <span className="text-[10px] sm:text-xs text-amber-400 font-extrabold tracking-wider uppercase mt-1 mb-2">일주 (Day)</span>
                        <div className="space-y-3 flex-grow flex flex-col justify-center">
                          <SajuCharacterBlock charData={result.dayGan} />
                          <SajuCharacterBlock charData={result.dayJi} />
                        </div>
                        <div className="mt-3">
                          <span className="text-[9px] sm:text-[10px] bg-amber-500/20 py-1 px-1.5 rounded-xl text-amber-300 font-bold block border border-amber-500/20 overflow-hidden text-ellipsis whitespace-nowrap" title={result.pillars.dayPillar.tenStar}>
                            {result.pillars.dayPillar.tenStar}
                          </span>
                        </div>
                      </div>

                      {/* Month Pillar (월주) */}
                      <div className="p-3 sm:p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between min-h-[250px] group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-extrabold tracking-wider uppercase mb-2">월주 (Month)</span>
                        <div className="space-y-3 flex-grow flex flex-col justify-center">
                          <SajuCharacterBlock charData={result.monthGan} />
                          <SajuCharacterBlock charData={result.monthJi} />
                        </div>
                        <div className="mt-3">
                          <span className="text-[9px] sm:text-[10px] bg-white/5 py-1 px-1.5 rounded-xl text-amber-400/90 font-bold block border border-white/5 overflow-hidden text-ellipsis whitespace-nowrap" title={result.pillars.monthPillar.tenStar}>
                            {result.pillars.monthPillar.tenStar}
                          </span>
                        </div>
                      </div>

                      {/* Year Pillar (년주) */}
                      <div className="p-3 sm:p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between min-h-[250px] group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-extrabold tracking-wider uppercase mb-2">년주 (Year)</span>
                        <div className="space-y-3 flex-grow flex flex-col justify-center">
                          <SajuCharacterBlock charData={result.yearGan} />
                          <SajuCharacterBlock charData={result.yearJi} />
                        </div>
                        <div className="mt-3">
                          <span className="text-[9px] sm:text-[10px] bg-white/5 py-1 px-1.5 rounded-xl text-amber-400/90 font-bold block border border-white/5 overflow-hidden text-ellipsis whitespace-nowrap" title={result.pillars.yearPillar.tenStar}>
                            {result.pillars.yearPillar.tenStar}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 기질 및 성격 상세 풀이 카드들 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Day Master (나의 대표 오행) */}
                    <div className="glass-panel p-6 rounded-3xl border border-amber-500/10 relative overflow-hidden hover:border-amber-500/25 transition-colors">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full filter blur-xl" />
                      <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>👑</span> 나의 타고난 천성 (일간)
                      </h3>
                      <h4 className="text-xl font-bold text-white mb-2 break-keep">{result.dayMasterDesc}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed break-keep tracking-wide">{result.dayMasterDetail}</p>
                    </div>

                    {/* Comprehensive strengths (종합적 기질 분석) */}
                    <div className="glass-panel p-6 rounded-3xl border border-purple-500/10 relative overflow-hidden hover:border-purple-500/25 transition-colors">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full filter blur-xl" />
                      <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>⚡</span> 오행의 조합과 핵심 무기
                      </h3>
                      <h4 className="text-xl font-bold text-white mb-2 break-keep">명식 특성</h4>
                      <p className="text-gray-300 text-sm leading-relaxed break-keep tracking-wide">{result.mainStrengths}</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: INTERACTIVE CHARTS & GUIDES (lg:col-span-5) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* FIVE ELEMENTS RATIO CHART CARD (오행 분포 균형 상태) */}
                  <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden border border-purple-500/10">
                    <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-5 flex items-center gap-2">
                      <span>📊</span> 나의 오행(五行) 에너지 밸런스
                    </h3>

                    {/* GORGEOUS MULTI-COLORED STACKED PROGRESS BAR (100% Tailwind) */}
                    <div className="mb-6">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">에너지 흐름 분석 (Stacked Energy Flow)</p>
                      <div className="flex h-6 w-full bg-gray-950/80 rounded-full overflow-hidden border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                        {Object.entries(result.elementsCount).map(([elem, count]) => {
                          const total = Object.values(result.elementsCount).reduce((a, b) => a + b, 0);
                          const pct = Math.round((count / total) * 100);
                          if (pct === 0) return null;
                          return (
                            <div 
                              key={elem}
                              className={`h-full relative group transition-all duration-300 hover:scale-y-110 hover:brightness-125 cursor-pointer ${
                                elem === '목' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                                elem === '화' ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                                elem === '토' ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                                elem === '금' ? 'bg-gradient-to-r from-slate-400 to-slate-200 shadow-[0_0_15px_rgba(203,213,225,0.2)]' :
                                'bg-gradient-to-r from-sky-600 to-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                              }`}
                              style={{ width: `${pct}%` }}
                            >
                              {/* Element Character in stack */}
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-[#0B0F19] tracking-wider">
                                {elem}
                              </div>
                              
                              {/* Popover Tooltip on Hover */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:flex flex-col items-center z-50">
                                <div className="bg-gray-900/95 backdrop-blur-md text-white text-[10px] font-bold py-1.5 px-3 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] whitespace-nowrap">
                                  {elem}기운: {count}개 ({pct}%)
                                </div>
                                <div className="w-2 h-2 bg-gray-900/95 rotate-45 -mt-1 border-r border-b border-white/10" />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
 
                    {/* DETAILED GAUGE ROWS WITH ON-HOVER FLOATING TOOLTIP */}
                    <div className="space-y-4 bg-black/45 p-6 rounded-2xl border border-white/5 shadow-inner">
                      {Object.entries(result.elementsCount).map(([elem, count]) => {
                        const total = Object.values(result.elementsCount).reduce((a, b) => a + b, 0);
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={elem} className="group relative flex flex-col space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider ${getElementLabelColor(elem)} shadow-sm`}>
                                {elem} ({count}개)
                              </span>
                              <span className="text-[11px] font-bold text-gray-400 group-hover:text-amber-400 transition-colors duration-200">{pct}%</span>
                            </div>
                            
                            {/* Interactive Progress Bar */}
                            <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner cursor-help">
                              <div 
                                className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${
                                  elem === '목' ? 'from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                                  elem === '화' ? 'from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                                  elem === '토' ? 'from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                                  elem === '금' ? 'from-slate-400 to-slate-200 shadow-[0_0_15px_rgba(203,213,225,0.4)]' :
                                  'from-sky-600 to-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
 
                            {/* Floating detailed description tooltip on Hover */}
                            <div className="absolute right-0 bottom-full mb-2.5 hidden group-hover:flex flex-col items-end z-50">
                              <div className="max-w-[220px] bg-gray-900/95 backdrop-blur-md text-[10px] text-gray-200 p-3 rounded-2xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.6)] break-keep leading-relaxed font-medium">
                                {elem === '목' && '🌲 목(木): 추진력, 성장 의지, 성취욕과 시작의 기운'}
                                {elem === '화' && '🔥 화(火): 뜨거운 열정, 강력한 친화력, 자아 표현의 기운'}
                                {elem === '토' && '⛰️ 토(土): 조율과 화합, 무거운 신뢰성, 안정을 잡는 기운'}
                                {elem === '금' && '💎 금(金): 예리한 판단력, 확고한 결단력, 규칙과 정돈의 기운'}
                                {elem === '수' && '🌊 수(水): 흘러가는 유연함, 깊은 직관과 지혜, 사색의 기운'}
                              </div>
                              <div className="w-2.5 h-2.5 bg-gray-900/95 rotate-45 -mt-1.5 mr-4 border-r border-b border-white/10" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* LUCKY GUIDE BOX (행운의 오행 가이드) */}
                  <div className="glass-panel p-6 rounded-3xl border border-indigo-500/15">
                    <h3 className="text-sm font-extrabold text-sky-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span>🍀</span> 개운법 (행운을 극대화하는 라이프 가이드)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/35 p-3 rounded-2xl border border-white/5 text-center break-keep hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-gray-500 font-semibold mb-1">행운의 컬러</p>
                        <p className="text-sm font-bold text-white">{result.luckyGuides.color}</p>
                      </div>
                      <div className="bg-black/35 p-3 rounded-2xl border border-white/5 text-center break-keep hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-gray-500 font-semibold mb-1">행운의 아이템</p>
                        <p className="text-sm font-bold text-white leading-tight">{result.luckyGuides.item}</p>
                      </div>
                      <div className="bg-black/35 p-3 rounded-2xl border border-white/5 text-center break-keep hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-gray-500 font-semibold mb-1">행운의 방위</p>
                        <p className="text-sm font-bold text-white">{result.luckyGuides.direction}</p>
                      </div>
                      <div className="bg-black/35 p-3 rounded-2xl border border-white/5 text-center break-keep hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-gray-500 font-semibold mb-1">행운의 숫자/계절</p>
                        <p className="text-sm font-bold text-white">{result.luckyGuides.number} / {result.luckyGuides.season}</p>
                      </div>
                    </div>
                  </div>

                  {/* ORACLE GENERAL WRITTEN DESTINY FORTUNE */}
                  <div className="glass-panel p-6 rounded-3xl border border-emerald-500/10 bg-gradient-to-tr from-emerald-500/5 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl" />
                    <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>🌌</span> 오늘의 우주 메시지 (Oracle Word)
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed italic break-keep tracking-wide">
                      "{result.randomFortune}"
                    </p>
                  </div>

                </div>

              </div>

              {/* AI DEEP READING CARD */}
              <div className="glass-panel-glow p-6 md:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden mt-8 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl" />
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🔮</span>
                  <h3 className="text-md sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
                    AI 우주 나침반 영혼 솔루션 (Gemini Deep Reading)
                  </h3>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-400/20">LIVE AI</span>
                </div>
                
                {aiSajuLoading ? (
                  <div className="space-y-4 animate-pulse py-4">
                    <div className="h-4 bg-white/10 rounded-full w-3/4" />
                    <div className="h-4 bg-white/10 rounded-full w-5/6" />
                    <div className="h-4 bg-white/10 rounded-full w-2/3" />
                    <div className="h-4 bg-white/10 rounded-full w-full" />
                    <p className="text-xs text-amber-400/70 italic mt-2">우주 정렬 정보와 지장간 에너지를 연결하여 AI가 심층 풀이 보고서를 집필하고 있습니다...</p>
                  </div>
                ) : aiSajuReading ? (
                  <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-keep tracking-wide space-y-4 font-normal">
                    {aiSajuReading}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed break-keep tracking-wide">
                      {result.mainStrengths}
                    </p>
                  </div>
                )}
              </div>

              {/* SHARE OR RESET ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleShare}
                  className="flex-1 py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  🔗 나의 우주의 기운 공유하기
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="py-4 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  다른 사주 풀기
                </button>
              </div>

            </div>
          )}
        </div>

      </main>

      {/* TODAY'S FORTUNE MODAL */}
      {isTodayFortuneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel-glow w-full max-w-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden max-h-[85vh] overflow-y-auto">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl" />
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍀</span>
                <h3 className="text-lg font-bold text-white tracking-tight">오늘의 우주 총운</h3>
              </div>
              <button 
                onClick={() => setIsTodayFortuneOpen(false)}
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            {!result ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed break-keep">
                  아직 사주 분석이 진행되지 않았습니다.<br/>
                  메인 화면에서 생년월일시를 먼저 입력하고 분석을 완료하시면, 당신의 일주 기운과 연동된 '맞춤형 오늘의 총운'이 활성화됩니다!
                </p>
                <div className="h-px bg-white/5 my-6" />
                <h4 className="text-sm font-extrabold text-amber-400">⚡ 보너스: 오늘의 오행 우주 카드 뽑기</h4>
                <p className="text-xs text-gray-400 mb-4">재미로 오늘 하루 나를 이끄는 에너지 카드를 한 장 뽑아보세요!</p>
                
                {drawnCosmicCard ? (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto shadow-inner space-y-2 animate-slide-up">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Drawn Cosmic Card</span>
                    <h5 className="text-md font-extrabold text-white">{drawnCosmicCard.title}</h5>
                    <p className="text-xs text-gray-300 leading-relaxed break-keep pt-1">{drawnCosmicCard.desc}</p>
                    <button 
                      onClick={handleDrawCosmicCard}
                      className="mt-3 text-[10px] font-bold text-gray-400 hover:text-white underline cursor-pointer"
                    >
                      다시 뽑기
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleDrawCosmicCard}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    🔮 카드 한 장 뽑기
                  </button>
                )}
              </div>
            ) : todayFortuneLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                <p className="text-sm text-emerald-400 animate-pulse">{todayFortuneLoadingText}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-300/90 text-xs flex items-center gap-2 mb-4 leading-relaxed">
                  <span>💡</span>
                  <p className="break-keep font-medium">당신의 일주 [{result.pillars.dayPillar.stem.char}{result.pillars.dayPillar.branch.char}] 기운에 우주 주파수를 스캔한 맞춤 분석입니다.</p>
                </div>
                <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-keep tracking-wide space-y-2 bg-black/40 p-5 rounded-2xl border border-white/5 max-h-[45vh] overflow-y-auto">
                  {todayFortuneResult}
                </div>
              </div>
            )}
            
            {/* Close action */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setIsTodayFortuneOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM SERVICES MODAL */}
      {isPremiumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel-glow w-full max-w-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden max-h-[85vh] overflow-y-auto">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl" />
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xl">💎</span>
                <h3 className="text-lg font-bold text-white tracking-tight">AI 프리미엄 명리학 서비스</h3>
              </div>
              <button 
                onClick={() => setIsPremiumOpen(false)}
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            {!result ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed break-keep">
                  아직 본인 사주 분석이 완료되지 않았습니다.<br/>
                  메인 화면에서 본인의 생년월일시를 먼저 입력하고 분석하신 후에, 프리미엄 AI 보고서(대운/궁합/재물)를 신청하실 수 있습니다.
                </p>
                <div className="pt-4">
                  <button 
                    onClick={() => setIsPremiumOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    사주 입력하러 가기
                  </button>
                </div>
              </div>
            ) : premiumLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
                <p className="text-sm text-purple-400 animate-pulse">{premiumLoadingText}</p>
              </div>
            ) : premiumResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">AI Premium Report</span>
                  <button 
                    onClick={() => setPremiumResult("")}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    다른 보고서 신청
                  </button>
                </div>
                <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-keep tracking-wide bg-black/45 p-6 rounded-2xl border border-white/5 max-h-[45vh] overflow-y-auto">
                  {premiumResult}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-xs text-gray-400 tracking-wider font-semibold uppercase">보고서 유형 선택</p>
                
                {/* Selection Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'daewun', title: '💎 대운·세운 리포트', desc: '평생의 운세 흐름 및 향후 5개년 로드맵' },
                    { id: 'gunghap', title: '🔗 프리미엄 인연 궁합', desc: '상대방과의 오행 보완 및 연애/소통 궁합' },
                    { id: 'career', title: '💰 진로 & 재물 청사진', desc: '나에게 맞는 산업군 및 재물 개운법 Blueprint' }
                  ].map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedPremiumService(service.id)}
                      className={`p-4 rounded-2xl text-left border flex flex-col justify-between min-h-[110px] transition-all cursor-pointer ${
                        selectedPremiumService === service.id 
                          ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-white' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <span className="text-xs font-extrabold break-keep">{service.title}</span>
                      <span className="text-[9px] leading-relaxed break-keep mt-2 block opacity-75">{service.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Gunghap Form */}
                {selectedPremiumService === 'gunghap' && (
                  <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4 animate-slide-up">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">상대방 정보 입력</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">성함</label>
                        <input 
                          type="text" 
                          placeholder="상대방 이름"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">성별</label>
                        <div className="grid grid-cols-2 gap-2 p-0.5 rounded-xl bg-black/40 border border-white/5">
                          <button
                            type="button"
                            onClick={() => setPartnerGender('male')}
                            className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              partnerGender === 'male' 
                                ? 'bg-white/10 text-white' 
                                : 'text-gray-500'
                            }`}
                          >
                            🕺 남성
                          </button>
                          <button
                            type="button"
                            onClick={() => setPartnerGender('female')}
                            className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              partnerGender === 'female' 
                                ? 'bg-white/10 text-white' 
                                : 'text-gray-500'
                            }`}
                          >
                            💃 여성
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">음양력</label>
                        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-xl bg-black/40 border border-white/5">
                          {['solar', 'lunar_normal', 'lunar_leap'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setPartnerCalendarType(type)}
                              className={`py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                                partnerCalendarType === type 
                                  ? 'bg-white/10 text-white' 
                                  : 'text-gray-500'
                              }`}
                            >
                              {type === 'solar' ? '양력' : type === 'lunar_normal' ? '평달' : '윤달'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">생년월일</label>
                        <input 
                          type="date" 
                          value={partnerBirthDate}
                          onChange={(e) => setPartnerBirthDate(e.target.value)}
                          className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGeneratePremiumReport}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
                >
                  🚀 AI 프리미엄 분석 보고서 생성
                </button>
              </div>
            )}
            
            {/* Close action */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setIsPremiumOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center md:text-left">
        <div>
          <p>© 2026 Saju.ai. All rights reserved.</p>
          <p className="mt-1">인공지능과 사주명리학의 조화로운 연산 엔진 v1.0.2</p>
        </div>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-gray-400">개인정보 처리방침</a>
          <a href="#terms" className="hover:text-gray-400">서비스 이용약관</a>
          <a href="#contact" className="hover:text-gray-400">문의하기</a>
        </div>
      </footer>

    </div>
  )
}

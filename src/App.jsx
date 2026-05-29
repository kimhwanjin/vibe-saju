import { useState } from 'react'
import { Solar, Lunar } from 'lunar-javascript'

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
    
    // Deterministic fortune generation based on element ratios
    let mainStrengths = "";
    if (elementsCount['목'] >= 3) mainStrengths = "목(木)의 강한 생명력이 가득하여 목표 지향성이 투철하고, 남을 성장시키는 리더십과 자애로운 기품을 지녔습니다. 끊임없이 새로움을 모색하는 발명가적 에너지가 느껴집니다.";
    else if (elementsCount['화'] >= 3) mainStrengths = "화(火)의 뜨거운 열정이 넘쳐흘러 표현력이 풍부하고 매사 솔직담백하며 강직합니다. 어떤 모임에서든 핵심 분위기 메이커로 활약하며 뛰어난 공감 및 전달력을 자랑합니다.";
    else if (elementsCount['토'] >= 3) mainStrengths = "토(土)의 두터운 포용력이 중심을 단단히 잡아주어 중개 및 조율 능력이 비범하며, 한번 맺은 인연을 소중히 지키는 무거운 신용이 인생의 가장 큰 자산입니다.";
    else if (elementsCount['금'] >= 3) mainStrengths = "금(金)의 매서운 분별과 예리함이 살아있어 매사 빈틈이 없고, 사사로운 감정에 치우치지 않는 냉철한 의사결정력과 시시비비를 명확히 가리는 정의감이 돋보입니다.";
    else if (elementsCount['수'] >= 3) mainStrengths = "수(水)의 도도한 지혜가 흐르고 있어 임기응변과 전략 구상이 탁월하며 유연합니다. 남들이 보지 못하는 곳을 꿰뚫어 보는 직관력과 학문적 집중력이 대단합니다.";
    else mainStrengths = "오행(木·火·土·金·水)이 골고루 조화를 이루고 있는 아주 귀한 평화주의적 명식입니다. 어떤 격동의 운이 오더라도 유연하고 굳세게 돌파하는 단단한 적응력과 균형 감각이 대단하십니다.";

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
          <a href="#about" className="hover:text-amber-400 transition-colors">오늘의 총운</a>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:border-amber-400/40 text-gray-300 hover:text-white transition-all">
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
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-gray-300 transform hover:scale-[1.03] active:scale-[0.98]"
                  >
                    🔄 다시 분석하기
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

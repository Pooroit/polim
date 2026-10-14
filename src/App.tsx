import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

// ============================================================================
// 1. ТИПИЗАЦИЯ ДАННЫХ (TypeScript Interfaces)
// ============================================================================

type WorkCategory = "all" | "womenswear" | "menswear" | "capsules" | "details";
type ReviewCategory = "all" | "shopping" | "wardrobe" | "mens" | "coaching";

interface WorkItem {
  id: string;
  index: string;
  title: string;
  category: Exclude<WorkCategory, "all">;
  categoryLabel: string;
  description: string;
  stylistNote: string;
  imageUrl: string;
  layoutClass: string;
  aspectClass: string;
  offsetClass?: string;
}

interface MoodItem {
  id: string;
  code: string;
  caption: string;
  imageUrl: string;
  rotationClass: string;
}

interface ServiceItem {
  id: string;
  index: string;
  title: string;
  price: string;
  format: string;
  description: string;
  result: string;
  previewImg: string;
}

interface ReviewItem {
  id: string;
  code: string;
  category: Exclude<ReviewCategory, "all">;
  tag: string;
  author: string;
  highlight: string;
  quote: string;
  dateNote: string;
  /** Скриншот реального отзыва или фото образа клиентки, которое видно крупно и можно увеличить */
  proofImage: string;
  proofCaption: string;
}

interface FormState {
  name: string;
  contact: string;
  service: string;
  message: string;
}

// ============================================================================
// 2. КАРТА ВСЕХ ВАШИХ ФАЙЛОВ (С подробным описанием каждого файла)
// ============================================================================
const PHOTOS = {
  // Портреты Полины
  heroRedBelt: "/public/image/polina.jpg", // Серый жакет с красным кашемировым поясом
  portraitWhiteClose: "/public/image/portraitWhiteClose.jpg", // Крупный портрет в молочном жакете с серьгами
  portraitShowroomBW: "/public/image/pol-grey.jpg", // Ч/Б на белом диване на фоне рейлов
  portraitWhiteSuit: "/public/image/portraitWhiteSuit.jpg", // В белом костюме с длинным шарфом на стуле
  portraitDarkCoat: "/public/image/portraitDarkCoat.jpg", // В темном оверсайз-пальто в интерьере с диваном
  portraitTopDown: "/public/image/portraitTopDown.jpg", // Сверху вниз на черном кожаном диване в лодочках

  // Женские образы (Примерочные и стайлинг клиентов)
  lookCoatRedBag: "/public/image/lookCoatRedBag.jpg", // Коричневое пальто с шарфом + красная сумка и туфли
  lookBlueShirtRedBag: "/public/image/lookBlueShirtRedBag.jpg", // Голубая полосатая рубашка на запах + красная сумка
  lookYellowKnitGloves: "/public/image/lookYellowKnitGloves.jpg", // Бежевый бомбер, желтый джемпер на плечах, голубые перчатки
  lookTweedJacketSkirt: "/public/image/lookTweedJacketSkirt.jpg", // Укороченный фактурный жакет, голубая рубашка, юбка с разрезом
  lookCheckBlazerCulottes: "/public/image/lookCheckBlazerCulottes.jpg", // Клетчатый блейзер, джинсовка, бордо и кюлоты
  lookSuedeCoatMannequin: "/public/image/lookSuedeCoatMannequin.jpg", // Замшевое шоколадное пальто и молочный трикотаж
  lookBlueTurtleneckSkirt: "/public/image/lookBlueTurtleneckSkirt.jpg", // Синяя водолазка в рубчик + светлая юбка с ремнем
  lookWinterPufferPink: "/public/image/lookWinterPufferPink.jpg", // Светлый пуховик, горчичный шарф, розовый свитер

  // Мужские капсулы (Коллажи из портфолио)
  mensLookCasual: "/public/image/mensLookCasual.jpg", // Мужская капсула: клетчатая рубашка, синий пуховик, ботинки
  mensLookClassic: "/public/image/mensLookClassic.jpg", // Мужская капсула: серое пальто, кожаная сумка, бордовые носки

  // Детали, фактуры и эстетика (Moodboard)
  detailHandBagJjoir: "/public/image/detailHandBagJjoir.jpg", // Рука с черной сумкой JJOIR и бордовые колготки
  detailKnitStack: "/public/image/detailKnitStack.jpg", // Стопка свитеров (бордо, голубой, молочный) и книга Aesthetic
  detailKinfolkBook: "/public/image/detailKinfolkBook.jpg", // Книга The Kinfolk Home и керамическая пиала с кольцами
  detailBurgundyBagBook: "/public/image/detailBurgundyBagBook.jpg", // Бордовая сумка, очки и пальто на кожаной кушетке
  detailBoucleChairBag: "/public/image/detailBoucleChairBag.jpg", // Кресло букле, бордовый плед, голубая сумка и очки
  detailRackShirts: "/public/image/detailRackShirts.jpg", // Плечики: бордовый свитер, голубая и белая рубашки
  detailBlueHeelsConcrete: "/public/image/detailBlueHeelsConcrete.jpg", // Вид сверху: голубые туфли с белыми брюками
  detailBlueBootsCream: "/public/image/detailBlueBootsCream.jpg", // Мягкие голубые ботильоны в молочном пальто
  detailBurgundyMules: "/public/image/detailBurgundyMules.jpg", // Винные лаковые мюли на ступеньке
  detailGreyCardiganBrooch: "/public/image/detailGreyCardiganBrooch.jpg", // Серый кардиган со скульптурной серебряной брошью
  detailLatrikaBags: "/public/image/detailLatrikaBags.jpg", // Белые шопинг-пакеты LATRIKA с черными лентами

  // --- ОРИГИНАЛЫ ОТЗЫВОВ И ОБРАЗОВ КЛИЕНТОК (ДЛЯ КАРТОЧЕК И МОДАЛКИ) ---
  reviewStoryYellowTrench: "/public/image/clientYellowTrench.jpg", // Сторис @deepstacia в желтом тренче
  reviewStoryBeigeSuit: "/public/image/reviewStoryBeigeSuit.jpg", // Клиентка в бежевом костюме с черным ремнем + текст про лукбук на 3 года
  reviewStoryStreetFriend: "/public/image/reviewStoryStreetFriend.jpg", // Сторис «Поля, ты знак качества! Еду в машине, а по тротуару идет женщина...»
  reviewStoryMensStyle: "/public/image/reviewStoryMensStyle.jpg", // Сторис «Отзыв о мужской консультации по стилю» на фоне мужского магазина
  reviewStoryGoldenDress: "/public/image/reviewStoryGoldenDress.jpg", // Сторис на фоне золотистого платья «Работа с тобой - часть психотерапии»
  reviewStoryWardrobe4h: "/public/image/reviewStoryWardrobe4h.jpg",
};

// ============================================================================
// 3. СТРУКТУРИРОВАННЫЕ ДАННЫЕ САЙТА
// ============================================================================

const MOOD_STRIP_DATA: MoodItem[] = [
  {
    id: "m-1",
    code: "ARCHIVE // 01",
    caption: "Тактильность: кашемир, шёлк и кожа",
    imageUrl: PHOTOS.detailKnitStack,
    rotationClass: "-rotate-1",
  },
  {
    id: "m-2",
    code: "ARCHIVE // 02",
    caption: "Форма и точка опоры",
    imageUrl: PHOTOS.detailBlueHeelsConcrete,
    rotationClass: "rotate-1",
  },
  {
    id: "m-3",
    code: "ARCHIVE // 03",
    caption: "A Life More Conscious",
    imageUrl: PHOTOS.detailKinfolkBook,
    rotationClass: "-rotate-1",
  },
  {
    id: "m-4",
    code: "ARCHIVE // 04",
    caption: "Драпировка и скульптурный металл",
    imageUrl: PHOTOS.detailGreyCardiganBrooch,
    rotationClass: "rotate-1",
  },
  {
    id: "m-5",
    code: "ARCHIVE // 05",
    caption: "Глубокий винный и тёплый шерстяной ворс",
    imageUrl: PHOTOS.detailBurgundyBagBook,
    rotationClass: "-rotate-1",
  },
  {
    id: "m-6",
    code: "ARCHIVE // 06",
    caption: "Палитра рейла: бордо, небесный, слоновая кость",
    imageUrl: PHOTOS.detailRackShirts,
    rotationClass: "rotate-1",
  },
];

const WORKS_DATA: WorkItem[] = [
  {
    id: "w-1",
    index: "LOOK 01",
    title: "Скульптурное пальто с шарфом и красные акценты",
    category: "womenswear",
    categoryLabel: "Женский образ / Верхняя одежда",
    description:
      "Мягкая геометрия бежево-таупового пальто со встроенным шарфом и широкими брюками, собранная вокруг смелого дуэта красной сумки и остроносых лодочек.",
    stylistNote:
      "Красный здесь работает как доминанта, превращая спокойную базу в запоминающийся выход.",
    imageUrl: PHOTOS.lookCoatRedBag,
    layoutClass: "md:col-span-7",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: "w-2",
    index: "LOOK 02",
    title: "Деконструкция классики: голубая сорочка на запах",
    category: "womenswear",
    categoryLabel: "Деловой гардероб",
    description:
      "Полосатая рубашка сложного кроя с акцентной металлической пуговицей, широкие серые брюки со складками и рифма красных деталей.",
    stylistNote:
      "Одна и та же акцентная сумка и обувь легко переходят из пальто в деловой образ внутри капсулы.",
    imageUrl: PHOTOS.lookBlueShirtRedBag,
    layoutClass: "md:col-span-5",
    aspectClass: "aspect-[3/4]",
    offsetClass: "md:mt-16",
  },
  {
    id: "w-3",
    index: "LOOK 03",
    title: "Игра цвета: лимонный трикотаж, небесная кожа и бордо",
    category: "capsules",
    categoryLabel: "Сложная палитра",
    description:
      "Утончённое сочетание светлой куртки, лимонного джемпера на плечах с брошью, голубых кожаных перчаток и фактурных бордовых джинсов.",
    stylistNote:
      "Иллюстрация того, как историк моды работает с неочевидными цветовыми триадами.",
    imageUrl: PHOTOS.lookYellowKnitGloves,
    layoutClass: "md:col-span-5",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "w-4",
    index: "LOOK 04",
    title: "Архитектурный жакет, голубая манжета и разрез",
    category: "womenswear",
    categoryLabel: "Шопинг-сопровождение",
    description:
      "Укороченный жакет из фактурной шерсти поверх голубой рубашки, юбка миди шоколадного оттенка и лодочки slingback.",
    stylistNote:
      "Выверенная пропорция укороченного верха и удлинённой вертикали юбки.",
    imageUrl: PHOTOS.lookTweedJacketSkirt,
    layoutClass: "md:col-span-7",
    aspectClass: "aspect-[4/5]",
    offsetClass: "md:mt-12",
  },
  {
    id: "w-5",
    index: "LOOK 05",
    title: "Мужская городская капсула: фактурное пальто и бургунди",
    category: "menswear",
    categoryLabel: "Мужской гардероб",
    description:
      "Структурное графитовое пальто, трикотаж на молнии, кожаная дорожная сумка и тонкий штрих - бордовые носки в мелкий горох.",
    stylistNote:
      "Мужской стиль строится на нюансах фактур и безупречной посадке базовых слоёв.",
    imageUrl: PHOTOS.mensLookClassic,
    layoutClass: "md:col-span-6",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: "w-6",
    index: "LOOK 06",
    title: "Мужской смарт-кэжуал: клетка, деним и функциональность",
    category: "menswear",
    categoryLabel: "Мужской гардероб",
    description:
      "Тёплая рубашка в мелкую клетку, вельветовые брюки песочного оттенка, тёмно-синий пуховик и замшевые хайкеры.",
    stylistNote:
      "Готовый конструктор в электронном лукбуке, с которым мужчина тратит минимум времени в магазине.",
    imageUrl: PHOTOS.mensLookCasual,
    layoutClass: "md:col-span-6",
    aspectClass: "aspect-[4/5]",
    offsetClass: "md:mt-14",
  },
  {
    id: "w-7",
    index: "LOOK 07",
    title: "Интеллектуальная многослойность: клетка, деним и охра",
    category: "capsules",
    categoryLabel: "Разбор гардероба",
    description:
      "Клетчатый двубортный блейзер, надетый поверх джинсовой рубашки и винной водолазки с широкими кюлотами цвета карамели.",
    stylistNote:
      "Три слоя верха создают глубину и позволяют трансформировать образ в течение дня.",
    imageUrl: PHOTOS.lookCheckBlazerCulottes,
    layoutClass: "md:col-span-4",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "w-8",
    index: "LOOK 08",
    title: "Шоколадная замша и молочный трикотаж",
    category: "details",
    categoryLabel: "Фактуры сезона",
    description:
      "Благородный контраст матовой тёмно-коричневой замши длинного тренча и мягкого трикотажного комплекта оттенка сливочного масла.",
    stylistNote:
      "Тихая роскошь, построенная исключительно на разнице поверхностей.",
    imageUrl: PHOTOS.lookSuedeCoatMannequin,
    layoutClass: "md:col-span-4",
    aspectClass: "aspect-[3/4]",
    offsetClass: "md:mt-10",
  },
  {
    id: "w-9",
    index: "LOOK 09",
    title: "Глубокий кобальт и песочная миди",
    category: "capsules",
    categoryLabel: "Капсула на сезон",
    description:
      "Фактурная синяя водолазка в рубчик с кулоном-ключом, светлая юбка с высоким разрезом, широкий коньячный ремень и замшевые сапоги.",
    stylistNote:
      "Идеальный баланс тёплого и холодного спектра в одном силуэте.",
    imageUrl: PHOTOS.lookBlueTurtleneckSkirt,
    layoutClass: "md:col-span-4",
    aspectClass: "aspect-[3/4]",
  },
];

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "shopping",
    index: "01",
    title: "Шопинг-сопровождение",
    price: "60 000 ₽",
    format: "Онлайн / офлайн",
    description:
      "Подберём одежду под ваши задачи, образ жизни и бюджет. Разберёмся, какие вещи нужны, что с чем сочетать и на что обращать внимание в магазине.",
    result:
      "Вы получите помощь с выбором вещей и чёткое понимание, как вписать покупки в свой гардероб.",
    previewImg: PHOTOS.detailLatrikaBags,
  },
  {
    id: "wardrobe-audit",
    index: "02",
    title: "Разбор гардероба",
    price: "40 000 ₽",
    format: "Онлайн / офлайн",
    description:
      "Разберём вещи, которые у вас уже есть, посмотрим, какие сочетания можно собрать, чего не хватает и что стоит изменить.",
    result:
      "В результате станет понятнее, как пользоваться своим гардеробом и какие покупки действительно нужны.",
    previewImg: PHOTOS.detailRackShirts,
  },
  {
    id: "consultation",
    index: "03",
    title: "Консультация по стилю",
    price: "20 000 ₽",
    format: "Онлайн / офлайн",
    description:
      "Разбор запроса. Анализ фигуры и определение подходящих цветов и типов одежды. Обсуждаем стиль, цвета, фасоны и детали.",
    result:
      "Понимание своих сильных сторон и инструментов, которые помогают создавать нужное впечатление.",
    previewImg: PHOTOS.detailBoucleChairBag,
  },
  {
    id: "coaching",
    index: "04",
    title: "Фэшн-коучинг",
    price: "5 000 ₽ / час",
    format: "Минимум 3 коуч-сессии",
    description:
      "Для тех, кто хочет разобраться в отношениях со своим гардеробом и найти стиль, в котором будет комфортно жить и работать.",
    result:
      "Вместе исследуем, как вы хотите выглядеть, какое впечатление производить и что сейчас мешает прийти к желаемому образу.",
    previewImg: PHOTOS.detailKinfolkBook,
  },
];

const REVIEWS_DATA: ReviewItem[] = [
  {
    id: "r-1",
    code: "CASE FILE // 01",
    category: "shopping",
    tag: "Шопинг как терапия",
    author: "История о жёлтом тренче (@deepstacia)",
    highlight:
      "Шопинг с Полиной стал для меня терапией, которая невероятно раскрыла меня!",
    quote:
      "«С 2019 года хотела купить себе классный тренч, но не бежевый - хотелось чего-то особенного. И вот на мне мой уютнейший жёлтый тренч! Многие страхи по поводу одежды и внешности ушли именно после работы с Полиной. Сейчас ощущаю себя на 100500% красивой и уверенной!»",
    dateNote: "Шопинг-сопровождение + Капсула",
    proofImage: PHOTOS.reviewStoryYellowTrench,
    proofCaption: "Образ @deepstacia в жёлтом тренче и история из сторис",
  },
  {
    id: "r-2",
    code: "CASE FILE // 02",
    category: "wardrobe",
    tag: "Стильный лукбук на 3 года",
    author: "Клиентка о готовой системе образов",
    highlight:
      "На выбор образа уходит меньше минуты - весь результат оформлен в виде стильного лукбука.",
    quote:
      "«Нет необходимости запоминать каждый образ, что с чем носить и как надевать - всё разделено на категории. Образы собраны максимально из имеющегося гардероба, докупить нужно было минимум. Ощущение по итогу, что образов хватит года на 3!»",
    dateNote: "Разбор гардероба + Онлайн-шопинг",
    proofImage: PHOTOS.reviewStoryBeigeSuit,
    proofCaption: "Образ клиентки в бежевом костюме и оригинал отзыва",
  },
  {
    id: "r-3",
    code: "CASE FILE // 03",
    category: "shopping",
    tag: "Взгляд со стороны",
    author: "История из жизни клиента",
    highlight: "Поля, ты - знак качества! Твои клиенты выделяются из толпы.",
    quote:
      "«Еду в машине, а по тротуару идёт женщина - она даже плывёт, а не идёт... Такой на ней красивый летящий костюм, очень выделяется среди остальных. Я смотрю, аж глаз не оторвать, а потом понимаю, что это моя ближайшая подруга, которую одеваешь ты!»",
    dateNote: "Персональный стайлинг",
    proofImage: PHOTOS.reviewStoryStreetFriend,
    proofCaption: "Оригинал сообщения из Директа Полины",
  },
  {
    id: "r-4",
    code: "CASE FILE // 04",
    category: "mens",
    tag: "Мужской гардероб",
    author: "Отзыв о мужской консультации по стилю",
    highlight:
      "Использую электронный лукбук прямо в магазине при выборе одежды - очень удобно!",
    quote:
      "«Ты провела для меня консультацию, исходя из физических характеристик моего тела и цвета кожи, очень круто подобрала цвета и луки. Очень благодарен за то, что сопроводила мои первые покупки в формате онлайн. Рекомендую друзьям!»",
    dateNote: "Мужская консультация + Онлайн-сопровождение",
    proofImage: PHOTOS.reviewStoryMensStyle,
    proofCaption: "Оригинал отзыва о мужской консультации",
  },
  {
    id: "r-5",
    code: "CASE FILE // 05",
    category: "coaching",
    tag: "Глубина и психология",
    author: "Отзыв о перевоплощении и ценностях",
    highlight:
      "Не просто собрать гардероб под цели, а помочь присвоить свою неповторимость.",
    quote:
      "«Ты не боишься выйти за рамки и предложить нетривиальные решения. Все инструкции - чётко и по делу, ты сэкономила мне массу времени, нервов и денег. Мне понравилось, что ты глубоко узнаёшь цели и ценности человека. Работа с тобой - часть психотерапии!»",
    dateNote: "Комплексная работа со стилем",
    proofImage: PHOTOS.reviewStoryGoldenDress,
    proofCaption: "Образ в золотистом платье и оригинал отзыва",
  },
  {
    id: "r-6",
    code: "CASE FILE // 06",
    category: "wardrobe",
    tag: "Разбор гардероба",
    author: "Впечатления после 4-часового разбора",
    highlight:
      "Теперь факт, что у меня много одежды, не пугает, а вызывает предвкушение!",
    quote:
      "«Я как будто с подругой провела 4 часа за классной беседой - ты не давишь, не ставишь жёстких рамок, но очень бережно направляешь. Я даже не думала, что из моих вещей и обуви можно собрать столько стильных луков. Разбор меня прямо окрылил!»",
    dateNote: "Ревизия гардероба",
    proofImage: PHOTOS.reviewStoryWardrobe4h,
    proofCaption: "Скриншот сообщения после 4-часового разбора гардероба",
  },
];

// ============================================================================
// 4. ДЕКОРАТИВНЫЕ КАНЦЕЛЯРСКИЕ ЭЛЕМЕНТЫ
// ============================================================================

const BinderClip: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 44 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-7 h-11 pointer-events-none select-none drop-shadow-md ${className}`}
    aria-hidden="true"
  >
    <rect x="6" y="2" width="32" height="24" rx="2" fill="#181818" />
    <line x1="6" y1="9" x2="38" y2="9" stroke="#4B4B4B" strokeWidth="1.2" />
    <path
      d="M14 26L9 59C8.5 62 11 64 14 64H30C33 64 35.5 62 35 59L30 26"
      stroke="#5A5A5A"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const PaperClip: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 28 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-14 pointer-events-none select-none drop-shadow-xs ${className}`}
    aria-hidden="true"
  >
    <path
      d="M19 18V56C19 61.5228 14.5228 66 9 66C3.47715 66 2 61.5228 2 56V14C2 6.8203 7.8203 2 14 2C20.1797 2 25 6.8203 25 14V52"
      stroke="#787570"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const ArchiveRingsDivider: React.FC = () => (
  <div
    className="relative w-full py-10 flex items-center justify-between max-w-5xl mx-auto px-10 select-none"
    aria-hidden="true"
  >
    <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-300/90" />
    {[0, 1, 2].map((idx) => (
      <div key={idx} className="relative z-10 flex flex-col items-center px-4">
        <div className="w-3.5 h-3.5 rounded-full border border-neutral-500 bg-neutral-200 shadow-inner" />
        <div className="w-1.5 h-9 bg-gradient-to-b from-neutral-800 via-neutral-400 to-neutral-800 rounded-full -my-1.5 shadow-sm" />
        <div className="w-3.5 h-3.5 rounded-full border border-neutral-500 bg-neutral-200 shadow-inner" />
      </div>
    ))}
  </div>
);

// ============================================================================
// 5. ГЛАВНЫЙ КОМПОНЕНТ САЙТА
// ============================================================================

export const App: React.FC = () => {
  const [introState, setIntroState] = useState<
    "holding" | "tossing" | "hidden"
  >("holding");
  const [isColorAwakened, setIsColorAwakened] = useState<boolean>(false);

  const [workFilter, setWorkFilter] = useState<WorkCategory>("all");
  const [reviewFilter, setReviewFilter] = useState<ReviewCategory>("all");

  // Модальные окна для работ и для полноразмерного просмотра скриншотов отзывов
  const [activeWorkModal, setActiveWorkModal] = useState<WorkItem | null>(null);
  const [activeReviewModal, setActiveReviewModal] = useState<ReviewItem | null>(
    null,
  );

  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [hoveredServiceId, setHoveredServiceId] = useState<string>(
    SERVICES_DATA[0].id,
  );
  const [formState, setFormState] = useState<FormState>({
    name: "",
    contact: "",
    service: SERVICES_DATA[0].title,
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const worksRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const tossTimer = window.setTimeout(() => setIntroState("tossing"), 1050);
    const hideTimer = window.setTimeout(() => setIntroState("hidden"), 1850);
    return () => {
      window.clearTimeout(tossTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const section = worksRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsColorAwakened(true);
          } else if (entry.boundingClientRect.top > 350) {
            setIsColorAwakened(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const visibleWorks = useMemo(() => {
    if (workFilter === "all") return WORKS_DATA;
    return WORKS_DATA.filter((w) => w.category === workFilter);
  }, [workFilter]);

  const visibleReviews = useMemo(() => {
    if (reviewFilter === "all") return REVIEWS_DATA;
    return REVIEWS_DATA.filter((r) => r.category === reviewFilter);
  }, [reviewFilter]);

  const activeServicePreview = useMemo(() => {
    return (
      SERVICES_DATA.find((s) => s.id === hoveredServiceId) || SERVICES_DATA[0]
    );
  }, [hoveredServiceId]);

  const handleBookService = useCallback((serviceTitle: string) => {
    setFormState((prev) => ({ ...prev, service: serviceTitle }));
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.contact.trim()) return;
    setFormSubmitted(true);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-1000 ease-out selection:bg-neutral-900 selection:text-white ${
        isColorAwakened
          ? "bg-[#F5F0E8] text-[#191715]"
          : "bg-[#EFEFEE] text-[#151515]"
      }`}
    >
      {/* =====================================================================
          КИНЕМАТОГРАФИЧНОЕ ИНТРО
      ===================================================================== */}
      {introState !== "hidden" && (
        <div
          onClick={() => setIntroState("hidden")}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#E8E8E6] px-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
            introState === "tossing"
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-neutral-500 mb-8">
            PERSONAL STYLING &amp; FASHION HISTORY ARCHIVE
          </div>

          <div className="relative w-60 sm:w-72 aspect-[4/5]">
            <div className="absolute inset-0 bg-white p-3 border border-neutral-300 shadow-lg rotate-3 scale-95">
              <img
                src={PHOTOS.portraitTopDown}
                alt=""
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>

            <div
              className={`relative z-10 w-full h-full bg-white p-3.5 border border-neutral-300 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                introState === "tossing"
                  ? "-translate-y-36 -rotate-12 scale-105 opacity-0"
                  : "translate-y-0 -rotate-2 scale-100 opacity-100"
              }`}
            >
              <img
                src={PHOTOS.detailHandBagJjoir}
                alt="Polina Shurupova Archive"
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="mt-2.5 flex justify-between text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                <span>OBJECT N° 01</span>
                <span>JJOIR / ARCHIVE</span>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="font-serif text-2xl tracking-[0.18em] uppercase text-neutral-900">
              Полина Шурупова
            </p>
            <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
              Стилист и историк моды
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
          ШАПКА САЙТА
      ===================================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-neutral-300/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl tracking-[0.15em] uppercase text-neutral-900">
              Polina Shurupova
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-neutral-500 -mt-1">
              Stylist &amp; Costume Historian
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono uppercase tracking-[0.18em]">
            <a
              href="#about"
              className="hover:text-neutral-500 transition-colors"
            >
              01 / О себе
            </a>
            <a
              href="#works"
              className="hover:text-neutral-500 transition-colors flex items-center gap-2"
            >
              <span>02 / Лукбук работ</span>
              <span
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  isColorAwakened ? "bg-red-700 scale-125" : "bg-neutral-400"
                }`}
                title="Индикатор пробуждения цвета"
              />
            </a>
            <a
              href="#services"
              className="hover:text-neutral-500 transition-colors"
            >
              03 / Услуги и прайс
            </a>
            <a
              href="#reviews"
              className="hover:text-neutral-500 transition-colors"
            >
              04 / Истории клиентов
            </a>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.2em] border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              [ Обсудить гардероб ]
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="lg:hidden px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest border border-neutral-400"
          >
            {mobileNavOpen ? "Закрыть" : "Меню"}
          </button>
        </div>

        {mobileNavOpen && (
          <nav className="lg:hidden border-b border-neutral-300 bg-[#F3F2EE] px-6 py-6 flex flex-col gap-4 text-xs font-mono uppercase tracking-[0.2em]">
            <a href="#about" onClick={() => setMobileNavOpen(false)}>
              01 / О себе и метод
            </a>
            <a href="#works" onClick={() => setMobileNavOpen(false)}>
              02 / Лукбук работ (Женские и мужские)
            </a>
            <a href="#services" onClick={() => setMobileNavOpen(false)}>
              03 / Услуги и прайс
            </a>
            <a href="#reviews" onClick={() => setMobileNavOpen(false)}>
              04 / Отзывы клиентов
            </a>
            <a
              href="#contact"
              onClick={() => setMobileNavOpen(false)}
              className="py-3 bg-neutral-900 text-white text-center"
            >
              Записаться на консультацию
            </a>
          </nav>
        )}
      </header>

      {/* =====================================================================
          БЛОК 1. ПЕРВЫЙ ЭКРАН (HERO) - ИСПРАВЛЕНО ПЕРЕКРЫТИЕ ТЕКСТА ПОЛАРОИДОМ!
      ===================================================================== */}
      <section
        id="top"
        className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-24 lg:py-20 overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 border-b border-neutral-300 pb-3 mb-12 gap-2">
          <span>FILE N° 2026 / PERSONAL STYLE &amp; COSTUME ARCHIVE</span>
          <span>ЖЕНСКИЕ И МУЖСКИЕ ГАРДЕРОБЫ • ОНЛАЙН / ОФЛАЙН</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Левая часть: Типографика и манифест (6 колонок) */}
          <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white border border-neutral-300 text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-700 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
              <span>Стилист и историк моды • 7 лет в профессии</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl leading-[1.03] tracking-tight text-neutral-900 font-normal">
                Полина <br />
                <span className="italic font-light">Шурупова</span>
              </h1>
            </div>

            <p className="text-base sm:text-xl text-neutral-800 leading-relaxed max-w-xl font-light">
              Помогаю разобраться в своём стиле, собрать гардероб под свою жизнь
              и понять, как одежда меняет впечатление о нас.
            </p>

            <div className="relative bg-white/80 border border-neutral-300 p-5 max-w-lg shadow-2xs">
              <PaperClip className="absolute -top-4 right-6" />
              <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-neutral-400 mb-1.5">
                МЕТОД ИСТОРИКА КОСТЮМА:
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                Изучаю историю костюма и объясняю, как через цвет, форму и
                детали можно рассказать о себе без слов - в женском и мужском
                гардеробе.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-[0.22em] text-center hover:bg-neutral-800 transition-colors"
              >
                Обсудить гардероб
              </a>
              <a
                href="#works"
                className="px-8 py-4 bg-white border border-neutral-900 text-neutral-900 text-xs font-mono uppercase tracking-[0.22em] text-center hover:bg-neutral-100 transition-colors"
              >
                Смотреть лукбук ↓
              </a>
            </div>
          </div>

          {/* Правая часть: Многослойный коллаж БЕЗ перекрытия подписей (6 колонок) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            {/* Задаём левый и нижний отступ контейнеру, чтобы мини-полароид не залезал на текст */}
            <div className="relative mx-auto max-w-md lg:max-w-lg sm:pl-14 sm:pb-12">
              {/* Основной лист: Полина в сером жакете с красным поясом */}
              <div className="relative z-10 bg-white p-4 sm:p-5 border border-neutral-300 shadow-[0_25px_60px_rgba(0,0,0,0.08)] group">
                <BinderClip className="absolute -top-6 left-10 z-30" />

                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                  <img
                    src={PHOTOS.heroRedBelt}
                    alt="Полина Шурупова в сером жакете с красным поясом"
                    className={`w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-103 ${
                      isColorAwakened
                        ? "grayscale-0 contrast-100"
                        : "grayscale contrast-115 group-hover:grayscale-0"
                    }`}
                  />
                  {/* Бейдж перенесен в правый верхний угол, чтобы никогда не пересекаться с мини-портретом */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-900 border border-neutral-300 shadow-xs">
                    НАВЕДИТЕ ДЛЯ ЦВЕТА
                  </div>
                </div>

                {/* Подпись сдвинута в правую часть с отступом под полароид */}
                <div className="mt-3.5 pt-2.5 border-t border-neutral-200 flex items-center justify-end gap-4 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500 sm:pl-28">
                  <span>#01 / SILHOUETTE &amp; ACCENT</span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-neutral-800">POLINA SHURUPOVA</span>
                </div>
              </div>

              {/* Второй полароид: аккуратно выступает слева снизу, не закрывая текст */}
              <div className="hidden sm:block absolute bottom-0 left-0 z-20 w-40 md:w-44 bg-white p-2.5 border border-neutral-300 shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img
                    src={PHOTOS.portraitWhiteClose}
                    alt="Портрет Полины Шуруповой крупным планом"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="mt-2 text-[8px] font-mono uppercase tracking-widest text-neutral-500 text-center">
                  #02 / EDITORIAL CLOSE-UP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ArchiveRingsDivider />

      {/* =====================================================================
          БЛОК 2. О СЕБЕ И ЭКСПЕРТНОСТЬ
      ===================================================================== */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24"
      >
        <div className="bg-white border border-neutral-300 p-6 sm:p-12 lg:p-16 shadow-xs relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200 pb-6 mb-12 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                SECTION 01 // BIOGRAPHY &amp; METHOD
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl tracking-tight font-normal">
                Одежда как визуальная биография
              </h2>
            </div>
            <div className="px-3.5 py-1.5 bg-neutral-100 border border-neutral-300 text-[10px] font-mono uppercase tracking-[0.2em]">
              Женские и мужские гардеробы
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="relative bg-[#FAF9F6] p-3 border border-neutral-200 shadow-sm">
                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                  <img
                    src={PHOTOS.portraitShowroomBW}
                    alt="Полина Шурупова в шоуруме"
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-115"
                  />
                </div>
                <div className="mt-2.5 flex justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                  <span>FIG. 01 - SHOWROOM PRACTICE</span>
                  <span>ARCHIVE BW</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF9F6] p-2 border border-neutral-200">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={PHOTOS.portraitWhiteSuit}
                      alt="Полина в белом костюме"
                      loading="lazy"
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isColorAwakened
                          ? "grayscale-0"
                          : "grayscale hover:grayscale-0"
                      }`}
                    />
                  </div>
                  <span className="block mt-1.5 text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                    FIG. 02 - WHITE SUIT
                  </span>
                </div>

                <div className="bg-[#FAF9F6] p-2 border border-neutral-200 mt-4">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={PHOTOS.portraitDarkCoat}
                      alt="В темном оверсайз-пальто в интерьере"
                      loading="lazy"
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isColorAwakened
                          ? "grayscale-0"
                          : "grayscale hover:grayscale-0"
                      }`}
                    />
                  </div>
                  <span className="block mt-1.5 text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                    FIG. 03 - ATELIER MOOD
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-neutral-200 pb-8">
                <div className="p-5 bg-[#FAF9F6] border border-neutral-200 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    ОПЫТ
                  </span>
                  <div className="font-serif text-3xl xl:text-4xl text-neutral-900 mt-2">
                    7 лет
                  </div>
                  <div className="mt-1 text-xs text-neutral-600 leading-snug">
                    непрерывной практики персональным стилистом
                  </div>
                </div>

                <div className="p-5 bg-[#FAF9F6] border border-neutral-200 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    АУДИТОРИЯ
                  </span>
                  <div className="font-serif text-2xl xl:text-3xl text-neutral-900 mt-2 leading-tight">
                    Женский &amp; Мужской
                  </div>
                  <div className="mt-1 text-xs text-neutral-600 leading-snug">
                    персональный стайлинг и деловые капсулы
                  </div>
                </div>

                <div className="p-5 bg-[#FAF9F6] border border-neutral-200 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    ФУНДАМЕНТ
                  </span>
                  <div className="font-serif text-2xl xl:text-3xl text-neutral-900 mt-2 leading-tight">
                    История моды
                  </div>
                  <div className="mt-1 text-xs text-neutral-600 leading-snug">
                    работа с силуэтом, цветом и контекстом костюма
                  </div>
                </div>
              </div>

              <div className="space-y-5 text-neutral-700 leading-relaxed text-base">
                <p className="font-serif text-xl sm:text-2xl text-neutral-900 italic leading-snug">
                  «Когда вы понимаете логику кроя, цвета и своих пропорций,
                  утренний выбор одежды занимает меньше минуты и приносит
                  удовольствие».
                </p>
                <p>
                  В основе моей работы лежит соединение двух дисциплин:{" "}
                  <strong>практического стайлинга</strong> и{" "}
                  <strong>истории костюма</strong>. Любая деталь - ширина
                  лацкана, плотность шерсти, оттенок бордового или форма мыса
                  обуви - считывается окружающими быстрее слов.
                </p>
                <p>
                  Мы не гонимся за однодневными трендами и не ломаем вашу
                  индивидуальность. Вместо этого мы создаём структурированную
                  систему вещей (с готовым электронным лукбуком-шпаргалкой),
                  которая отражает ваш масштаб, характер и образ жизни.
                </p>
              </div>

              <div className="bg-[#FAF9F6] border border-neutral-200 p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                  ЧТО МЕНЯЕТСЯ ПОСЛЕ СОВМЕСТНОЙ РАБОТЫ:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-neutral-800">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-neutral-400">01/</span>
                    <span>
                      Уходит страх перед магазинами и спонтанными тратами
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-neutral-400">02/</span>
                    <span>
                      Вещи из текущего гардероба складываются в новые луки
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-neutral-400">03/</span>
                    <span>
                      Появляется наглядный лукбук на телефоне под любую задачу
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-neutral-400">04/</span>
                    <span>
                      Точное знание своих цветов, фасонов и сильных сторон
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ТАКТИЛЬНАЯ ПОЛОСА ФАКТУР (MOODBOARD STRIP)
      ===================================================================== */}
      <section className="py-10 overflow-hidden border-t border-b border-neutral-300/80 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          <span>VISUAL RESEARCH // TEXTURES, OBJECTS &amp; COLOR PALETTE</span>
          <span>НАВЕДИТЕ НА КАРТОЧКУ</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {MOOD_STRIP_DATA.map((item) => (
            <div
              key={item.id}
              className={`bg-white p-2.5 border border-neutral-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ${item.rotationClass}`}
            >
              <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isColorAwakened
                      ? "grayscale-0"
                      : "grayscale hover:grayscale-0"
                  }`}
                />
              </div>
              <div className="mt-2">
                <div className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                  {item.code}
                </div>
                <p className="text-[11px] font-serif text-neutral-800 leading-tight mt-0.5">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          БЛОК 3. ПОРТФОЛИО И ЛУКБУК (АСИММЕТРИЧНАЯ ЖУРНАЛЬНАЯ СЕТКА)
      ===================================================================== */}
      <section
        id="works"
        ref={worksRef}
        className="max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28 transition-colors duration-1000"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 border-b border-neutral-300 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full transition-colors duration-700 ${
                  isColorAwakened
                    ? "bg-red-700 animate-pulse"
                    : "bg-neutral-400"
                }`}
              />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
                {isColorAwakened
                  ? "COLOR AWAKENED // ЖИВАЯ ПАЛИТРА РАБОТ И КАПСУЛ"
                  : "SECTION 02 // EDITORIAL LOOKBOOK"}
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight font-normal">
              Портфолио: образы и капсулы
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "Все образы (9)" },
                { id: "womenswear", label: "Женские образы" },
                { id: "menswear", label: "Мужские капсулы" },
                { id: "capsules", label: "Сложный цвет" },
                { id: "details", label: "Фактуры" },
              ] as { id: WorkCategory; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setWorkFilter(tab.id)}
                className={`px-4 py-2 text-[11px] font-mono uppercase tracking-[0.16em] border transition-all cursor-pointer ${
                  workFilter === tab.id
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                    : "bg-white/80 text-neutral-700 border-neutral-300 hover:border-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
          {visibleWorks.map((work) => (
            <article
              key={work.id}
              onClick={() => setActiveWorkModal(work)}
              className={`group cursor-pointer bg-white p-5 sm:p-6 border border-neutral-300/90 shadow-xs hover:shadow-2xl transition-all duration-500 relative ${work.layoutClass} ${
                work.offsetClass || ""
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100 pb-3 mb-4">
                <span className="text-neutral-900 font-medium">
                  {work.index}
                </span>
                <span>{work.categoryLabel}</span>
              </div>

              <div
                className={`relative w-full ${work.aspectClass} overflow-hidden bg-neutral-100 mb-5`}
              >
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-104 ${
                    isColorAwakened
                      ? "grayscale-0 contrast-100"
                      : "grayscale contrast-115"
                  }`}
                />
                <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity">
                  [ Открыть разбор + ]
                </div>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 leading-snug group-hover:underline underline-offset-4">
                {work.title}
              </h3>
              <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
                {work.description}
              </p>

              <div className="mt-4 pt-3.5 border-t border-neutral-200/80 flex items-start justify-between gap-4">
                <p className="text-xs text-neutral-500 italic font-serif">
                  «{work.stylistNote}»
                </p>
                <span className="text-xs font-mono text-neutral-800 shrink-0 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Модальное окно детального просмотра работы */}
      {activeWorkModal && (
        <div
          onClick={() => setActiveWorkModal(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] border border-neutral-300 max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl max-h-[90vh]"
          >
            <div className="md:col-span-6 bg-neutral-100 max-h-[55vh] md:max-h-[85vh] overflow-hidden">
              <img
                src={activeWorkModal.imageUrl}
                alt={activeWorkModal.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-6 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-200 pb-3">
                  <span>{activeWorkModal.index}</span>
                  <button
                    type="button"
                    onClick={() => setActiveWorkModal(null)}
                    className="text-neutral-900 hover:underline cursor-pointer"
                  >
                    [ ЗАКРЫТЬ × ]
                  </button>
                </div>
                <span className="inline-block mt-5 text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-neutral-200/80">
                  {activeWorkModal.categoryLabel}
                </span>
                <h3 className="mt-3 font-serif text-2xl sm:text-3xl text-neutral-900">
                  {activeWorkModal.title}
                </h3>
                <p className="mt-4 text-sm text-neutral-700 leading-relaxed">
                  {activeWorkModal.description}
                </p>
                <div className="mt-6 p-4 bg-white border border-neutral-200">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                    Комментарий Полины:
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 italic font-serif">
                    {activeWorkModal.stylistNote}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveWorkModal(null);
                  handleBookService(SERVICES_DATA[0].title);
                }}
                className="mt-8 w-full py-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Записаться на подбор гардероба
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          БЛОК 4. УСЛУГИ И ПРАЙС
      ===================================================================== */}
      <section
        id="services"
        className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24"
      >
        <div className="border-t border-b border-neutral-300 py-4 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
          <span>SECTION 03 // SERVICE GUIDE &amp; INVESTMENT</span>
          <span>ОНЛАЙН ПО ВСЕМУ МИРУ / ОФЛАЙН</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight font-normal mb-10">
              Форматы работы и прайс
            </h2>

            <div className="divide-y divide-neutral-300 border-t border-b border-neutral-300 bg-white">
              {SERVICES_DATA.map((service) => {
                const isActive = hoveredServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    onMouseEnter={() => setHoveredServiceId(service.id)}
                    className={`p-6 sm:p-8 transition-colors duration-300 ${
                      isActive ? "bg-[#FAF8F4]" : "bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-neutral-400">
                          /{service.index}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900">
                          {service.title}
                        </h3>
                      </div>
                      <div className="font-serif text-2xl sm:text-3xl text-neutral-900 shrink-0">
                        {service.price}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="inline-block text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 border border-neutral-300 bg-white text-neutral-600">
                        Формат: {service.format}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                      {service.description}
                    </p>
                    <p className="text-xs text-neutral-500 border-l-2 border-neutral-400 pl-3 mb-5">
                      <strong className="font-mono uppercase text-[10px] text-neutral-700 block mb-0.5">
                        Результат для вас:
                      </strong>
                      {service.result}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleBookService(service.title)}
                      className="px-5 py-2.5 border border-neutral-900 text-[11px] font-mono uppercase tracking-[0.18em] hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                    >
                      [ Выбрать «{service.title}» ]
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white p-5 border border-neutral-300 shadow-md">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3">
                <span>SERVICE PREVIEW</span>
                <span>/{activeServicePreview.index}</span>
              </div>
              <div className="aspect-[4/5] overflow-hidden bg-neutral-100 mb-4">
                <img
                  src={activeServicePreview.previewImg}
                  alt={activeServicePreview.title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
              <div className="font-serif text-2xl text-neutral-900">
                {activeServicePreview.title}
              </div>
              <div className="mt-1 text-xs font-mono uppercase tracking-wider text-neutral-500">
                {activeServicePreview.price} • {activeServicePreview.format}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          БЛОК 5. ОТЗЫВЫ И ИСТОРИИ КЛИЕНТОВ - ТЕПЕРЬ С КРУПНЫМ ПРЕВЬЮ И ПРОСМОТРОМ ОРИГИНАЛА!
      ===================================================================== */}
      <section
        id="reviews"
        className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-300 pb-6 gap-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500 block mb-2">
              SECTION 04 // CLIENT STORIES &amp; ARCHIVE NOTES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight font-normal">
              Истории, образы и оригиналы отзывов
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "Все истории (6)" },
                { id: "shopping", label: "Шопинг" },
                { id: "wardrobe", label: "Разбор и лукбук" },
                { id: "mens", label: "Мужской стиль" },
                { id: "coaching", label: "Фэшн-терапия" },
              ] as { id: ReviewCategory; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setReviewFilter(tab.id)}
                className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] border transition-colors cursor-pointer ${
                  reviewFilter === tab.id
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="bg-white border border-neutral-300 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 border-b border-neutral-200 pb-3 mb-5">
                  <span>{review.code}</span>
                  <span className="text-neutral-700">{review.tag}</span>
                </div>

                {/* Крупное превью реального скриншота / образа из отзыва (клик открывает во весь экран) */}
                <div
                  onClick={() => setActiveReviewModal(review)}
                  className="group relative mb-5 bg-[#FAF8F5] border border-neutral-200 p-2.5 cursor-pointer overflow-hidden"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                    <img
                      src={review.proofImage}
                      alt={review.proofCaption}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="bg-white/95 text-neutral-900 px-3.5 py-2 text-[10px] font-mono uppercase tracking-[0.18em] shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                        [ Увеличить скриншот ↗ ]
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                    <span className="truncate">{review.proofCaption}</span>
                    <span className="text-neutral-900 shrink-0 ml-2 underline">
                      Оригинал
                    </span>
                  </div>
                </div>

                {/* Выделенная маркером главная цитата */}
                <div className="mb-3">
                  <span className="font-serif text-lg sm:text-xl text-neutral-900 bg-amber-100/85 px-1.5 py-0.5 leading-snug box-decoration-clone">
                    «{review.highlight}»
                  </span>
                </div>

                <blockquote className="text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {review.quote}
                </blockquote>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-900">
                    {review.author}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    {review.dateNote}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReviewModal(review)}
                  className="px-3 py-1.5 border border-neutral-300 hover:border-neutral-900 text-[9px] font-mono uppercase tracking-widest shrink-0 cursor-pointer"
                >
                  Скриншот
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Модальное окно полноразмерного просмотра скриншота отзыва */}
      {activeReviewModal && (
        <div
          onClick={() => setActiveReviewModal(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] border border-neutral-300 max-w-3xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl max-h-[92vh]"
          >
            {/* Левая половина: сам скриншот из сторис целиком без обрезки */}
            <div className="md:col-span-7 bg-neutral-900 flex items-center justify-center p-2 max-h-[65vh] md:max-h-[90vh]">
              <img
                src={activeReviewModal.proofImage}
                alt={activeReviewModal.proofCaption}
                className="max-h-full w-auto object-contain"
              />
            </div>

            {/* Правая половина: расшифровка и кнопка записи */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-200 pb-3">
                  <span>{activeReviewModal.code}</span>
                  <button
                    type="button"
                    onClick={() => setActiveReviewModal(null)}
                    className="text-neutral-900 hover:underline cursor-pointer"
                  >
                    [ ЗАКРЫТЬ × ]
                  </button>
                </div>

                <span className="inline-block mt-4 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 bg-neutral-200/80">
                  {activeReviewModal.tag}
                </span>

                <h3 className="mt-3 font-serif text-xl sm:text-2xl text-neutral-900">
                  {activeReviewModal.author}
                </h3>

                <p className="mt-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {activeReviewModal.quote}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveReviewModal(null);
                  handleBookService(SERVICES_DATA[0].title);
                }}
                className="mt-6 w-full py-3.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Хочу такой же результат
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          БЛОК 6. ФОРМА ЗАЯВКИ И КОНТАКТЫ
      ===================================================================== */}
      <section
        id="contact"
        ref={contactRef}
        className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-28"
      >
        <div className="bg-white border border-neutral-300 p-6 sm:p-12 lg:p-16 shadow-md relative">
          <BinderClip className="hidden sm:block absolute -top-6 right-12" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block">
                SECTION 05 // RESERVATION &amp; CONTACTS
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl tracking-tight font-normal leading-tight">
                Давайте обсудим ваш гардероб
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Если хотите разобраться со стилем, подготовить гардероб к новому
                этапу жизни или научиться самостоятельно собирать образы -
                напишите мне напрямую или оставьте заявку в анкете.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="aspect-[4/3] border border-neutral-200 overflow-hidden bg-neutral-100">
                  <img
                    src={PHOTOS.detailHandBagJjoir}
                    alt="Деталь образа"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] border border-neutral-200 overflow-hidden bg-neutral-100">
                  <img
                    src={PHOTOS.detailBurgundyMules}
                    alt="Обувь и стиль"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3 border-t border-neutral-200">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                  Личные каналы связи Полины:
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://t.me/couture_polina"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-5 py-3.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors"
                  >
                    <span>Telegram: @couture_polina</span>
                    <span>↗</span>
                  </a>
                  <a
                    href="https://instagram.com/coutur.ye"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-5 py-3.5 border border-neutral-900 text-neutral-900 text-xs font-mono uppercase tracking-[0.18em] hover:bg-neutral-100 transition-colors"
                  >
                    <span>Instagram: @coutur.ye</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#FAF8F5] border border-neutral-300 p-6 sm:p-10">
              <div className="flex justify-between items-center border-b border-neutral-300 pb-4 mb-8 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                <span>CLIENT APPLICATION BRIEF</span>
                <span>WOMEN &amp; MEN</span>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="font-serif text-3xl text-neutral-900">
                    Ваша анкета готова
                  </div>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto">
                    Спасибо, {formState.name}! Выбрана услуга:{" "}
                    <strong>{formState.service}</strong>. Нажмите кнопку ниже,
                    чтобы мгновенно открыть диалог с Полиной в Telegram.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href="https://t.me/couture_polina"
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-[0.2em]"
                    >
                      Открыть Telegram Полины
                    </a>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="px-6 py-3.5 border border-neutral-400 text-xs font-mono uppercase tracking-[0.2em] cursor-pointer"
                    >
                      Редактировать заявку
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="f-name"
                      className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2"
                    >
                      01 / Ваше имя *
                    </label>
                    <input
                      id="f-name"
                      type="text"
                      required
                      placeholder="Как к вам обращаться"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-neutral-400 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="f-contact"
                      className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2"
                    >
                      02 / Ник в Telegram или телефон *
                    </label>
                    <input
                      id="f-contact"
                      type="text"
                      required
                      placeholder="@username или +7 (999) 000-00-00"
                      value={formState.contact}
                      onChange={(e) =>
                        setFormState({ ...formState, contact: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-neutral-400 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="f-service"
                      className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2"
                    >
                      03 / Выберите формат работы
                    </label>
                    <select
                      id="f-service"
                      value={formState.service}
                      onChange={(e) =>
                        setFormState({ ...formState, service: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-neutral-400 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                    >
                      {SERVICES_DATA.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title} - {s.price} ({s.format})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="f-msg"
                      className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2"
                    >
                      04 / Коротко о вашем запросе (необязательно)
                    </label>
                    <textarea
                      id="f-msg"
                      rows={3}
                      placeholder="Например: разобрать текущий гардероб, собрать деловую капсулу, подготовиться к съёмке или мероприятию..."
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-neutral-400 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-[0.22em] hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Отправить заявку
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ПОДВАЛ САЙТА (FOOTER)
      ===================================================================== */}
      <footer className="border-t border-neutral-300 py-10 px-4 sm:px-8 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} ПОЛИНА ШУРУПОВА - СТИЛИСТ И ИСТОРИК
            МОДЫ
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://t.me/couture_polina"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-900"
            >
              TELEGRAM
            </a>
            <a
              href="https://instagram.com/coutur.ye"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-900"
            >
              INSTAGRAM
            </a>
            <a href="#top" className="hover:text-neutral-900">
              НАВЕРХ ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

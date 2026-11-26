export const catalogProducts = [
	{
		id: 'decorative-plaster',

		title: 'Декоративная штукатурка',
		category: 'plaster',
		materialType: 'plaster',
		applications: ['walls', 'interior'],
		effects: ['texture'],
		base: 'Уточняется',
		price: 3500,
		image: 'assets/images/catalog/decorative-plaster.jpg',
		alt: 'Декоративная штукатурка с рельефной фактурой',
		brand: 'Бренд не выбран',
		brandLogo: '',
		demoNote: 'Демонстрационная карточка. Цена, бренд и характеристики предварительные и требуют согласования с заказчиком.',

		description: 'Декоративная штукатурка — материал для создания фактурного декоративного покрытия стен. С её помощью можно сформировать выразительную поверхность и подобрать визуальный характер отделки под интерьер. Конкретный рисунок и степень рельефа зависят от выбранного состава, инструмента и техники нанесения.',

		descriptionSections: [
			{ title: 'Область применения', text: 'В демонстрационном примере рассматривается отделка внутренних стен. Возможность применения в других помещениях и зонах необходимо подтвердить по документации выбранного продукта.' },
			{ title: 'Внешний вид покрытия', text: 'Фактура, глубина рельефа и итоговый рисунок определяются конкретным материалом, подготовкой основания и способом работы мастера. Для выбора рекомендуется ориентироваться на образец готового покрытия.' },
			{ title: 'Перед покупкой', text: 'Уточните у менеджера название продукта и производителя, тип основания, рекомендуемый расход, количество слоёв, способ нанесения и необходимость защитного финишного покрытия.' },
		],

		shortDescription: 'Декоративное покрытие для создания выразительной фактуры стен в интерьере.',

		features: [
			'Позволяет создавать декоративную фактуру поверхности.',
			'Визуальный результат можно подбирать под интерьер и выбранную технику нанесения.',
			'Для оценки оттенка и рельефа рекомендуется предварительно выполнить пробный выкрас или образец.',
		],

		technicalData: [
			{ name: 'Тип материала', value: 'Декоративная штукатурка' },
			{ name: 'Производитель и серия', value: 'Уточняются' },
			{ name: 'Связующее / состав', value: 'Уточняется по технической карте' },
			{ name: 'Основа', value: 'Уточняется по технической карте' },
			{ name: 'Область применения', value: 'Предварительно — интерьерные стены; требуется подтверждение' },
			{ name: 'Подготовка поверхности', value: 'По инструкции производителя выбранного материала' },
			{ name: 'Способ нанесения', value: 'Уточняется для выбранного эффекта и продукта' },
			{ name: 'Инструмент', value: 'Подбирается по рекомендуемой технике нанесения' },
			{ name: 'Расход', value: 'Уточняется по технической карте и выбранной фактуре' },
			{ name: 'Количество слоёв', value: 'Уточняется по инструкции производителя' },
			{ name: 'Время высыхания', value: 'Уточняется по технической карте' },
			{ name: 'Финишная защита', value: 'Необходимость и тип покрытия уточняются' },
			{ name: 'Условия нанесения', value: 'Температура и влажность — по инструкции производителя' },
			{ name: 'Фасовка', value: 'Уточняется' },
		],

		characteristics: [
			{ name: 'Тип материала', value: 'Декоративная штукатурка' },
			{ name: 'Бренд', value: 'Не выбран' },
			{ name: 'Основа', value: 'Уточняется' },
			{ name: 'Эффект', value: 'Фактурный; конкретный рисунок уточняется' },
			{ name: 'Область применения', value: 'Предварительно — стены внутри помещений' },
			{ name: 'Способ нанесения', value: 'Уточняется' },
			{ name: 'Расход', value: 'Уточняется по технической карте' },
			{ name: 'Фасовка', value: 'Уточняется' },
		],

		gallery: ['assets/images/catalog/decorative-plaster.jpg'],
		url: 'product.html?id=decorative-plaster',
	},

    {
        id: 'microcement',
        title: 'Микроцемент',

        category: 'microcement',
        materialType: 'microcement',

        applications: [
            'walls',
            'floor',
            'interior',
        ],

        effects: [
            'concrete',
        ],

        base: 'cement',

        price: 4200,

        image:
            'assets/images/catalog/microcement.jpg',

        alt:
            'Микроцемент с минеральной фактурой',

        description:
            'Покрытие с характерной минеральной фактурой.',

        shortDescription:
            'Минеральное покрытие для стен и пола.',

        characteristics: [
            {
                name: 'Тип материала',
                value: 'Микроцемент',
            },
            {
                name: 'Основа',
                value: 'Цементная',
            },
            {
                name: 'Область применения',
                value: 'Стены, пол, интерьер',
            },
        ],

        gallery: [
            'assets/images/catalog/microcement.jpg',
        ],

        url:
            'product.html?id=microcement',
    },

    {
        id: 'marble',
        title: 'Мраморный эффект',

        category: 'decorative',
        materialType: 'paint',

        applications: [
            'walls',
            'interior',
        ],

        effects: [
            'marble',
        ],

        base: 'water',

        price: 3900,

		volumeOptions: [
		    {
		        value: '0.9',
		        label: '0.9 л',
		        multiplier: 1,
		    },
		    {
		        value: '2.7',
		        label: '2.7 л',
		        multiplier: 2.5,
		    },
		    {
		        value: '9',
		        label: '9 л',
		        multiplier: 7,
		    },
		],

        image:
            'assets/images/catalog/marble.jpg',

        alt:
            'Декоративное покрытие с эффектом натурального мрамора',

        description:
            'Декоративная поверхность с визуальным эффектом натурального камня.',

        shortDescription:
            'Декоративное покрытие с эффектом натурального мрамора.',

        characteristics: [
            {
                name: 'Тип материала',
                value: 'Краска',
            },
            {
                name: 'Основа',
                value: 'Водная',
            },
            {
                name: 'Эффект',
                value: 'Мрамор',
            },
        ],

        gallery: [
            'assets/images/catalog/marble.jpg',
        ],

        url:
            'product.html?id=marble',
    },

    {
        id: 'venetian-plaster',
        title: 'Венецианская штукатурка',

        category: 'venetian',
        materialType: 'plaster',

        applications: [
            'walls',
            'interior',
        ],

        effects: [
            'marble',
            'gloss',
        ],

        base: 'lime',

        price: 5500,

        image:
            'assets/images/catalog/venetian-plaster.jpg',

        alt:
            'Венецианская штукатурка с мраморным эффектом',

        description:
            'Материал для декоративной отделки стен и создания сложной фактуры.',

        shortDescription:
            'Покрытие для создания эффекта натурального камня с глянцевой поверхностью.',

        characteristics: [
            {
                name: 'Тип материала',
                value: 'Штукатурка',
            },
            {
                name: 'Основа',
                value: 'Известковая',
            },
            {
                name: 'Эффект',
                value: 'Мрамор, глянец',
            },
        ],

        gallery: [
            'assets/images/catalog/venetian-plaster.jpg',
        ],

        url:
            'product.html?id=venetian-plaster',
    },

    {
        id: 'effect-paint',
        title: 'Краска с эффектом',

        category: 'paints',
        materialType: 'paint',

        applications: [
            'walls',
            'interior',
        ],

        effects: [
            'decorative',
        ],

        base: 'water',

        price: 2800,

		volumeOptions: [
		    {
		        value: '0.9',
		        label: '0.9 л',
		        multiplier: 1,
		    },
		    {
		        value: '2.7',
		        label: '2.7 л',
		        multiplier: 2.5,
		    },
		    {
		        value: '9',
		        label: '9 л',
		        multiplier: 7,
		    },
		],

        image:
            'assets/images/catalog/effect-paint.jpg',

        alt:
            'Декоративная краска с выразительным эффектом',

        description:
            'Декоративное покрытие для создания выразительного визуального результата.',

        shortDescription:
            'Декоративная краска для выразительной отделки интерьера.',

        characteristics: [
            {
                name: 'Тип материала',
                value: 'Краска',
            },
            {
                name: 'Основа',
                value: 'Водная',
            },
            {
                name: 'Эффект',
                value: 'Декоративный',
            },
        ],

        gallery: [
            'assets/images/catalog/effect-paint.jpg',
        ],

        url:
            'product.html?id=effect-paint',
    },

    {
        id: 'tools',
        title: 'Инструменты',

        category: 'tools',
        materialType: 'tool',

        applications: [],

        effects: [],

        base: 'other',

        price: 1500,

        image:
            'assets/images/catalog/tools.jpg',

        alt:
            'Инструменты для работы с декоративными покрытиями',

        description:
            'Инструменты и материалы для работы с декоративными покрытиями.',

        shortDescription:
            'Инструменты для работы с декоративными покрытиями.',

        characteristics: [
            {
                name: 'Тип товара',
                value: 'Инструменты',
            },
        ],

        gallery: [
            'assets/images/catalog/tools.jpg',
        ],

        url:
            'product.html?id=tools',
    },
];

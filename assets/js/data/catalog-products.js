export const catalogProducts = [
	{
		id: 'decorative-plaster',

		title: 'Декоративная штукатурка',

		category: 'plaster',
		materialType: 'plaster',

		applications: [
			'walls',
			'interior',
		],

		effects: [
			'texture',
		],

		base: 'water',

		price: 3500,

		image: 'assets/images/catalog/decorative-plaster.jpg',

		alt: 'Декоративная штукатурка с фактурным рельефом',

		brand: 'Бренд уточняется',
		brandLogo: '',
		demoNote: 'Демонстрационная карточка. Цена и сведения требуют согласования с заказчиком.',

		description:
			'Декоративная штукатурка предназначена для создания выразительной фактурной поверхности стен в интерьере. Материал позволяет сформировать индивидуальный рисунок покрытия и использовать его как самостоятельный элемент отделки. Итоговый внешний вид зависит от способа нанесения, инструмента и подготовки основания.',

		shortDescription:
			'Декоративное покрытие для создания выразительной фактуры стен в интерьере.',

		features: [
			'Помогает создать индивидуальную фактуру поверхности.',
			'Подходит для декоративной отделки интерьерных стен.',
			'Итоговый рисунок можно варьировать техникой нанесения.',
		],

		technicalData: [
			{ name: 'Тип материала', value: 'Декоративная штукатурка' },
			{ name: 'Основа', value: 'Водная — демонстрационное значение, требует подтверждения' },
			{ name: 'Расход', value: 'Уточняется по технической карте выбранного материала' },
			{ name: 'Время высыхания', value: 'Уточняется по технической карте производителя' },
			{ name: 'Способ нанесения', value: 'Подбирается в зависимости от желаемой фактуры' },
			{ name: 'Инструмент', value: 'Уточняется для выбранной техники нанесения' },
			{ name: 'Область применения', value: 'Интерьерные стены — демонстрационное значение' },
		],

		characteristics: [
			{
					name: 'Тип материала',
					value: 'Штукатурка',
			},
			{
					name: 'Основа',
					value: 'Водная',
			},
			{
					name: 'Область применения',
					value: 'Стены, интерьер',
			},
		],

		gallery: [
			'assets/images/catalog/decorative-plaster.jpg',
		],

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

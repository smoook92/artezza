document.addEventListener(
    'DOMContentLoaded',
    initPage
);


/**
 * Данные информационных страниц.
 *
 * @type {Record<string, Object>}
 */
const pages = {
    about: {
        title: 'О компании',
        eyebrow: 'ARTEZZA',
        description:
            'Создаём материалы и решения для интерьеров, в которых важны качество, фактура и характер.',

        sections: [
            {
                title: 'Материалы для выразительных интерьеров',
                paragraphs: [
                    'ARTEZZA объединяет декоративные покрытия, краски и материалы для создания современных интерьерных решений.',
                    'Мы уделяем внимание не только внешнему виду покрытия, но и удобству его применения, сочетанию материалов и конечному результату.',
                ],
            },
            {
                title: 'Наш подход',
                list: [
                    'Подбираем материалы под конкретную задачу.',
                    'Помогаем сочетать фактуры, цвета и декоративные эффекты.',
                    'Предлагаем решения для частных и коммерческих интерьеров.',
                    'Ориентируемся на аккуратный и предсказуемый результат.',
                ],
            },
        ],

        cta: 'Нужна помощь с выбором материала?',
    },

    partners: {
        title: 'Партнёрам',
        eyebrow: 'Сотрудничество',
        description:
            'Работаем с дизайнерами, мастерами, студиями и профессиональными участниками рынка.',

        sections: [
            {
                title: 'Для профессионалов',
                paragraphs: [
                    'ARTEZZA открыта к сотрудничеству с дизайнерами интерьеров, строительными компаниями, мастерами и студиями.',
                    'Мы можем помочь подобрать материалы под проект, предоставить необходимую информацию и обсудить условия сотрудничества.',
                ],
            },
            {
                title: 'Что мы предлагаем',
                list: [
                    'Подбор материалов под проекты.',
                    'Консультации по декоративным покрытиям.',
                    'Помощь в выборе эффектов и фактур.',
                    'Профессиональное взаимодействие по проектам.',
                ],
            },
        ],

        cta: 'Обсудить сотрудничество',
    },

    school: {
        title: 'Школа мастеров',
        eyebrow: 'Обучение',
        description:
            'Практические знания о декоративных покрытиях, материалах и технологиях работы.',

        sections: [
            {
                title: 'Практика вместо теории',
                paragraphs: [
                    'Школа мастеров создана для тех, кто хочет глубже разобраться в декоративных покрытиях и научиться работать с различными фактурами.',
                    'Обучение ориентировано на практическое применение материалов и понимание технологии нанесения.',
                ],
            },
            {
                title: 'Основные направления',
                list: [
                    'Подготовка поверхности.',
                    'Работа с декоративной штукатуркой.',
                    'Создание различных фактур.',
                    'Работа с декоративными эффектами.',
                    'Финишная обработка поверхности.',
                ],
            },
        ],

        cta: 'Узнать о ближайшем обучении',
    },

    video: {
        title: 'Видеоуроки',
        eyebrow: 'Обучение',
        description:
            'Видео о материалах, технологиях нанесения и создании декоративных эффектов.',

        sections: [
            {
                title: 'Полезные материалы',
                paragraphs: [
                    'Видеоуроки помогут разобраться в особенностях работы с декоративными покрытиями и лучше понять последовательность выполнения работ.',
                ],
            },
            {
                title: 'Что можно изучить',
                list: [
                    'Подготовку основания.',
                    'Инструменты для работы.',
                    'Технологию нанесения материалов.',
                    'Создание декоративных фактур.',
                    'Особенности финишной обработки.',
                ],
            },
        ],

        cta: 'Перейти к материалам',
    },

    services: {
        title: 'Наши услуги',
        eyebrow: 'Услуги ARTEZZA',
        description:
            'Помогаем подобрать материалы и решения для создания декоративных поверхностей.',

        sections: [
            {
                title: 'Подбор материалов',
                paragraphs: [
                    'Поможем определить подходящий материал с учётом поверхности, назначения помещения и желаемого декоративного эффекта.',
                ],
            },
            {
                title: 'Основные направления',
                list: [
                    'Подбор декоративных покрытий.',
                    'Подбор красок и материалов.',
                    'Подбор декоративного эффекта.',
                    'Консультация по применению.',
                    'Помощь с выбором материалов для проекта.',
                ],
            },
        ],

        cta: 'Получить консультацию',
    },

    delivery: {
        title: 'Доставка',
        eyebrow: 'Покупателям',
        description:
            'Организуем доставку материалов по Москве и Московской области.',

        sections: [
            {
                title: 'Как происходит доставка',
                paragraphs: [
                    'После оформления заказа мы связываемся с вами для подтверждения состава заказа, адреса и удобного времени доставки.',
                    'Точные условия и стоимость доставки зависят от состава заказа и адреса.',
                ],
            },
            {
                title: 'Порядок работы',
                steps: [
                    {
                        title: 'Заказ',
                        text: 'Вы оформляете заказ через сайт.',
                    },
                    {
                        title: 'Подтверждение',
                        text: 'Мы связываемся с вами и уточняем детали.',
                    },
                    {
                        title: 'Доставка',
                        text: 'Согласовываем удобное время получения.',
                    },
                ],
            },
        ],

        cta: 'Оформить заказ',
    },

    payment: {
        title: 'Оплата',
        eyebrow: 'Покупателям',
        description:
            'Информация об оплате заказа и доступных способах расчёта.',

        sections: [
            {
                title: 'Оплата заказа',
                paragraphs: [
                    'Способ оплаты и окончательные условия согласовываются при подтверждении заказа.',
                    'Перед оплатой мы уточняем состав заказа, стоимость и условия получения.',
                ],
            },
            {
                title: 'Если у вас есть вопросы',
                paragraphs: [
                    'Свяжитесь с нами, если вам необходимо уточнить стоимость, наличие материалов или условия оплаты.',
                ],
            },
        ],

        cta: 'Связаться с нами',
    },

    faq: {
        title: 'Частые вопросы',
        eyebrow: 'Помощь',
        description:
            'Ответы на основные вопросы о материалах, заказе и доставке.',

        faq: [
            {
                question: 'Как подобрать подходящий материал?',
                answer:
                    'Ориентируйтесь на тип поверхности, назначение помещения и желаемый декоративный эффект. При необходимости можно обратиться к нам за консультацией.',
            },
            {
                question: 'Можно ли получить консультацию?',
                answer:
                    'Да. Свяжитесь с нами по телефону или через форму обратной связи.',
            },
            {
                question: 'Работаете ли вы с дизайнерами и мастерами?',
                answer:
                    'Да. Мы рассматриваем сотрудничество с профессиональными участниками рынка.',
            },
            {
                question: 'Есть ли доставка по Москве и области?',
                answer:
                    'Да. Условия доставки зависят от адреса и состава заказа.',
            },
        ],
    },

    privacy: {
        title: 'Политика конфиденциальности',
        eyebrow: 'Документы',
        description:
            'Информация о порядке обработки и защиты персональных данных.',

        sections: [
            {
                title: 'Общие положения',
                paragraphs: [
                    'Настоящая страница содержит информацию о принципах обработки персональных данных пользователей сайта ARTEZZA.',
                    'Мы используем предоставленные данные только в целях, связанных с обработкой обращений, заказов и взаимодействием с пользователями.',
                ],
            },
            {
                title: 'Обработка данных',
                list: [
                    'Получение и обработка обращений пользователей.',
                    'Обработка заказов.',
                    'Связь с пользователем по указанным контактным данным.',
                    'Обеспечение работы сайта и его сервисов.',
                ],
            },
        ],
    },

    'personal-data': {
        title: 'Обработка персональных данных',
        eyebrow: 'Документы',
        description:
            'Информация о предоставлении и обработке персональных данных.',

        sections: [
            {
                title: 'Использование данных',
                paragraphs: [
                    'Персональные данные используются для обработки заявок, заказов и обратной связи с пользователем.',
                    'Передача данных осуществляется только в рамках необходимых для работы сайта процессов.',
                ],
            },
            {
                title: 'Контакт с пользователем',
                paragraphs: [
                    'Если вы оставляете заявку или оформляете заказ, предоставленные контактные данные могут использоваться для связи с вами.',
                ],
            },
        ],
    },
};


/**
 * Инициализирует информационную страницу.
 *
 * @returns {void}
 */
function initPage() {
    const pageKey = getPageKey();
    const pageData = pages[pageKey];

    if (!pageData) {
        renderNotFound();
        return;
    }

    renderPage(
        pageKey,
        pageData
    );
}


/**
 * Получает идентификатор страницы.
 *
 * @returns {string}
 */
function getPageKey() {
    return new URLSearchParams(
        window.location.search
    ).get('page') ?? 'about';
}


/**
 * Рендерит страницу.
 *
 * @param {string} pageKey
 * @param {Object} pageData
 * @returns {void}
 */
function renderPage(pageKey, pageData) {
    document.title =
        `${pageData.title} — ARTEZZA`;

    setMetaDescription(
        pageData.description
    );

    setText(
        '[data-page-breadcrumb]',
        pageData.title
    );

    setText(
        '[data-page-eyebrow]',
        pageData.eyebrow
    );

    setText(
        '[data-page-title]',
        pageData.title
    );

    setText(
        '[data-page-intro]',
        pageData.description
    );

    renderContent(
        pageData
    );
}


/**
 * Рендерит содержимое страницы.
 *
 * @param {Object} pageData
 * @returns {void}
 */
function renderContent(pageData) {
    const container = document.querySelector(
        '[data-page-content]'
    );

    if (!container) {
        return;
    }

    const sections = pageData.sections ?? [];

    container.replaceChildren(
        ...sections.map(
            createSection
        )
    );

    if (pageData.faq?.length) {
        container.appendChild(
            createFaqSection(
                pageData.faq
            )
        );
    }

    if (pageData.cta) {
        container.appendChild(
            createCta(
                pageData.cta
            )
        );
    }
}


/**
 * Создаёт секцию.
 *
 * @param {Object} section
 * @returns {HTMLElement}
 */
function createSection(section) {
    const element =
        document.createElement('section');

    element.className =
        'page__section';

    let html = `
        <h2 class="page__section-title">
            ${escapeHtml(section.title)}
        </h2>
    `;

    if (section.paragraphs?.length) {
        html += section.paragraphs
            .map(
                (paragraph) => `
                    <p class="page__section-text">
                        ${escapeHtml(paragraph)}
                    </p>
                `
            )
            .join('');
    }

    if (section.list?.length) {
        html += `
            <ul class="page__list">
                ${section.list
                    .map(
                        (item) => `
                            <li>
                                ${escapeHtml(item)}
                            </li>
                        `
                    )
                    .join('')}
            </ul>
        `;
    }

    if (section.steps?.length) {
        html += `
            <div class="page__steps">
                ${section.steps
                    .map(
                        (step, index) => `
                            <article class="page__step">

                                <span class="page__step-number">
                                    ${String(index + 1).padStart(2, '0')}
                                </span>

                                <h3 class="page__step-title">
                                    ${escapeHtml(step.title)}
                                </h3>

                                <p class="page__step-text">
                                    ${escapeHtml(step.text)}
                                </p>

                            </article>
                        `
                    )
                    .join('')}
            </div>
        `;
    }

    element.innerHTML = html;

    return element;
}


/**
 * Создаёт FAQ.
 *
 * @param {Array} items
 * @returns {HTMLElement}
 */
function createFaqSection(items) {
    const section =
        document.createElement('section');

    section.className =
        'page__section';

    section.innerHTML = `
        <h2 class="page__section-title">
            Частые вопросы
        </h2>

        <div class="page__faq">

            ${items
                .map(
                    (item) => `
                        <div class="page__faq-item">

                            <button
                                class="page__faq-question"
                                type="button"
                                aria-expanded="false"
                            >
                                ${escapeHtml(item.question)}
                            </button>

                            <div
                                class="page__faq-answer"
                                hidden
                            >
                                ${escapeHtml(item.answer)}
                            </div>

                        </div>
                    `
                )
                .join('')}

        </div>
    `;

    section
        .querySelectorAll(
            '.page__faq-question'
        )
        .forEach((button) => {
            button.addEventListener(
                'click',
                toggleFaq
            );
        });

    return section;
}


/**
 * Переключает FAQ.
 *
 * @param {MouseEvent} event
 * @returns {void}
 */
function toggleFaq(event) {
    const button =
        event.currentTarget;

    const answer =
        button.nextElementSibling;

    const expanded =
        button.getAttribute(
            'aria-expanded'
        ) === 'true';

    button.setAttribute(
        'aria-expanded',
        String(!expanded)
    );

    answer.hidden = expanded;
}


/**
 * Создаёт CTA.
 *
 * @param {string} text
 * @returns {HTMLElement}
 */
function createCta(text) {
    const section =
        document.createElement('section');

    section.className =
        'page__cta';

    section.innerHTML = `
        <h2 class="page__cta-title">
            ${escapeHtml(text)}
        </h2>

        <a
            class="button button--outline"
            href="contacts.html"
        >
            Связаться с нами
        </a>
    `;

    return section;
}


/**
 * Показывает страницу 404.
 *
 * @returns {void}
 */
function renderNotFound() {
    const container =
        document.querySelector(
            '[data-page-content]'
        );

    if (!container) {
        return;
    }

    document.title =
        'Страница не найдена — ARTEZZA';

    container.innerHTML = `
        <section class="page__not-found">

            <h1 class="page__not-found-title">
                Страница не найдена
            </h1>

            <p class="page__not-found-text">
                Такой информационной страницы пока нет
                или ссылка устарела.
            </p>

            <a
                class="button button--primary"
                href="index.html"
            >
                Вернуться на главную
            </a>

        </section>
    `;
}


/**
 * Устанавливает текст элемента.
 *
 * @param {string} selector
 * @param {string} value
 * @returns {void}
 */
function setText(selector, value) {
    const element =
        document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }
}


/**
 * Обновляет meta description.
 *
 * @param {string} description
 * @returns {void}
 */
function setMetaDescription(description) {
    const meta =
        document.querySelector(
            'meta[name="description"]'
        );

    if (meta) {
        meta.content = description;
    }
}


/**
 * Экранирует HTML.
 *
 * @param {unknown} value
 * @returns {string}
 */
function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
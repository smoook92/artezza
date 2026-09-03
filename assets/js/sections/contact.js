'use strict';


/* =========================================================
   CONTACT FORM
   ========================================================= */

export function initContactForm() {
    const form = document.querySelector('[data-contact-form]');

    if (!form) {
        return;
    }

    const nameInput = form.querySelector('#contact-name');
    const phoneInput = form.querySelector('#contact-phone');
    const messageInput = form.querySelector('#contact-message');
    const agreementInput = form.querySelector(
        'input[name="agreement"]'
    );
    const websiteInput = form.querySelector('#contact-website');

    const submitButton = form.querySelector(
        '.contact-form__submit'
    );

    const messageCounter = form.querySelector(
        '[data-message-counter]'
    );

    const formError = form.querySelector(
        '[data-contact-form-error]'
    );

    const formSuccess = form.querySelector(
        '[data-contact-form-success]'
    );

    if (
        !nameInput ||
        !phoneInput ||
        !messageInput ||
        !agreementInput ||
        !websiteInput ||
        !submitButton
    ) {
        return;
    }


    /* =====================================================
       CONSTANTS
       ===================================================== */

    const MAX_MESSAGE_LENGTH = 1000;

    const PHONE_DIGITS_LENGTH = 11;

    const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';


    /* =====================================================
       HELPERS
       ===================================================== */

    function getFieldError(fieldName) {
        return form.querySelector(
            `[data-field-error="${fieldName}"]`
        );
    }


    function setFieldError(input, message, fieldName) {
        const errorElement = getFieldError(fieldName);

        input.classList.toggle('is-error', Boolean(message));
        input.classList.toggle(
            'is-valid',
            !message && Boolean(input.value.trim())
        );

        input.setAttribute(
            'aria-invalid',
            message ? 'true' : 'false'
        );

        if (errorElement) {
            errorElement.textContent = message;
        }
    }


    function clearFieldState(input, fieldName) {
        const errorElement = getFieldError(fieldName);

        input.classList.remove('is-error');
        input.classList.remove('is-valid');

        input.setAttribute('aria-invalid', 'false');

        if (errorElement) {
            errorElement.textContent = '';
        }
    }


    function setFormError(message) {
        formError.textContent = message;

        form.classList.toggle(
            'has-error',
            Boolean(message)
        );
    }


    function clearFormMessages() {
        setFormError('');

        form.classList.remove('is-success');
    }


    function normalizeSpaces(value) {
        return value
            .trim()
            .replace(/\s+/g, ' ');
    }


    /* =====================================================
       NAME VALIDATION
       ===================================================== */

    function validateName() {
        const value = normalizeSpaces(nameInput.value);

        nameInput.value = value;

        if (!value) {
            setFieldError(
                nameInput,
                'Введите ваше имя.',
                'name'
            );

            return false;
        }

        if (value.length < 2) {
            setFieldError(
                nameInput,
                'Имя должно содержать минимум 2 символа.',
                'name'
            );

            return false;
        }

        if (value.length > 50) {
            setFieldError(
                nameInput,
                'Имя не должно превышать 50 символов.',
                'name'
            );

            return false;
        }

        setFieldError(nameInput, '', 'name');

        return true;
    }


    /* =====================================================
       PHONE
       ===================================================== */

    function getPhoneDigits(value) {
        return value.replace(/\D/g, '');
    }


    function normalizePhoneDigits(value) {
        let digits = getPhoneDigits(value);

        if (!digits) {
            return '';
        }

        if (digits.startsWith('8')) {
            digits = `7${digits.slice(1)}`;
        }

        if (digits.startsWith('9')) {
            digits = `7${digits}`;
        }

        if (!digits.startsWith('7')) {
            digits = `7${digits}`;
        }

        return digits.slice(0, PHONE_DIGITS_LENGTH);
    }


    function formatPhone(value) {
        const digits = normalizePhoneDigits(value);

        if (!digits) {
            return '';
        }

        let formatted = '+7';

        if (digits.length > 1) {
            formatted += ` (${digits.slice(1, 4)}`;
        }

        if (digits.length >= 4) {
            formatted += ')';
        }

        if (digits.length > 4) {
            formatted += ` ${digits.slice(4, 7)}`;
        }

        if (digits.length > 7) {
            formatted += `-${digits.slice(7, 9)}`;
        }

        if (digits.length > 9) {
            formatted += `-${digits.slice(9, 11)}`;
        }

        return formatted;
    }


    function applyPhoneMask() {
        const formatted = formatPhone(phoneInput.value);

        phoneInput.value = formatted;
    }


    function validatePhone() {
        const digits = normalizePhoneDigits(phoneInput.value);

        phoneInput.value = formatPhone(digits);

        if (!digits) {
            setFieldError(
                phoneInput,
                'Введите номер телефона.',
                'phone'
            );

            return false;
        }

        if (
            digits.length !== PHONE_DIGITS_LENGTH ||
            !digits.startsWith('7')
        ) {
            setFieldError(
                phoneInput,
                'Введите полный номер телефона.',
                'phone'
            );

            return false;
        }

        setFieldError(phoneInput, '', 'phone');

        return true;
    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    function updateMessageCounter() {
        const length = messageInput.value.length;

        if (messageCounter) {
            messageCounter.textContent =
                `${length} / ${MAX_MESSAGE_LENGTH}`;
        }
    }


    function validateMessage() {
        const value = messageInput.value.trim();

        if (value.length > MAX_MESSAGE_LENGTH) {
            setFieldError(
                messageInput,
                `Сообщение не должно превышать ${MAX_MESSAGE_LENGTH} символов.`,
                'message'
            );

            return false;
        }

        if (value) {
            clearFieldState(messageInput, 'message');
        } else {
            clearFieldState(messageInput, 'message');
        }

        return true;
    }


    /* =====================================================
       AGREEMENT
       ===================================================== */

    function validateAgreement() {
        const errorElement = getFieldError('agreement');

        const checkbox = agreementInput.closest(
            '.contact-form__checkbox'
        );

        if (!agreementInput.checked) {
            if (checkbox) {
                checkbox.classList.add('is-error');
            }

            agreementInput.setAttribute(
                'aria-invalid',
                'true'
            );

            if (errorElement) {
                errorElement.textContent =
                    'Необходимо согласиться на обработку персональных данных.';
            }

            return false;
        }

        if (checkbox) {
            checkbox.classList.remove('is-error');
        }

        agreementInput.setAttribute(
            'aria-invalid',
            'false'
        );

        if (errorElement) {
            errorElement.textContent = '';
        }

        return true;
    }


    /* =====================================================
       HONEYPOT
       ===================================================== */

    function validateHoneypot() {
        return websiteInput.value.trim() === '';
    }


    /* =====================================================
       FORM VALIDATION
       ===================================================== */

    function validateForm() {
        const nameValid = validateName();
        const phoneValid = validatePhone();
        const messageValid = validateMessage();
        const agreementValid = validateAgreement();
        const honeypotValid = validateHoneypot();

        if (!honeypotValid) {
            setFormError(
                'Не удалось отправить заявку. Попробуйте ещё раз.'
            );

            return false;
        }

        const isValid =
            nameValid &&
            phoneValid &&
            messageValid &&
            agreementValid;

        if (!isValid) {
            setFormError(
                'Проверьте заполнение формы.'
            );
        } else {
            setFormError('');
        }

        return isValid;
    }


    /* =====================================================
       LOADING STATE
       ===================================================== */

    function setLoadingState(isLoading) {
        submitButton.disabled = isLoading;

        form.classList.toggle(
            'is-loading',
            isLoading
        );

        if (isLoading) {
            submitButton.dataset.originalText =
                submitButton.textContent;

            submitButton.textContent =
                'Отправка...';

            return;
        }

        submitButton.textContent =
            submitButton.dataset.originalText ||
            'Отправить заявку';
    }


    /* =====================================================
       SUCCESS STATE
       ===================================================== */

    function showSuccess() {
        clearFormMessages();

        form.classList.add('is-success');

        nameInput.value = '';
        phoneInput.value = '';
        messageInput.value = '';
        agreementInput.checked = false;

        clearFieldState(nameInput, 'name');
        clearFieldState(phoneInput, 'phone');
        clearFieldState(messageInput, 'message');

        const agreement =
            agreementInput.closest(
                '.contact-form__checkbox'
            );

        if (agreement) {
            agreement.classList.remove('is-error');
        }

        agreementInput.setAttribute(
            'aria-invalid',
            'false'
        );

        updateMessageCounter();
    }


    /* =====================================================
       INPUT EVENTS
       ===================================================== */

    nameInput.addEventListener('blur', () => {
        validateName();
    });


    nameInput.addEventListener('input', () => {
        clearFormMessages();

        if (nameInput.classList.contains('is-error')) {
            validateName();
        }
    });


    phoneInput.addEventListener('input', () => {
        clearFormMessages();

        applyPhoneMask();

        if (phoneInput.classList.contains('is-error')) {
            validatePhone();
        }
    });


    phoneInput.addEventListener('blur', () => {
        validatePhone();
    });


    messageInput.addEventListener('input', () => {
        clearFormMessages();

        updateMessageCounter();

        if (messageInput.classList.contains('is-error')) {
            validateMessage();
        }
    });


    messageInput.addEventListener('blur', () => {
        validateMessage();
    });


    agreementInput.addEventListener('change', () => {
        clearFormMessages();

        validateAgreement();
    });


    /* =====================================================
       SUBMIT
       ===================================================== */

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        clearFormMessages();

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        setLoadingState(true);

        /*
         * Backend/API will be connected here later.
         *
         * For now this is a frontend-only demo submission.
         */

        await new Promise((resolve) => {
            window.setTimeout(resolve, 700);
        });

        setLoadingState(false);

        showSuccess();
    });


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    phoneInput.placeholder = PHONE_PLACEHOLDER;

    updateMessageCounter();

    nameInput.setAttribute('aria-invalid', 'false');
    phoneInput.setAttribute('aria-invalid', 'false');
    messageInput.setAttribute('aria-invalid', 'false');
    agreementInput.setAttribute('aria-invalid', 'false');
}
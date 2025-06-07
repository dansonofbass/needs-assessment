// Form state management
let currentPage = 1;
let formData = {};
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwC9b3S3x410hDwX4vl-q_-LmPjGFsDEODpR9hhrDk33lXhXB0LELBpilflS11pu_tGLQ/exec';

// DOM Elements
const form = document.getElementById('requirementsForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const steps = document.querySelectorAll('.step');

// Common questions for all services
const commonQuestions = [
    {
        type: 'text',
        label: 'اسم شما چیه؟',
        required: true,
        name: 'name'
    },
    {
        type: 'email',
        label: 'ایمیلت رو لطف می‌کنی؟',
        required: true,
        name: 'email'
    },
    {
        type: 'tel',
        label: 'شماره تماس (اختیاریه ولی اگر بزاری راحت‌تر می‌تونیم در تماس باشیم)',
        required: false,
        name: 'phone'
    },
    {
        type: 'text',
        label: 'اسم برند یا شرکتت چیه؟ (اگه نداری، مهم نیست)',
        required: false,
        name: 'company'
    },
    {
        type: 'text',
        label: 'وب‌سایت فعلی داری؟ آدرسش رو برامون بنویس.',
        required: false,
        name: 'current_website'
    }
];

// Service-specific questions
const serviceQuestions = {
    website: [
        {
            type: 'select',
            label: 'چه نوع سایتی مد نظرته؟',
            required: true,
            name: 'website_type',
            options: ['شرکتی', 'فروشگاهی', 'شخصی', 'نمونه‌کار', 'سایر']
        },
        {
            type: 'textarea',
            label: 'این سایت قراره چه هدفی رو دنبال کنه؟',
            required: true,
            name: 'website_purpose'
        },
        {
            type: 'select',
            label: 'محتوای سایت آماده‌ست یا کمک برای تولید محتوا می‌خوای؟',
            required: true,
            name: 'content_status',
            options: ['آماده دارم', 'نیاز به کمک دارم', 'مشخص نیست']
        },
        {
            type: 'select',
            label: 'طراحی خاص مد نظرته یا با قالب آماده مشکلی نداری؟',
            required: true,
            name: 'design_type',
            options: ['طراحی اختصاصی', 'قالب آماده', 'مشخص نیست']
        },
        {
            type: 'select',
            label: 'می‌خوای چند زبانه باشه سایتت؟',
            required: true,
            name: 'language_count',
            options: ['تک زبانه', 'دو زبانه', 'چند زبانه']
        },
        {
            type: 'select',
            label: 'بازه بودجه‌ات برای طراحی سایت حدوداً چقدره؟',
            required: true,
            name: 'budget_range',
            options: ['کمتر از ۵ میلیون', '۵ تا ۱۰ میلیون', '۱۰ تا ۲۰ میلیون', 'بیشتر از ۲۰ میلیون']
        }
    ],
    software: [
        {
            type: 'textarea',
            label: 'بگو نرم‌افزارت قراره چه مشکلی رو حل کنه؟',
            required: true,
            name: 'software_problem'
        },
        {
            type: 'select',
            label: 'دوست داری این نرم‌افزار روی موبایل باشه، تحت وب، یا دسکتاپ؟',
            required: true,
            name: 'software_platform',
            options: ['موبایل', 'تحت وب', 'دسکتاپ', 'ترکیبی']
        },
        {
            type: 'textarea',
            label: 'آیا با سیستم دیگه‌ای هم باید ارتباط داشته باشه؟',
            required: false,
            name: 'system_integration'
        },
        {
            type: 'select',
            label: 'چه امکاناتی برات مهم‌ترن؟',
            required: true,
            name: 'important_features',
            options: ['امنیت', 'سرعت', 'گرافیک', 'سادگی', 'ترکیبی']
        },
        {
            type: 'select',
            label: 'آیا از قبل مستنداتی یا نمونه فرآیندهایی آماده کردی؟',
            required: true,
            name: 'documentation_status',
            options: ['بله', 'خیر', 'در حال آماده‌سازی']
        },
        {
            type: 'select',
            label: 'برای اجرا و تحویل پروژه، چه بازه زمانی مد نظرت هست؟',
            required: true,
            name: 'timeline',
            options: ['کمتر از ۱ ماه', '۱ تا ۳ ماه', '۳ تا ۶ ماه', 'بیشتر از ۶ ماه']
        }
    ],
    ai: [
        {
            type: 'select',
            label: 'دوست داری ایجنت هوش مصنوعی‌ت چه کاری برات انجام بده؟',
            required: true,
            name: 'ai_purpose',
            options: ['پاسخ‌دهی خودکار', 'تحلیل داده', 'پیشنهاد محصول', 'سایر']
        },
        {
            type: 'textarea',
            label: 'الان چه دیتایی در اختیار داری که ایجنت ازش استفاده کنه؟',
            required: true,
            name: 'available_data'
        },
        {
            type: 'select',
            label: 'چقدر دوست داری ایجنتت شخصی‌سازی بشه؟',
            required: true,
            name: 'customization_level',
            options: ['خیلی زیاد', 'معمولی', 'فرقی نمی‌کنه']
        },
        {
            type: 'select',
            label: 'می‌خوای ایجنت توی کجا فعال باشه؟',
            required: true,
            name: 'ai_platform',
            options: ['سایت', 'چت‌بات', 'اینستاگرام', 'CRM', 'سایر']
        },
        {
            type: 'select',
            label: 'با چه زبانی باید با کاربر ارتباط بگیره؟',
            required: true,
            name: 'language',
            options: ['فارسی', 'انگلیسی', 'ترکیبی']
        },
        {
            type: 'select',
            label: 'ترجیح می‌دی ارتباط با انسان هم باشه یا کاملاً خودکار باشه؟',
            required: true,
            name: 'automation_level',
            options: ['کاملاً خودکار', 'ترکیبی با انسان', 'فقط انسان']
        }
    ],
    seo: [
        {
            type: 'textarea',
            label: 'الان سایتت روی گوگل چطور دیده می‌شه؟ قبلاً کاری براش انجام دادی؟',
            required: true,
            name: 'current_seo_status'
        },
        {
            type: 'select',
            label: 'هدفت از سئو چیه؟',
            required: true,
            name: 'seo_goal',
            options: ['افزایش بازدید', 'فروش', 'دیده شدن برند', 'ترکیبی']
        },
        {
            type: 'textarea',
            label: 'روی چه کلمات کلیدی می‌خوای تمرکز کنی؟',
            required: true,
            name: 'target_keywords'
        },
        {
            type: 'select',
            label: 'نیاز به تولید محتوا یا بلاگ هم داری؟',
            required: true,
            name: 'content_needs',
            options: ['بله', 'خیر', 'مشخص نیست']
        },
        {
            type: 'select',
            label: 'با تبلیغات گوگل یا اینستاگرام موافقی یا فقط سئوی ارگانیک می‌خوای؟',
            required: true,
            name: 'marketing_preference',
            options: ['فقط سئو', 'ترکیبی', 'مشخص نیست']
        },
        {
            type: 'select',
            label: 'بودجه ماهانه یا کلیت چقدره؟',
            required: true,
            name: 'seo_budget',
            options: ['کمتر از ۵ میلیون', '۵ تا ۱۰ میلیون', '۱۰ تا ۲۰ میلیون', 'بیشتر از ۲۰ میلیون']
        }
    ],
    automation: [
        {
            type: 'textarea',
            label: 'بگو کدوم بخش از کارات وقت زیادی می‌گیره یا دستی انجام می‌شه؟',
            required: true,
            name: 'automation_needs'
        },
        {
            type: 'textarea',
            label: 'الان از چه نرم‌افزارهایی استفاده می‌کنی؟',
            required: true,
            name: 'current_software'
        },
        {
            type: 'textarea',
            label: 'به نظرت بزرگ‌ترین چالش توی فرآیندهای فعلی چیه؟',
            required: true,
            name: 'current_challenges'
        },
        {
            type: 'textarea',
            label: 'دوست داری سیستم جدید چه خروجی‌هایی برات داشته باشه؟',
            required: true,
            name: 'expected_outputs'
        },
        {
            type: 'select',
            label: 'چند نفر قراره از این سیستم استفاده کنن؟',
            required: true,
            name: 'user_count',
            options: ['کمتر از ۵ نفر', '۵ تا ۱۰ نفر', '۱۰ تا ۲۰ نفر', 'بیشتر از ۲۰ نفر']
        },
        {
            type: 'select',
            label: 'چه سطح دسترسی یا امنیتی برات مهمه؟',
            required: true,
            name: 'security_level',
            options: ['پایه', 'متوسط', 'پیشرفته', 'خیلی پیشرفته']
        }
    ]
};

// Final questions for all services
const finalQuestions = [
    {
        type: 'textarea',
        label: 'اگر نمونه سایتی یا نرم‌افزاری دیدی که دوست داشتی، لطفاً آدرسش رو برامون بنویس.',
        required: false,
        name: 'reference_examples'
    },
    {
        type: 'select',
        label: 'چه زمانی دوست داری پروژه شروع بشه؟',
        required: true,
        name: 'project_start',
        options: ['فوری', 'تا یک ماه', 'تا سه ماه', 'بعد از سه ماه']
    },
    {
        type: 'textarea',
        label: 'چیزی هست که فکر می‌کنی ما باید بدونیم تا بهتر بتونیم کمکت کنیم؟',
        required: false,
        name: 'additional_info'
    },
    {
        type: 'select',
        label: 'آیا مایل هستی یه جلسه رایگان مشاوره با ما داشته باشی؟',
        required: true,
        name: 'consultation_meeting',
        options: ['بله', 'خیر']
    }
];

// Initialize form pages
function initializeForm() {
    // Add general questions to page 1
    const generalQuestionsContainer = document.getElementById('generalQuestions');
    commonQuestions.forEach(question => {
        generalQuestionsContainer.appendChild(createFormGroup(question));
    });

    // Add final questions to page 3
    const finalQuestionsContainer = document.getElementById('finalQuestions');
    finalQuestions.forEach(question => {
        finalQuestionsContainer.appendChild(createFormGroup(question));
    });

    // Show first page
    showPage(1);
}

// Show specific page
function showPage(pageNumber) {
    // Hide all pages
    document.querySelectorAll('.form-page').forEach(page => {
        page.style.display = 'none';
    });

    // Show selected page
    document.getElementById(`page${pageNumber}`).style.display = 'block';

    // Update step indicators
    steps.forEach(step => {
        const stepNumber = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        if (stepNumber === pageNumber) {
            step.classList.add('active');
        } else if (stepNumber < pageNumber) {
            step.classList.add('completed');
        }
    });

    // Update navigation buttons
    updateNavigation();
}

function createFormGroup(question) {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const label = document.createElement('label');
    label.textContent = question.label;
    label.htmlFor = question.name;

    let input;
    if (question.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 4;
    } else if (question.type === 'select') {
        input = document.createElement('select');
        question.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });
    } else {
        input = document.createElement('input');
        input.type = question.type;
    }

    input.id = question.name;
    input.name = question.name;
    input.required = question.required;

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    return formGroup;
}

// Handle service selection
document.querySelectorAll('input[name="service"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const selectedService = e.target.value;
        const serviceQuestionsContainer = document.getElementById('serviceSpecificQuestions');
        serviceQuestionsContainer.innerHTML = '';
        
        // Add service-specific questions
        const questions = serviceQuestions[selectedService];
        questions.forEach(question => {
            serviceQuestionsContainer.appendChild(createFormGroup(question));
        });
        
        serviceQuestionsContainer.style.display = 'block';
    });
});

// Form navigation
nextBtn.addEventListener('click', () => {
    if (validateCurrentPage()) {
        if (currentPage < 3) {
            currentPage++;
            showPage(currentPage);
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Since we're using no-cors, we can't read the response
        // We'll assume success if we get here
        showSuccessMessage();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('خطا در ارسال فرم. لطفاً دوباره تلاش کنید.');
    }
});

// Validation functions
function validateCurrentPage() {
    const currentPageElement = document.getElementById(`page${currentPage}`);
    const inputs = currentPageElement.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
            isValid = false;
            showError(input, 'این فیلد الزامی است');
        } else {
            clearError(input);
        }
    });

    if (!isValid) {
        alert('لطفاً تمام فیلدهای الزامی را پر کنید.');
    }

    return isValid;
}

function validateForm() {
    // Validate all pages
    for (let i = 1; i <= 3; i++) {
        const pageElement = document.getElementById(`page${i}`);
        const inputs = pageElement.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                showError(input, 'این فیلد الزامی است');
                return false;
            }
        });
    }

    // Validate service selection
    const selectedService = document.querySelector('input[name="service"]:checked')?.value;
    if (!selectedService) {
        alert('لطفاً یک سرویس را انتخاب کنید');
        return false;
    }

    return true;
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    input.classList.add('error');
}

function clearError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    input.classList.remove('error');
}

// Navigation update
function updateNavigation() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.style.display = currentPage === 3 ? 'none' : 'block';
    submitBtn.style.display = currentPage === 3 ? 'block' : 'none';
}

// Success message
function showSuccessMessage() {
    form.style.display = 'none';
    successMessage.style.display = 'block';
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeForm); 
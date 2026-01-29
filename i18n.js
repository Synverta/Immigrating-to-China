// i18n - Internationalization Support
class I18n {
    constructor() {
        // Default language is English (as requested in the issue)
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.translations = translations || {};
        this.init();
    }
    
    init() {
        // Set initial language
        this.setLanguage(this.currentLanguage, false);
        
        // Add language selector event listeners
        this.attachLanguageSelectorListeners();
    }
    
    getStoredLanguage() {
        try {
            return localStorage.getItem('selectedLanguage');
        } catch (e) {
            return null;
        }
    }
    
    setStoredLanguage(lang) {
        try {
            localStorage.setItem('selectedLanguage', lang);
        } catch (e) {
            // LocalStorage not available
        }
    }
    
    setLanguage(lang, updateUI = true) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not found`);
            return;
        }
        
        this.currentLanguage = lang;
        this.setStoredLanguage(lang);
        
        if (updateUI) {
            this.updatePageContent();
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        
        // Update meta tags
        this.updateMetaTags();
        
        // Update active language in selector
        this.updateLanguageSelector();
        
        // Update text direction for RTL languages
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    }
    
    updateMetaTags() {
        const lang = this.currentLanguage;
        const t = this.translations[lang];
        
        // Update title
        document.title = t['meta.title'];
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', t['meta.description']);
        }
        
        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', t['meta.keywords']);
        }
    }
    
    updatePageContent() {
        const lang = this.currentLanguage;
        const t = this.translations[lang];
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.hasAttribute('placeholder')) {
                        // For placeholders in inputs/textareas - not currently used
                    } else {
                        element.value = t[key];
                    }
                } else if (element.tagName === 'OPTION') {
                    element.textContent = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });
        
        // Update elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (t[key]) {
                element.setAttribute('placeholder', t[key]);
            }
        });
        
        // Update form labels
        document.querySelectorAll('label[data-i18n]').forEach(label => {
            const key = label.getAttribute('data-i18n');
            if (t[key]) {
                label.textContent = t[key];
            }
        });
    }
    
    t(key) {
        const lang = this.currentLanguage;
        return this.translations[lang]?.[key] || key;
    }
    
    updateLanguageSelector() {
        // Update dropdown display
        const currentLangDisplay = document.getElementById('currentLang');
        if (currentLangDisplay) {
            const langNames = {
                'en': 'English',
                'zh': '中文',
                'es': 'Español',
                'fr': 'Français',
                'ar': 'العربية',
                'ru': 'Русский',
                'ja': '日本語'
            };
            currentLangDisplay.textContent = langNames[this.currentLanguage] || 'Language';
        }
        
        // Update active state in dropdown items
        document.querySelectorAll('.lang-option').forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            if (optionLang === this.currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    attachLanguageSelectorListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupLanguageSelector();
            });
        } else {
            this.setupLanguageSelector();
        }
    }
    
    setupLanguageSelector() {
        const langToggle = document.getElementById('langToggle');
        const langDropdown = document.getElementById('langDropdown');
        
        if (langToggle && langDropdown) {
            // Toggle dropdown on click
            langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                langDropdown.classList.remove('show');
            });
            
            // Prevent dropdown from closing when clicking inside
            langDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Add click listeners to language options
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                if (lang && lang !== this.currentLanguage) {
                    this.setLanguage(lang);
                    if (langDropdown) {
                        langDropdown.classList.remove('show');
                    }
                }
            });
        });
        
        // Initialize page content with current language
        this.updatePageContent();
    }
}

// Initialize i18n when DOM is ready
let i18n;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n = new I18n();
    });
} else {
    i18n = new I18n();
}

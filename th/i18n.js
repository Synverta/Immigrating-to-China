// i18n - Internationalization Support
class I18n {
    constructor() {
        // Use language from URL/page if set, otherwise get from storage or default to English
        this.currentLanguage = window.__INITIAL_LANG__ || this.getStoredLanguage() || 'en';
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
        
        // Update meta tags (only if DOM is ready)
        if (document.readyState !== 'loading') {
            this.updateMetaTags();
            this.updateLanguageSelector();
        }
        
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
                // Only update textContent for non-input elements
                if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
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
                'ja': '日本語',
                'vi': 'Tiếng Việt',
                'th': 'ภาษาไทย'
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
                this.updateMetaTags();
                this.updateLanguageSelector();
            });
        } else {
            this.setupLanguageSelector();
            this.updateMetaTags();
            this.updateLanguageSelector();
        }
    }
    
    setupLanguageSelector() {
        const langToggle = document.getElementById('langToggle');
        const langDropdown = document.getElementById('langDropdown');
        
        if (langToggle && langDropdown) {
            // Toggle dropdown on click
            langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = langDropdown.classList.contains('show');
                langDropdown.classList.toggle('show');
                langToggle.setAttribute('aria-expanded', !isExpanded);
            });
            
            // Keyboard support for toggle button
            langToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isExpanded = langDropdown.classList.contains('show');
                    langDropdown.classList.toggle('show');
                    langToggle.setAttribute('aria-expanded', !isExpanded);
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                langDropdown.classList.remove('show');
                langToggle.setAttribute('aria-expanded', 'false');
            });
            
            // Prevent dropdown from closing when clicking inside
            langDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Add click listeners to language options
        // If links have href attributes (language-specific pages), use default navigation
        // Otherwise, use JavaScript language switching
        document.querySelectorAll('.lang-option').forEach(option => {
            const href = option.getAttribute('href');
            const hasValidHref = href && href !== '#';
            
            if (!hasValidHref) {
                // JavaScript-based language switching (fallback)
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = option.getAttribute('data-lang');
                    if (lang && lang !== this.currentLanguage) {
                        this.setLanguage(lang);
                        if (langDropdown) {
                            langDropdown.classList.remove('show');
                            if (langToggle) {
                                langToggle.setAttribute('aria-expanded', 'false');
                            }
                        }
                    }
                });
                
                // Keyboard support for language options
                option.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const lang = option.getAttribute('data-lang');
                        if (lang && lang !== this.currentLanguage) {
                            this.setLanguage(lang);
                            if (langDropdown) {
                                langDropdown.classList.remove('show');
                                if (langToggle) {
                                    langToggle.setAttribute('aria-expanded', 'false');
                                    langToggle.focus();
                                }
                            }
                        }
                    }
                });
            } else {
                // For language-specific pages, just close dropdown on click
                option.addEventListener('click', () => {
                    if (langDropdown) {
                        langDropdown.classList.remove('show');
                        if (langToggle) {
                            langToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            }
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

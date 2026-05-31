/**
 * Utility để bảo vệ nội dung khỏi Google Translate
 */

class NoTranslateProtection {
    constructor() {
        this.protectedSelectors = [
            // Nội dung chính
            '.prose',
            '[v-html]',
            '.content-dynamic',
            
            // Tiêu đề và mô tả
            '.title-dynamic',
            '.description-dynamic',
            
            // Các phần tử đặc biệt
            '.product-content',
            '.post-content',
            '.service-content',
            '.member-bio',
            
            // Form và input
            'input[type="text"]',
            'textarea',
            
            // Navigation và menu
            '.menu-item',
            '.nav-link'
        ];
        
        this.observer = null;
        this.init();
    }

    init() {
        // Chạy khi DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.protectExistingElements());
        } else {
            this.protectExistingElements();
        }

        // Theo dõi các phần tử mới được thêm vào
        this.setupMutationObserver();
        
        // Ẩn Google Translate UI
        this.hideGoogleTranslateUI();
    }

    protectExistingElements() {
        // Bảo vệ các phần tử hiện có
        this.protectedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => this.protectElement(element));
        });

        // Bảo vệ các phần tử có v-html
        const vHtmlElements = document.querySelectorAll('[v-html]');
        vHtmlElements.forEach(element => this.protectElement(element));
        
        // Bảo vệ nội dung động cụ thể
        this.protectSpecificContent();
    }

    protectElement(element) {
        if (!element || element.hasAttribute('data-notranslate-protected')) {
            return;
        }

        // Thêm các class và attribute cần thiết
        element.classList.add('notranslate');
        element.setAttribute('translate', 'no');
        element.setAttribute('data-notranslate-protected', 'true');
        
        // Bảo vệ tất cả phần tử con
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            child.classList.add('notranslate');
            child.setAttribute('translate', 'no');
        });
    }

    protectSpecificContent() {
        // Bảo vệ nội dung bài viết
        const postContent = document.querySelectorAll('.prose-blog, .prose-policy, .prose-member');
        postContent.forEach(element => this.protectElement(element));

        // Bảo vệ feedback và review
        const feedbackContent = document.querySelectorAll('[v-html*="content"], [v-html*="description"]');
        feedbackContent.forEach(element => this.protectElement(element));

        // Bảo vệ tiêu đề động
        const dynamicTitles = document.querySelectorAll('[v-html*="title"]');
        dynamicTitles.forEach(element => this.protectElement(element));
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Kiểm tra nếu phần tử mới cần bảo vệ
                        this.protectedSelectors.forEach(selector => {
                            if (node.matches && node.matches(selector)) {
                                this.protectElement(node);
                            }
                            
                            // Kiểm tra các phần tử con
                            const childElements = node.querySelectorAll(selector);
                            childElements.forEach(child => this.protectElement(child));
                        });
                    }
                });
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    hideGoogleTranslateUI() {
        const hideElements = () => {
            // Ẩn banner Google Translate
            const banners = document.querySelectorAll('.goog-te-banner-frame, iframe.goog-te-banner-frame');
            banners.forEach(banner => {
                banner.style.setProperty('display', 'none', 'important');
                if (banner.parentNode) {
                    try {
                        banner.parentNode.removeChild(banner);
                    } catch (e) {
                        // Ignore error
                    }
                }
            });

            // Ẩn các popup và menu
            const popups = document.querySelectorAll('.goog-te-balloon-frame, .goog-te-menu-frame, #goog-gt-tt');
            popups.forEach(popup => {
                popup.style.setProperty('display', 'none', 'important');
            });

            // Reset body position
            document.body.style.setProperty('top', '0px', 'important');
        };

        // Chạy ngay lập tức
        hideElements();

        // Chạy định kỳ để đảm bảo
        setInterval(hideElements, 1000);

        // Theo dõi khi Google Translate inject UI
        const observer = new MutationObserver(hideElements);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Phương thức để bảo vệ một phần tử cụ thể từ bên ngoài
    static protect(element) {
        const instance = new NoTranslateProtection();
        instance.protectElement(element);
    }

    // Phương thức để bảo vệ theo selector
    static protectBySelector(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => NoTranslateProtection.protect(element));
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Tự động khởi tạo
const noTranslateProtection = new NoTranslateProtection();

// Export để sử dụng trong các component khác
export default NoTranslateProtection;
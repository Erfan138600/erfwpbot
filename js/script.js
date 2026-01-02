// تولید شماره فاکتور تصادفی
function generateInvoiceNumber() {
    const prefix = 'INV';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

// تبدیل تاریخ میلادی به شمسی (ساده)
function getCurrentPersianDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fa-IR', options);
}

// فرمت‌دهی عدد با جداکننده هزارگان
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// مدیریت فرم
const form = document.getElementById('invoiceForm');
const invoicePreview = document.getElementById('invoicePreview');
const invoice = document.getElementById('invoice');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // دریافت مقادیر از فرم
    const customerName = document.getElementById('customerName').value;
    const volume = document.getElementById('volume').value;
    const price = document.getElementById('price').value;
    const duration = document.getElementById('duration').value;
    const description = document.getElementById('description').value;

    // پر کردن اطلاعات فاکتور
    document.getElementById('invoiceNumber').textContent = generateInvoiceNumber();
    document.getElementById('invoiceDate').textContent = getCurrentPersianDate();
    document.getElementById('displayCustomerName').textContent = customerName;
    document.getElementById('displayVolume').textContent = formatNumber(volume);
    document.getElementById('displayDuration').textContent = duration;
    document.getElementById('displayPrice').textContent = formatNumber(price);
    document.getElementById('displayTotal').textContent = formatNumber(price);

    // نمایش توضیحات اگر وارد شده باشد
    const descriptionSection = document.getElementById('descriptionSection');
    const displayDescription = document.getElementById('displayDescription');
    
    if (description.trim()) {
        displayDescription.textContent = description;
        descriptionSection.style.display = 'block';
    } else {
        descriptionSection.style.display = 'none';
    }

    // نمایش پیش‌نمایش فاکتور
    invoicePreview.style.display = 'block';
    
    // اسکرول به فاکتور
    invoicePreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ذخیره فاکتور به عنوان تصویر
document.getElementById('saveImage').addEventListener('click', async function() {
    const button = this;
    const originalText = button.textContent;
    
    try {
        // تغییر متن دکمه
        button.textContent = '⏳ در حال ایجاد تصویر...';
        button.disabled = true;

        // استفاده از html2canvas برای تبدیل فاکتور به تصویر
        const canvas = await html2canvas(invoice, {
            scale: 2, // کیفیت بالاتر
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });

        // تبدیل canvas به blob
        canvas.toBlob(function(blob) {
            // ایجاد لینک دانلود
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const invoiceNumber = document.getElementById('invoiceNumber').textContent;
            link.download = `فاکتور-${invoiceNumber}.png`;
            link.href = url;
            link.click();
            
            // آزاد سازی حافظه
            URL.revokeObjectURL(url);
            
            // بازگردانی دکمه
            button.textContent = originalText;
            button.disabled = false;
            
            // نمایش پیام موفقیت
            showNotification('✅ فاکتور با موفقیت ذخیره شد!');
        }, 'image/png');

    } catch (error) {
        console.error('خطا در ذخیره تصویر:', error);
        button.textContent = originalText;
        button.disabled = false;
        showNotification('❌ خطا در ذخیره تصویر. لطفا دوباره تلاش کنید.');
    }
});

// دکمه فاکتور جدید
document.getElementById('newInvoice').addEventListener('click', function() {
    // پاک کردن فرم
    form.reset();
    
    // مخفی کردن پیش‌نمایش
    invoicePreview.style.display = 'none';
    
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// تابع نمایش اعلان
function showNotification(message) {
    // ایجاد المان اعلان
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // حذف اعلان بعد از 3 ثانیه
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// افزودن انیمیشن‌ها به CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

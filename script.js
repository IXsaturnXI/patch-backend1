// ==========================================
// 1. ระบบ Dark / Light Mode
// ==========================================
(function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        if (document.body) document.body.classList.add('dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const setupThemeButton = () => {
        let themeBtn = document.getElementById('darkModeToggle');
        
        if (!themeBtn) {
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                themeBtn = document.createElement('button');
                themeBtn.id = 'darkModeToggle';
                themeBtn.className = 'theme-toggle-btn';
                themeBtn.setAttribute('title', 'สลับโหมดสว่าง/มืด');
                headerRight.prepend(themeBtn);
            }
        }

        if (themeBtn) {
            const isDark = document.body.classList.contains('dark-mode');
            themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        }
    };

    setupThemeButton();

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#darkModeToggle');
        if (btn) {
            document.body.classList.toggle('dark-mode');
            document.documentElement.classList.toggle('dark-mode');
            
            const isDarkNow = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
            
            btn.innerHTML = isDarkNow ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        }
    });

    // ==========================================
    // 2. ตั้งค่า Supabase Client
    // ==========================================
    const SUPABASE_URL = 'https://lcmqqovjgdkcbwyxxfwa.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_ljqn7Kr_anpQJ2k7PvHSig_zRSS5o-8';
    let supabaseClient;

    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // ==========================================
    // 3. ฟังก์ชันสลับปุ่ม เข้าสู่ระบบ / ออกจากระบบ บน Navbar
    // ==========================================
    async function checkGlobalAuthNavbar() {
        if (!supabaseClient) return;
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            const loginBtns = document.querySelectorAll('.header-right a[href="login.html"], .header-right #global-logout-btn');
            
            loginBtns.forEach(btn => {
                if (session && session.user) {
                    btn.textContent = 'ออกจากระบบ';
                    btn.href = '#';
                    btn.id = 'global-logout-btn';
                    btn.onclick = async (e) => {
                        e.preventDefault();
                        await supabaseClient.auth.signOut();
                        window.location.href = 'login.html';
                    };
                }
            });
        } catch (err) {
            console.log('Navbar Auth Check:', err);
        }
    }

    checkGlobalAuthNavbar();

    // ==========================================
    // 4. ข้อมูล Mock Data สำรอง (ครอบคลุมทุกหมวดหมู่และราคา)
    // ==========================================
    const mockPlaces = [
        {
            id: 1,
            name: 'The Quad Coffee',
            category: 'คาเฟ่และพื้นที่อ่านหนังสือ',
            rating: 4.8,
            distance_km: 0.2,
            is_open: true,
            price: '$$',
            discount: 'ส่วนลดนักศึกษา 15%',
            image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=500'
        },
        {
            id: 2,
            name: 'ศูนย์อาหาร SC (Green Canteen)',
            category: 'อาหารและเครื่องดื่ม',
            rating: 4.5,
            distance_km: 0.5,
            is_open: true,
            price: '$',
            discount: '',
            image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500'
        },
        {
            id: 3,
            name: 'เดอะ เดลี่ แกรนด์ คาเฟ่',
            category: 'คาเฟ่และอาหารว่าง',
            rating: 4.6,
            distance_km: 0.8,
            is_open: true,
            price: '$$',
            discount: 'เมนูใหม่โปรแรง',
            image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500'
        },
        {
            id: 4,
            name: 'Board Game Club เชียงราก',
            category: 'ศูนย์รวมเกม',
            rating: 4.7,
            distance_km: 1.2,
            is_open: false,
            price: '$',
            discount: '',
            image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500'
        },
        {
            id: 5,
            name: 'ศูนย์บริการนักศึกษา & ปริ้นท์งาน มธ.',
            category: 'บริการนักศึกษา',
            rating: 4.3,
            distance_km: 0.3,
            is_open: true,
            price: '$',
            discount: 'ปริ้นท์สีราคาพิเศษ',
            image_url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=500'
        },
        {
            id: 6,
            name: 'ก๋วยเตี๋ยวเรือท่าช้าง มธ.',
            category: 'อาหารและเครื่องดื่ม',
            rating: 4.9,
            distance_km: 0.4,
            is_open: true,
            price: '$',
            discount: 'แถมแคปหมูเมื่อเช็คอิน',
            image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500'
        },
        {
            id: 7,
            name: 'Shabu House Chiangraak',
            category: 'อาหารและเครื่องดื่ม',
            rating: 4.2,
            distance_km: 1.5,
            is_open: true,
            price: '$$$',
            discount: 'มา 4 จ่าย 3',
            image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'
        },
        {
            id: 8,
            name: 'Library Cafe & Study Zone',
            category: 'คาเฟ่และพื้นที่อ่านหนังสือ',
            rating: 3.9,
            distance_km: 0.6,
            is_open: false,
            price: '$$',
            discount: '',
            image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500'
        }
    ];

    // ==========================================
    // 5. ระบบ บันทึกร้านค้า (Bookmarks / Saved Places)
    // ==========================================
    const getSavedPlaces = () => {
        return JSON.parse(localStorage.getItem('saved_places_ids')) || [];
    };

    const toggleSavePlace = (placeId) => {
        let saved = getSavedPlaces();
        const strId = String(placeId);
        if (saved.includes(strId)) {
            saved = saved.filter(id => id !== strId);
        } else {
            saved.push(strId);
        }
        localStorage.setItem('saved_places_ids', JSON.stringify(saved));
        return saved.includes(strId);
    };

    function createCardHTML(place) {
        const savedPlaces = getSavedPlaces();
        const isSaved = savedPlaces.includes(String(place.id));
        const heartClass = isSaved ? 'fa-solid fa-heart saved' : 'fa-regular fa-heart';
        const badgeDiscountHTML = place.discount 
            ? `<span class="badge badge-discount">${place.discount}</span>` 
            : '';

        return `
            <div class="card-link" style="position: relative;">
                <button class="bookmark-btn" data-id="${place.id}" title="บันทึกร้านนี้" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: rgba(255,255,255,0.85); border: none; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s;">
                    <i class="${heartClass}" style="color: ${isSaved ? '#e63946' : '#666'}; font-size: 16px;"></i>
                </button>
                <a href="detail.html?id=${place.id}" style="text-decoration: none; color: inherit;">
                    <div class="card">
                        <div class="card-image">
                            <img src="${place.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24'}" alt="${place.name}">
                            <span class="badge badge-rating">★ ${place.rating || '0'}</span>
                            ${badgeDiscountHTML}
                        </div>
                        <div class="card-info">
                            <h3>${place.name}</h3>
                            <p class="desc">${place.category || 'ร้านอาหาร'}</p>
                            <div class="card-footer">
                                <span>📍 ${place.distance_km !== undefined ? 'ใกล้ ' + place.distance_km + ' กม.' : ''}</span>
                                <span class="price">${place.price || '$$'}</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>`;
    }

    document.addEventListener('click', (e) => {
        const bookmarkBtn = e.target.closest('.bookmark-btn');
        if (bookmarkBtn) {
            e.preventDefault();
            e.stopPropagation();
            const placeId = bookmarkBtn.getAttribute('data-id');
            const isNowSaved = toggleSavePlace(placeId);
            
            const icon = bookmarkBtn.querySelector('i');
            if (isNowSaved) {
                icon.className = 'fa-solid fa-heart saved';
                icon.style.color = '#e63946';
            } else {
                icon.className = 'fa-regular fa-heart';
                icon.style.color = '#666';
                
                const savedContainer = document.getElementById('saved-cards-grid');
                if (savedContainer) {
                    bookmarkBtn.closest('.card-link').remove();
                    if (savedContainer.children.length === 0) {
                        savedContainer.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 40px 0;">ยังไม่มีรายการที่บันทึกไว้</p>';
                    }
                }
            }
        }
    });

    // ==========================================
    // 6. ตัวกรองและการแสดงผลการ์ดร้านค้าแบบสมบูรณ์
    // ==========================================
    const filterOpen = document.getElementById('filter-open');
    const filterDistance = document.getElementById('filter-distance');
    const filterRating = document.getElementById('filter-rating');
    const cardGrid = document.querySelector('.card-grid');

    if (cardGrid && !document.getElementById('saved-cards-grid')) {
        let displayLimit = 6;
        let currentFilteredPlaces = [];

        const fetchFilteredPlaces = async () => {
            // 1. ดึงข้อความจากช่องค้นหา
            let searchQuery = '';
            const searchInputs = document.querySelectorAll('.search-box input');
            searchInputs.forEach(input => {
                if (input.value.trim()) searchQuery = input.value.trim().toLowerCase();
            });

            // 2. ดึงปุ่มหมวดหมู่ที่เลือก
            const activeCatBtn = document.querySelector('.category-list .cat-btn.active');
            const catText = activeCatBtn ? activeCatBtn.textContent.trim() : 'ร้านทั้งหมด';

            // 3. ดึงค่าตัวกรองด่วน (Checkboxes)
            const isOpenChecked = filterOpen && filterOpen.checked;
            const isDistChecked = filterDistance && filterDistance.checked;
            const isRatingChecked = filterRating && filterRating.checked;

            // 4. ดึงค่าช่วงราคา
            const activePriceBtn = document.querySelector('.price-btn-group .price-btn.active');
            const priceValue = activePriceBtn ? activePriceBtn.textContent.trim() : null;

            // 5. ดึงค่าการเรียงลำดับ
            const sortSelect = document.querySelector('.sort-dropdown select');
            const sortVal = sortSelect ? sortSelect.value : 'recommended';

            let rawPlaces = [];

            // พยายามโหลดข้อมูลจาก Supabase ถ้ามี
            if (supabaseClient) {
                try {
                    const { data, error } = await supabaseClient.from('places').select('*');
                    if (!error && data && data.length > 0) {
                        rawPlaces = data;
                    }
                } catch (err) {
                    console.error('Supabase fetch error:', err);
                }
            }

            // หากไม่มีข้อมูลจากฐานข้อมูลให้ใช้ Mock Data
            if (rawPlaces.length === 0) {
                rawPlaces = mockPlaces;
            }

            // ประมวลผลตัวกรองทุกประเภทพร้อมกัน
            currentFilteredPlaces = rawPlaces.filter(place => {
                // ค้นหาคำค้น Keyword
                if (searchQuery) {
                    const matchName = place.name ? place.name.toLowerCase().includes(searchQuery) : false;
                    const matchCat = place.category ? place.category.toLowerCase().includes(searchQuery) : false;
                    if (!matchName && !matchCat) return false;
                }

                // ตัวกรองหมวดหมู่
                if (catText !== 'ร้านทั้งหมด' && !catText.includes('ร้านทั้งหมด')) {
                    const pCat = (place.category || '').toLowerCase();
                    if (catText.includes('อาหาร')) {
                        if (!pCat.includes('อาหาร') && !pCat.includes('เครื่องดื่ม')) return false;
                    } else if (catText.includes('อ่านหนังสือ')) {
                        if (!pCat.includes('อ่านหนังสือ') && !pCat.includes('คาเฟ่')) return false;
                    } else if (catText.includes('เกม')) {
                        if (!pCat.includes('เกม')) return false;
                    } else if (catText.includes('บริการ')) {
                        if (!pCat.includes('บริการ')) return false;
                    } else {
                        if (!pCat.includes(catText.toLowerCase())) return false;
                    }
                }

                // ตัวกรองด่วน Checkboxes
                if (isOpenChecked && !place.is_open) return false;
                if (isDistChecked && (place.distance_km === undefined || place.distance_km > 1.0)) return false;
                if (isRatingChecked && (place.rating === undefined || place.rating < 4.0)) return false;

                // ตัวกรองช่วงราคา
                if (priceValue && priceValue !== 'ทั้งหมด') {
                    if (place.price && place.price !== priceValue) return false;
                }

                return true;
            });

            // เรียงลำดับข้อมูล
            if (sortVal === 'rating' || sortVal === 'คะแนนสูงสุด') {
                currentFilteredPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else if (sortVal === 'distance' || sortVal === 'ระยะทางใกล้ที่สุด') {
                currentFilteredPlaces.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));
            }

            renderPlaces();
        };

        function renderPlaces() {
            cardGrid.innerHTML = '';
            if (currentFilteredPlaces.length === 0) {
                cardGrid.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 40px 0;">ไม่พบร้านค้าที่ตรงกับเงื่อนไข</p>';
                const loadBtn = document.querySelector('.load-more-btn');
                if (loadBtn) loadBtn.style.display = 'none';
                return;
            }

            const placesToShow = currentFilteredPlaces.slice(0, displayLimit);
            placesToShow.forEach(place => {
                cardGrid.innerHTML += createCardHTML(place);
            });

            const loadBtn = document.querySelector('.load-more-btn');
            if (loadBtn) {
                if (displayLimit >= currentFilteredPlaces.length) {
                    loadBtn.style.display = 'none';
                } else {
                    loadBtn.style.display = 'block';
                }
            }
        }

        // --- Event Listeners สำหรับตัวกรองทั้งหมด ---
        if (filterOpen) filterOpen.addEventListener('change', () => { displayLimit = 6; fetchFilteredPlaces(); });
        if (filterDistance) filterDistance.addEventListener('change', () => { displayLimit = 6; fetchFilteredPlaces(); });
        if (filterRating) filterRating.addEventListener('change', () => { displayLimit = 6; fetchFilteredPlaces(); });

        // ปุ่มหมวดหมู่
        document.querySelectorAll('.category-list .cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-list .cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        });

        // ปุ่มช่วงราคา
        document.querySelectorAll('.price-btn-group .price-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const wasActive = btn.classList.contains('active');
                document.querySelectorAll('.price-btn-group .price-btn').forEach(b => b.classList.remove('active'));
                if (!wasActive) {
                    btn.classList.add('active');
                }
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        });

        // ช่องค้นหาข้อความ
        document.querySelectorAll('.search-box input').forEach(input => {
            input.addEventListener('input', (e) => {
                const val = e.target.value;
                document.querySelectorAll('.search-box input').forEach(other => {
                    if (other !== e.target) other.value = val;
                });
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        });

        // Dropdown เรียงลำดับ
        const sortSelect = document.querySelector('.sort-dropdown select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        }

        // ปุ่มล้างตัวกรอง
        const resetBtn = document.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.querySelectorAll('.category-list .cat-btn').forEach((b, idx) => {
                    if (idx === 0) b.classList.add('active');
                    else b.classList.remove('active');
                });
                if (filterOpen) filterOpen.checked = false;
                if (filterDistance) filterDistance.checked = false;
                if (filterRating) filterRating.checked = false;
                document.querySelectorAll('.price-btn-group .price-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.search-box input').forEach(input => input.value = '');
                if (sortSelect) sortSelect.value = 'recommended';
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        }

        // ปุ่มโหลดร้านเพิ่มเติม
        const loadBtn = document.querySelector('.load-more-btn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                displayLimit += 6;
                renderPlaces();
            });
        }

        fetchFilteredPlaces();
    }

    // ==========================================
    // 7. แสดงผลร้านค้าในหน้า "รายการที่บันทึก" (profile.html)
    // ==========================================
    const savedCardsGrid = document.getElementById('saved-cards-grid');
    if (savedCardsGrid) {
        const loadSavedPlaces = async () => {
            const savedIds = getSavedPlaces();
            if (savedIds.length === 0) {
                savedCardsGrid.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 40px 0;">ยังไม่มีรายการที่บันทึกไว้</p>';
                return;
            }

            let savedPlacesData = [];
            if (supabaseClient) {
                try {
                    const { data, error } = await supabaseClient
                        .from('places')
                        .select('*')
                        .in('id', savedIds);
                    if (!error && data) savedPlacesData = data;
                } catch (err) {
                    console.error(err);
                }
            }

            if (savedPlacesData.length === 0) {
                savedPlacesData = mockPlaces.filter(place => savedIds.includes(String(place.id)));
            }

            savedCardsGrid.innerHTML = '';
            if (savedPlacesData.length === 0) {
                savedCardsGrid.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 40px 0;">ยังไม่มีรายการที่บันทึกไว้</p>';
                return;
            }

            savedPlacesData.forEach(place => {
                savedCardsGrid.innerHTML += createCardHTML(place);
            });
        };

        loadSavedPlaces();
    }

    // ==========================================
// 8. จัดการข้อมูลโปรไฟล์ & อัปโหลดรูปภาพลง Supabase Storage
// ==========================================
const editProfileForm = document.getElementById('edit-profile-form');
const unauthView = document.getElementById('unauthenticated-view');
const authView = document.getElementById('authenticated-view');

const profileAvatarEl = document.getElementById('profile-avatar');
const profileEmailDisplay = document.getElementById('profile-email-display');

const editFullnameInput = document.getElementById('edit-fullname');
const editUsernameInput = document.getElementById('edit-username');
const editFacultyInput = document.getElementById('edit-faculty');

const avatarContainer = document.getElementById('avatar-container');
const avatarFileInput = document.getElementById('avatar-file-input');
let selectedAvatarFile = null;

// 1. ระบบกดเลือกรูปภาพและทำ Live Preview ก่อนกดบันทึก
if (avatarContainer && avatarFileInput) {
    avatarContainer.addEventListener('click', () => {
        avatarFileInput.click();
    });

    avatarFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('ขนาดไฟล์ต้องไม่เกิน 5MB ครับ');
                avatarFileInput.value = '';
                return;
            }

            selectedAvatarFile = file;

            // พรีวิวรูปภาพทันที
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (profileAvatarEl) {
                    profileAvatarEl.innerHTML = `<img src="${ev.target.result}" alt="Avatar Preview" style="width:100%; height:100%; object-fit:cover;">`;
                }
            };
            reader.readAsDataURL(selectedAvatarFile);
        }
    });
}

// 2. ดึงข้อมูล User จาก Supabase Session มาแสดงเมื่อโหลดหน้า
if (authView && unauthView && typeof supabaseClient !== 'undefined') {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (!session || !session.user) {
            unauthView.style.display = 'block';
            authView.style.display = 'none';
        } else {
            unauthView.style.display = 'none';
            authView.style.display = 'flex';

            const user = session.user;
            const email = user.email || '';
            const metadata = user.user_metadata || {};

            const fullname = metadata.full_name || email.split('@')[0];
            const username = metadata.username || email.split('@')[0];
            const faculty = metadata.faculty || '';
            const avatarUrl = metadata.avatar_url || null;

            // ใส่ค่าลง Input
            if (editFullnameInput) editFullnameInput.value = fullname;
            if (editUsernameInput) editUsernameInput.value = username;
            if (editFacultyInput) editFacultyInput.value = faculty;
            if (profileEmailDisplay) profileEmailDisplay.textContent = email;

            // แสดงรูปโปรไฟล์ หรือ ตัวอักษรแรกถ้าไม่มีรูป
            if (profileAvatarEl) {
                if (avatarUrl) {
                    profileAvatarEl.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width:100%; height:100%; object-fit:cover;">`;
                } else {
                    profileAvatarEl.textContent = fullname.charAt(0).toUpperCase();
                }
            }

            // อัปเดตตัวเลขสถานที่ที่บันทึกไว้ (ถ้ามี Element นี้อยู่ในหน้า)
            const savedPlaces = typeof getSavedPlaces === 'function' ? getSavedPlaces() : [];
            const savedCountEl = document.getElementById('saved-count');
            if (savedCountEl) savedCountEl.textContent = savedPlaces.length;
        }
    }).catch(err => {
        console.error('Session retrieval error:', err);
    });
}

// 3. ฟังก์ชันการอัปโหลดไฟล์ไป Storage และอัปเดต User Metadata
if (editProfileForm && typeof supabaseClient !== 'undefined') {
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = editProfileForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : 'บันทึกการเปลี่ยนแปลง';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'กำลังบันทึกข้อมูล...';
        }

        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session || !session.user) {
                alert('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
                window.location.reload();
                return;
            }

            const user = session.user;
            let finalAvatarUrl = user.user_metadata?.avatar_url || null;

            // ก. อัปโหลดรูปภาพใหม่ไปยัง Supabase Storage (ถ้ามีเลือกไฟล์ไว้)
            if (selectedAvatarFile) {
                const fileExt = selectedAvatarFile.name.split('.').pop();
                const fileName = `${user.id}_${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                // อัปโหลดไปยัง Bucket ชื่อ 'avatars'
                const { error: uploadError } = await supabaseClient.storage
                    .from('avatars')
                    .upload(filePath, selectedAvatarFile, { 
                        cacheControl: '3600',
                        upsert: true 
                    });

                if (uploadError) {
                    console.error('Storage Upload Error:', uploadError);
                    alert('อัปโหลดรูปภาพไม่สำเร็จ: ' + uploadError.message);
                    return;
                }

                // ดึง Public URL ของไฟล์ที่อัปโหลด
                const { data: urlData } = supabaseClient.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                finalAvatarUrl = urlData.publicUrl;
            }

            // ข. เตรียมข้อมูลใหม่
            const updatedFullName = editFullnameInput ? editFullnameInput.value.trim() : '';
            const updatedUsername = editUsernameInput ? editUsernameInput.value.trim() : '';
            const updatedFaculty = editFacultyInput ? editFacultyInput.value.trim() : '';

            // ค. อัปเดตข้อมูล User Metadata ใน Supabase Auth
            const { error: updateError } = await supabaseClient.auth.updateUser({
                data: {
                    full_name: updatedFullName,
                    username: updatedUsername,
                    faculty: updatedFaculty,
                    avatar_url: finalAvatarUrl
                }
            });

            if (updateError) {
                throw updateError;
            }

            alert('บันทึกข้อมูลโปรไฟล์และอัปเดตรูปภาพเรียบร้อยแล้ว!');
            selectedAvatarFile = null; // รีเซ็ตไฟล์ที่เลือก
            
        } catch (err) {
            console.error('Update profile error:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.message || err));
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
}
    // ==========================================
    // 9. ดึงข้อมูลและแสดงผลรีวิว (review.html / detail.html)
    // ==========================================
    const reviewsContentArea = document.getElementById('reviews-content-area');
    
    const loadReviews = async () => {
        if (!reviewsContentArea || !supabaseClient) return;

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const placeId = urlParams.get('id') || 1; 

            const { data: reviews, error } = await supabaseClient
                .from('reviews')
                .select('*')
                .eq('place_id', placeId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            reviewsContentArea.innerHTML = ''; 

            if (!reviews || reviews.length === 0) {
                reviewsContentArea.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center;">ยังไม่มีรีวิว เป็นคนแรกที่ให้คะแนนสิ!</p>';
                return;
            }

            reviews.forEach(review => {
                const dateStr = new Date(review.created_at).toLocaleDateString('th-TH');
                const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                
                let imagesHTML = '';
                if (review.image_urls && review.image_urls.length > 0) {
                    imagesHTML = '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">';
                    review.image_urls.forEach(url => {
                        imagesHTML += `<img src="${url}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color);">`;
                    });
                    imagesHTML += '</div>';
                }
                
                const reviewHTML = `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="review-user">
                                <div class="review-avatar">${review.user_avatar || 'U'}</div>
                                <span>${review.user_name || 'ผู้ใช้งาน'}</span>
                            </div>
                            <span class="review-date">${dateStr}</span>
                        </div>
                        <div class="review-stars">${stars}</div>
                        <p class="review-text">${review.comment}</p>
                        ${imagesHTML}
                    </div>
                `;
                reviewsContentArea.insertAdjacentHTML('beforeend', reviewHTML);
            });
        } catch (err) { 
            console.error('Error loading reviews:', err); 
        }
    };

    loadReviews();

    // ==========================================
    // 10. ส่งฟอร์มรีวิว + อัปโหลดรูปภาพ
    // ==========================================
    const reviewForm = document.getElementById('review-form');
    const fileInput = document.getElementById('review-photo');
    const previewContainer = document.getElementById('image-preview-container');
    const submitBtn = document.getElementById('submit-review-btn');
    let selectedFiles = [];

    if (fileInput && previewContainer) {
        fileInput.addEventListener('change', (e) => {
            selectedFiles = selectedFiles.concat(Array.from(e.target.files));
            renderPreviews();
            fileInput.value = '';
        });
    }

    function renderPreviews() {
        if (!previewContainer) return;
        previewContainer.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgWrapper = document.createElement('div');
                imgWrapper.style.position = 'relative';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width:70px; height:70px; object-fit:cover; border-radius:8px;';

                const delBtn = document.createElement('button');
                delBtn.innerHTML = '×';
                delBtn.style.cssText = 'position:absolute; top:-5px; right:-5px; background:var(--primary-red); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;';
                
                delBtn.onclick = (event) => {
                    event.preventDefault();
                    selectedFiles.splice(index, 1);
                    renderPreviews();
                };

                imgWrapper.appendChild(img);
                imgWrapper.appendChild(delBtn);
                previewContainer.appendChild(imgWrapper);
            };
            reader.readAsDataURL(file);
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!supabaseClient) {
                alert('ระบบ Supabase ไม่พร้อมใช้งานในขณะนี้');
                return;
            }

            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session || !session.user) {
                alert('กรุณาเข้าสู่ระบบก่อนทำการเขียนรีวิวนะครับ!');
                window.location.href = 'login.html';
                return;
            }

            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const commentInput = document.getElementById('review-comment').value;

            if (!ratingInput) return alert('กรุณาให้คะแนนดาวก่อนส่งรีวิวนะครับ!');
            if (!commentInput.trim()) return alert('กรุณากรอกความคิดเห็นของคุณ');

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'กำลังส่งข้อมูล...';
            }

            try {
                const userName = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
                const userAvatar = userName.charAt(0).toUpperCase();

                const urlParams = new URLSearchParams(window.location.search);
                const placeId = urlParams.get('id') || 1; 

                let uploadedImageUrls = [];
                for (let file of selectedFiles) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `reviews_place_${placeId}/${fileName}`;

                    const { error: uploadError } = await supabaseClient.storage
                        .from('review-images')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabaseClient.storage
                        .from('review-images')
                        .getPublicUrl(filePath);

                    uploadedImageUrls.push(publicUrl);
                }

                const { error: insertError } = await supabaseClient
                    .from('reviews')
                    .insert([{
                        place_id: placeId,
                        user_name: userName,
                        user_avatar: userAvatar,
                        rating: parseInt(ratingInput.value),
                        comment: commentInput,
                        image_urls: uploadedImageUrls
                    }]);

                if (insertError) throw insertError;

                alert('ส่งรีวิวเรียบร้อยแล้ว!');
                reviewForm.reset();
                document.querySelectorAll('input[name="rating"]').forEach(el => el.checked = false);
                selectedFiles = [];
                renderPreviews();
                loadReviews();

            } catch (err) {
                console.error('Submit error:', err);
                alert('เกิดข้อผิดพลาดในการส่งรีวิว กรุณาลองใหม่อีกครั้ง');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'ส่งรีวิว';
                }
            }
        });
    }
});

// ==========================================
// 11. ระบบ Map UI และ แผนที่วิทยาเขต (Leaflet.js)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const defaultCenter = [14.0677, 100.6014]; 
    const map = L.map('map').setView(defaultCenter, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let isAddMode = false;
    let tempMarker = null;

    const mapWrapper = mapElement.closest('.map-wrapper') || mapElement.parentElement;
    
    let banner = mapWrapper.querySelector('.pin-mode-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.className = 'pin-mode-banner';
        banner.innerHTML = '<i class="fa-solid fa-location-dot"></i> กรุณาคลิกบนแผนที่เพื่อเลือกตำแหน่งร้านค้าใหม่';
        mapWrapper.appendChild(banner);
    }

    let controlsGroup = mapWrapper.querySelector('.map-controls-group');
    if (!controlsGroup) {
        controlsGroup = document.createElement('div');
        controlsGroup.className = 'map-controls-group';
        
        const addModeBtn = document.createElement('button');
        addModeBtn.className = 'map-control-btn add-mode-btn';
        addModeBtn.innerHTML = '<i class="fa-solid fa-plus"></i> เพิ่มร้านค้าบนแผนที่';
        
        const resetLocBtn = document.createElement('button');
        resetLocBtn.className = 'map-control-btn';
        resetLocBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> ตำแหน่งของฉัน';
        
        controlsGroup.appendChild(addModeBtn);
        controlsGroup.appendChild(resetLocBtn);
        mapWrapper.appendChild(controlsGroup);
    }

    const addModeBtn = controlsGroup.querySelector('.add-mode-btn');
    const resetLocBtn = controlsGroup.querySelector('.map-control-btn:not(.add-mode-btn)');

    if (addModeBtn) {
        addModeBtn.addEventListener('click', () => {
            isAddMode = !isAddMode;
            if (isAddMode) {
                addModeBtn.classList.add('active');
                addModeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> ยกเลิกการปักหมุด';
                banner.style.display = 'block';
                mapElement.style.cursor = 'crosshair';
            } else {
                exitAddMode();
            }
        });
    }

    function exitAddMode() {
        isAddMode = false;
        if (addModeBtn) {
            addModeBtn.classList.remove('active');
            addModeBtn.innerHTML = '<i class="fa-solid fa-plus"></i> เพิ่มร้านค้าบนแผนที่';
        }
        banner.style.display = 'none';
        mapElement.style.cursor = '';
        if (tempMarker) {
            map.removeLayer(tempMarker);
            tempMarker = null;
        }
    }

    if (resetLocBtn) {
        resetLocBtn.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง (Geolocation)');
                map.setView(defaultCenter, 15);
                return;
            }

            resetLocBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังค้นหา...';

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const userLatLng = [userLat, userLng];

                    map.setView(userLatLng, 16);

                    let userMarker = window.currentUserMarker;
                    if (userMarker) {
                        userMarker.setLatLng(userLatLng);
                    } else {
                        userMarker = L.marker(userLatLng, {
                            icon: L.divIcon({
                                className: 'user-location-pin',
                                html: '<div style="background-color: #3b82f6; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>',
                                iconSize: [14, 14]
                            })
                        }).addTo(map);
                        window.currentUserMarker = userMarker;
                    }
                    userMarker.bindPopup('<b>ตำแหน่งของคุณในขณะนี้</b>').openPopup();

                    resetLocBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> ตำแหน่งของฉัน';
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('ไม่สามารถเข้าถึงตำแหน่งของคุณได้ กรุณาตรวจสอบการอนุญาตสิทธิ์การเข้าถึงตำแหน่งในเบราว์เซอร์');
                    resetLocBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> ตำแหน่งของฉัน';
                    map.setView(defaultCenter, 15);
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        });
    }

    const campusPlaces = [
        { id: 1, name: 'The Quad Coffee', lat: 14.0725, lng: 100.6060, category: 'คาเฟ่และพื้นที่อ่านหนังสือ' },
        { id: 2, name: 'ศูนย์อาหาร SC (Green Canteen)', lat: 14.0700, lng: 100.6080, category: 'อาหารและเครื่องดื่ม' },
        { id: 3, name: 'เดอะ เดลี่ แกรนด์ คาเฟ่', lat: 14.0650, lng: 100.6030, category: 'คาเฟ่และอาหารว่าง' }
    ];

    campusPlaces.forEach(place => {
        const marker = L.marker([place.lat, place.lng]).addTo(map);
        marker.bindPopup(`
            <div style="font-family: inherit; padding: 4px;">
                <h4 style="margin: 0 0 5px 0; color: var(--primary-red); font-size: 14px;">${place.name}</h4>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${place.category}</p>
                <a href="detail.html?id=${place.id}" style="font-size: 11px; color: #e63946; font-weight: bold; text-decoration: underline;">ดูรายละเอียดร้าน</a>
            </div>
        `);
    });

    map.on('click', (e) => {
        if (!isAddMode) return;

        const { lat, lng } = e.latlng;

        if (tempMarker) {
            map.removeLayer(tempMarker);
        }

        const popupContent = `
            <div class="add-place-popup">
                <h4><i class="fa-solid fa-store"></i> เพิ่มร้านค้าใหม่</h4>
                <form id="quick-add-place-form">
                    <label>ชื่อร้านค้า</label>
                    <input type="text" id="new-place-name" placeholder="ระบุชื่อร้าน..." required />
                    
                    <label>หมวดหมู่</label>
                    <select id="new-place-category">
                        <option value="คาเฟ่และพื้นที่อ่านหนังสือ">คาเฟ่และพื้นที่อ่านหนังสือ</option>
                        <option value="อาหารและเครื่องดื่ม">อาหารและเครื่องดื่ม</option>
                        <option value="คาเฟ่และอาหารว่าง">คาเฟ่และอาหารว่าง</option>
                    </select>

                    <div class="add-place-popup-actions">
                        <button type="submit" class="btn-pop-save">บันทึก</button>
                        <button type="button" id="btn-pop-cancel" class="btn-pop-cancel">ยกเลิก</button>
                    </div>
                </form>
            </div>
        `; 

        tempMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
        tempMarker.bindPopup(popupContent, { maxWidth: 250 }).openPopup();

        setTimeout(() => {
            const form = document.getElementById('quick-add-place-form');
            const cancelBtn = document.getElementById('btn-pop-cancel');

            if (form) {
                form.addEventListener('submit', async (ev) => {
                    ev.preventDefault();
                    const name = document.getElementById('new-place-name').value.trim();
                    const category = document.getElementById('new-place-category').value;

                    if (!name) return alert('กรุณากรอกชื่อร้านค้า');

                    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
                        try {
                            const { error } = await supabaseClient.from('places').insert([{
                                name: name,
                                category: category,
                                lat: lat,
                                lng: lng,
                                rating: 5.0,
                                is_open: true
                            }]);
                            if (error) throw error;
                            alert('เพิ่มร้านค้าลงในระบบสำเร็จ!');
                        } catch (err) {
                            console.error('Insert place error:', err);
                            alert('บันทึกข้อมูลลงฐานข้อมูลไม่สำเร็จ แต่ระบบจำลองการทำงานเรียบร้อย');
                        }
                    } else {
                        alert(`เพิ่มร้าน "${name}" (${category}) เรียบร้อยแล้ว!`);
                    }

                    tempMarker.closePopup();
                    exitAddMode();
                });
            }

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    if (tempMarker) {
                        map.removeLayer(tempMarker);
                        tempMarker = null;
                    }
                    exitAddMode();
                });
            }
        }, 100);
    });
});

// ==========================================
// 12. ระบบการสุ่มไพ่ร้านค้า (random.html)
// ==========================================
const mockShops = [
    {
        id: 1,
        title: "ก๋วยเตี๋ยวเรือท่าช้าง มธ.",
        category: "food",
        categoryText: "อาหารและเครื่องดื่ม",
        price: "$",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500",
        desc: "ก๋วยเตี๋ยวเรือรสเด็ด เข้มข้นไม่ต้องปรุงเพิ่ม ราคานักศึกษาเริ่มต้น 40 บาท"
    },
    {
        id: 2,
        title: "Cafe & Co-Working Space ยูพาร์ค",
        category: "study",
        categoryText: "โซนอ่านหนังสือ",
        price: "$$",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500",
        desc: "บรรยากาศเงียบสงบ มีปลั๊กไฟและ Wi-Fi ฟรี เหมาะสำหรับอ่านหนังสือสอบ"
    },
    {
        id: 3,
        title: "ชาบู ชาบู หน้า ม.",
        category: "food",
        categoryText: "อาหารและเครื่องดื่ม",
        price: "$$",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
        desc: "บุฟเฟต์ชาบูหมูเนื้อไม่อั้น น้ำซุปดำกลมกล่อม ของกินเล่นเพียบ"
    },
    {
        id: 4,
        title: "Board Game Club เชียงราก",
        category: "game",
        categoryText: "ศูนย์รวมเกม",
        price: "$",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500",
        desc: "แหล่งรวมบอร์ดเกมกว่า 200 เกม พนักงานช่วยสอนเล่น นั่งได้ยาวๆ"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const tarotCard = document.getElementById('tarotCard');
    const btnRandom = document.getElementById('btnRandom');

    if (!tarotCard || !btnRandom) return;

    function pickRandomShop() {
        const catFilter = document.getElementById('random-category').value;
        const priceFilter = document.getElementById('random-price').value;

        let filtered = mockShops.filter(shop => {
            const matchCat = (catFilter === 'all' || shop.category === catFilter);
            const matchPrice = (priceFilter === 'all' || shop.price === priceFilter);
            return matchCat && matchPrice;
        });

        if (filtered.length === 0) {
            alert("ไม่พบร้านตามเงื่อนไขที่เลือก ลองเปลี่ยนตัวกรองดูนะครับ!");
            return;
        }

        const randomIndex = Math.floor(Math.random() * filtered.length);
        const selectedShop = filtered[randomIndex];

        if (tarotCard.classList.contains('flipped')) {
            tarotCard.classList.remove('flipped');
            setTimeout(() => {
                updateCardData(selectedShop);
                tarotCard.classList.add('flipped');
            }, 400);
        } else {
            updateCardData(selectedShop);
            tarotCard.classList.add('flipped');
        }
    }

    function updateCardData(shop) {
        document.getElementById('res-title').textContent = shop.title;
        document.getElementById('res-img').src = shop.image;
        document.getElementById('res-rating').textContent = shop.rating;
        document.getElementById('res-cat').textContent = shop.categoryText;
        document.getElementById('res-price').textContent = shop.price;
        document.getElementById('res-desc').textContent = shop.desc;
        document.getElementById('res-link').href = `detail.html?id=${shop.id}`;
    }

    btnRandom.addEventListener('click', pickRandomShop);
    tarotCard.addEventListener('click', pickRandomShop);
});
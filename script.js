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
        if (!supabaseClient) {
            updateGlobalNotificationBell(null);
            return;
        }
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            updateGlobalNotificationBell(session && session.user);
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
            updateGlobalNotificationBell(null);
        }
    }

    checkGlobalAuthNavbar();

    // ==========================================
    // 4. ข้อมูล Mock Data สำรอง (ใช้กรณีโหลด DB ไม่สำเร็จ)
    // ==========================================
    const mockPlaces = [
        { id: 1, name: 'The Quad Coffee', category: 'คาเฟ่และพื้นที่อ่านหนังสือ', rating: 4.8, distance_km: 0.2, is_open: true, price: '$$', discount: 'ส่วนลดนักศึกษา 15%', image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500' },
        { id: 2, name: 'ศูนย์อาหาร SC (Green Canteen)', category: 'อาหารและเครื่องดื่ม', rating: 4.5, distance_km: 0.5, is_open: true, price: '$', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500' },
        { id: 3, name: 'เดอะ เดลี่ แกรนด์ คาเฟ่', category: 'คาเฟ่และอาหารว่าง', rating: 4.6, distance_km: 0.8, is_open: true, price: '$$', discount: 'เมนูใหม่โปรแรง', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500' }
    ];

    // ==========================================
    // 5. ระบบ บันทึกร้านค้า (Bookmarks / Saved Places)
    // ==========================================
    const getSavedPlaces = () => JSON.parse(localStorage.getItem('saved_places_ids')) || [];

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

    // ==========================================
    // 5.1 Global authenticated notification bell
    // ==========================================
    function updateGlobalNotificationBell(user) {
        const headerRight = document.querySelector('.header-right');
        const existingBell = headerRight && headerRight.querySelector('.notification-bell-wrap');

        // A bell is never present in the DOM for guests.
        if (!user || !headerRight) {
            if (existingBell) existingBell.remove();
            return;
        }
        if (existingBell) return;

        const bellWrap = document.createElement('div');
        bellWrap.className = 'notification-bell-wrap';
        bellWrap.innerHTML = `
            <button class="notification-bell icon-btn" type="button" aria-label="การแจ้งเตือน" aria-expanded="false">
                <i class="fa-regular fa-bell" aria-hidden="true"></i>
            </button>
            <section class="notification-dropdown" aria-label="การแจ้งเตือนล่าสุด" hidden>
                <div class="notification-dropdown-header"><span>การแจ้งเตือน</span><i class="fa-regular fa-bell" aria-hidden="true"></i></div>
                <div class="notification-list" aria-live="polite"></div>
            </section>`;

        const themeButton = headerRight.querySelector('#darkModeToggle');
        if (themeButton) themeButton.insertAdjacentElement('afterend', bellWrap);
        else headerRight.prepend(bellWrap);

        const notificationBell = bellWrap.querySelector('.notification-bell');
        const notificationDropdown = bellWrap.querySelector('.notification-dropdown');
        const notificationList = bellWrap.querySelector('.notification-list');

        const renderEmpty = () => {
            notificationList.replaceChildren();
            const empty = document.createElement('div');
            empty.className = 'notification-empty';
            empty.textContent = 'ไม่มีการแจ้งเตือนใดๆ';
            notificationList.appendChild(empty);
        };

        const appendNotification = ({ message, timestamp, icon = 'fa-store' }) => {
            const item = document.createElement('article');
            item.className = 'notification-item';
            const iconContainer = document.createElement('span');
            iconContainer.className = 'notification-item-icon';
            iconContainer.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i>`;
            const content = document.createElement('div');
            const text = document.createElement('p');
            text.textContent = message;
            content.appendChild(text);
            if (timestamp) {
                const date = new Date(timestamp);
                if (!Number.isNaN(date.getTime())) {
                    const time = document.createElement('small');
                    time.textContent = date.toLocaleString('th-TH');
                    content.appendChild(time);
                }
            }
            item.append(iconContainer, content);
            notificationList.appendChild(item);
        };

        const readActivityNotifications = () => {
            try {
                const notices = JSON.parse(localStorage.getItem('tu_aroi_activity_notifications') || '[]');
                return Array.isArray(notices) ? notices : [];
            } catch (_) {
                return [];
            }
        };

        const renderNotifications = async () => {
            const activityNotices = readActivityNotifications()
                .filter(notice => !notice.user_id || notice.user_id === user.id)
                .slice(0, 5);
            const savedIds = getSavedPlaces();
            let savedPlaces = [];
            if (savedIds.length && supabaseClient) {
                try {
                    const { data, error } = await supabaseClient.from('places').select('*').in('id', savedIds);
                    if (!error && data) savedPlaces = data;
                } catch (error) {
                    console.warn('Notification fetch error:', error);
                }
            }
            if (!savedPlaces.length) savedPlaces = mockPlaces.filter(place => savedIds.includes(String(place.id)));

            const savedPlaceUpdates = savedPlaces
                .filter(place => place.discount || place.updated_at)
                .slice(0, 5)
                .map(place => ({
                    message: place.discount
                        ? `${place.name || 'ร้านที่บันทึกไว้'}: ${place.discount}`
                        : `${place.name || 'ร้านที่บันทึกไว้'} มีข้อมูลอัปเดตล่าสุด`,
                    timestamp: place.updated_at,
                    icon: 'fa-store'
                }));
            const activityUpdates = activityNotices.map(notice => ({
                message: notice.message || notice.title || 'มีกิจกรรมใหม่สำหรับคุณ',
                timestamp: notice.updated_at || notice.created_at || notice.date,
                icon: 'fa-calendar-day'
            }));
            const updates = [...activityUpdates, ...savedPlaceUpdates].slice(0, 5);

            if (!updates.length) {
                renderEmpty();
                return;
            }
            notificationList.replaceChildren();
            updates.forEach(appendNotification);
        };

        const setOpen = (isOpen) => {
            notificationDropdown.hidden = !isOpen;
            notificationBell.setAttribute('aria-expanded', String(isOpen));
        };

        notificationBell.addEventListener('click', async event => {
            event.stopPropagation();
            const willOpen = notificationDropdown.hidden;
            setOpen(willOpen);
            if (willOpen) await renderNotifications();
        });
        document.addEventListener('click', event => {
            if (!notificationDropdown.hidden && !event.target.closest('.notification-bell-wrap')) setOpen(false);
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') setOpen(false);
        });
    }

    function createCardHTML(place) {
        const savedPlaces = getSavedPlaces();
        const isSaved = savedPlaces.includes(String(place.id));
        const heartClass = isSaved ? 'fa-solid fa-heart saved' : 'fa-regular fa-heart';
        const badgeDiscountHTML = place.discount ? `<span class="badge badge-discount">${place.discount}</span>` : '';
        const price = place.price_range || place.price || '$$';
        const rating = place.rating || 'N/A';
        const imgUrl = place.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500';

        return `
            <div class="card-link" style="position: relative;">
                <button class="bookmark-btn" data-id="${place.id}" title="บันทึกร้านนี้" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: rgba(255,255,255,0.85); border: none; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s;">
                    <i class="${heartClass}" style="color: ${isSaved ? '#e63946' : '#666'}; font-size: 16px;"></i>
                </button>
                <a href="detail.html?id=${place.id}" style="text-decoration: none; color: inherit;">
                    <div class="card">
                        <div class="card-image">
                            <img src="${imgUrl}" alt="${place.name}">
                            <span class="badge badge-rating">★ ${rating}</span>
                            ${badgeDiscountHTML}
                        </div>
                        <div class="card-info">
                            <h3>${place.name}</h3>
                            ${typeof place.currently_open === 'boolean' ? `<span class="store-status ${place.currently_open ? 'is-open' : 'is-closed'}">${place.currently_open ? 'Open Now' : 'Closed'}</span>` : ''}
                            <p class="desc">${place.category || 'ร้านอาหาร'}</p>
                            <div class="card-footer">
                                <span>📍 ${place.distance_km !== undefined ? 'ใกล้ ' + place.distance_km + ' กม.' : (place.address || 'มธ. รังสิต')}</span>
                                <span class="price">${price}</span>
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
    // 6. ตัวกรองและการแสดงผลการ์ดร้านค้า (search.html)
    // ==========================================
    const cardGrid = document.querySelector('.card-grid');
    if (cardGrid && !document.getElementById('saved-cards-grid')) {
        let displayLimit = 6;
        let currentFilteredPlaces = [];
        let userLocation = null;

        const filterOpen = document.getElementById('filter-open');
        const filterDistance = document.getElementById('filter-distance');
        const filterRating = document.getElementById('filter-rating');
        const distanceStatus = document.getElementById('distance-filter-status');

        // Status is calculated against the visitor's local clock. Overnight
        // schedules (such as 18:00–02:00) are supported as well.
        const timeToMinutes = (value) => {
            if (typeof value !== 'string') return null;
            const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
            if (!match) return null;
            const hours = Number(match[1]);
            const minutes = Number(match[2]);
            return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
        };

        const getStoreOpenStatus = (place, now = new Date()) => {
            const openAt = timeToMinutes(place.open_time || place.opening_time);
            const closeAt = timeToMinutes(place.close_time || place.closing_time);
            if (openAt !== null && closeAt !== null) {
                const currentTime = now.getHours() * 60 + now.getMinutes();
                if (openAt === closeAt) return true;
                return closeAt > openAt
                    ? currentTime >= openAt && currentTime < closeAt
                    : currentTime >= openAt || currentTime < closeAt;
            }
            if (typeof place.is_open === 'boolean') return place.is_open;
            const declaredStatus = String(place.status || '').trim().toLowerCase();
            if (declaredStatus.includes('เปิด') || declaredStatus.includes('open')) return true;
            return false;
        };

        const getSelectedPriceTiers = () => Array.from(document.querySelectorAll('.price-btn-group .price-btn.active'))
            .map(button => button.dataset.price || button.textContent.trim());
        const getPriceTiers = (value) => String(value || '').match(/\${1,3}/g) || [];

        // ฟังก์ชันสกัด Lat/Lng จากลิงก์ Google Maps
        const parseLatLngFromUrl = (url) => {
            if (!url) return null;
            const latMatch = url.match(/!3d(-?\d+\.\d+)/);
            const lngMatch = url.match(/!4d(-?\d+\.\d+)/);
            if (latMatch && lngMatch) {
                return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
            }
            return null;
        };

        // สูตร Haversine คำนวณระยะทางตามพิกัดจริง (หน่วย กม.)
        const getHaversineDistance = (coords1, coords2) => {
            const toRad = x => (x * Math.PI) / 180;
            const R = 6371; // รัศมีโลก
            const dLat = toRad(coords2.lat - coords1.lat);
            const dLon = toRad(coords2.lng - coords1.lng);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        // ขอสิทธิ์ระบุตำแหน่งพิกัดผู้ใช้
        const getUserLocation = () => {
            return new Promise((resolve) => {
                if (!navigator.geolocation) {
                    if (distanceStatus) distanceStatus.textContent = 'เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง';
                    resolve(null);
                    return;
                }
                if (distanceStatus) distanceStatus.textContent = 'กำลังระบุตำแหน่งของคุณ...';
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                        if (distanceStatus) distanceStatus.textContent = ' 📍 อ้างอิงตำแหน่งปัจจุบันของคุณ';
                        resolve(userLocation);
                    },
                    (err) => {
                        console.warn('Geolocation denied/failed:', err);
                        if (distanceStatus) distanceStatus.textContent = '⚠️ ใช้ระยะทางประเมิน (ไม่ได้เปิด GPS)';
                        resolve(null);
                    },
                    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
                );
            });
        };

        const fetchFilteredPlaces = async () => {
            let searchQuery = '';
            document.querySelectorAll('.search-box input').forEach(input => {
                if (input.value.trim()) searchQuery = input.value.trim().toLowerCase();
            });

            const activeCatBtn = document.querySelector('.category-list .cat-btn.active');
            const catText = activeCatBtn ? activeCatBtn.textContent.trim() : 'ร้านทั้งหมด';

            const isOpenChecked = filterOpen && filterOpen.checked;
            const maxDistanceVal = filterDistance ? filterDistance.value : 'all';
            const isRatingChecked = filterRating && filterRating.checked;

            const selectedPriceTiers = getSelectedPriceTiers();

            const sortSelect = document.querySelector('.sort-dropdown select');
            const sortVal = sortSelect ? sortSelect.value : 'recommended';

            let rawPlaces = [];

            if (supabaseClient) {
                try {
                    const { data, error } = await supabaseClient.from('places').select('*');
                    if (!error && data && data.length > 0) rawPlaces = data;
                } catch (err) { console.error('Supabase fetch error:', err); }
            }

            if (rawPlaces.length === 0) rawPlaces = mockPlaces;

            // ประมวลผลคำนวณระยะทางของทุกร้าน
            rawPlaces = rawPlaces.map(place => {
                const mapUrl = place.google_map || place['google map'] || '';
                let placeLat = place.lat;
                let placeLng = place.lng;

                if (!placeLat || !placeLng) {
                    const extracted = parseLatLngFromUrl(mapUrl);
                    if (extracted) {
                        placeLat = extracted.lat;
                        placeLng = extracted.lng;
                    }
                }

                let computedDistance = place.distance_km;

                // หากมีพิกัดผู้ใช้และพิกัดร้านค้า ให้คำนวณระยะทางจริงทันที
                if (userLocation && placeLat && placeLng) {
                    computedDistance = parseFloat(getHaversineDistance(userLocation, { lat: placeLat, lng: placeLng }).toFixed(2));
                }

                return {
                    ...place,
                    computed_distance: computedDistance !== undefined ? computedDistance : 999,
                    currently_open: getStoreOpenStatus(place)
                };
            });

            // กรองข้อมูลตามเงื่อนไขต่างๆ
            currentFilteredPlaces = rawPlaces.filter(place => {
                if (searchQuery) {
                    const matchName = place.name ? place.name.toLowerCase().includes(searchQuery) : false;
                    const matchCat = place.category ? place.category.toLowerCase().includes(searchQuery) : false;
                    if (!matchName && !matchCat) return false;
                }

                if (catText !== 'ร้านทั้งหมด' && !catText.includes('ร้านทั้งหมด')) {
                    const pCat = (place.category || '').toLowerCase();
                    if (catText.includes('อาหาร') && !(pCat.includes('อาหาร') || pCat.includes('เครื่องดื่ม'))) return false;
                    if (catText.includes('อ่านหนังสือ') && !(pCat.includes('อ่านหนังสือ') || pCat.includes('คาเฟ่'))) return false;
                    if (catText.includes('เกม') && !pCat.includes('เกม')) return false;
                }

                // ตัวกรองเปิดอยู่
                if (isOpenChecked && !place.currently_open) return false;

                // ตัวกรองระยะทาง (ใช้งานได้จริง)
                if (maxDistanceVal !== 'all') {
                    const limit = parseFloat(maxDistanceVal);
                    if (place.computed_distance > limit) return false;
                }

                // ตัวกรองคะแนน
                if (isRatingChecked && (place.rating === undefined || place.rating < 4.0)) return false;

                // ตัวกรองช่วงราคา
                if (selectedPriceTiers.length) {
                    const placePriceTiers = getPriceTiers(place.price_range || place.price);
                    if (!selectedPriceTiers.some(tier => placePriceTiers.includes(tier))) return false;
                }

                return true;
            });

            // จัดเรียงข้อมูล (Sort)
            if (sortVal === 'rating' || sortVal === 'คะแนนสูงสุด') {
                currentFilteredPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else if (sortVal === 'distance' || sortVal === 'ระยะทางใกล้ที่สุด') {
                currentFilteredPlaces.sort((a, b) => a.computed_distance - b.computed_distance);
            }

            // Keep the selected order inside each group, but always lead with open stores.
            currentFilteredPlaces.sort((a, b) => Number(b.currently_open) - Number(a.currently_open));

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
                // นำระยะทางที่คำนวณได้จริงไปแสดงบน Card
                const displayPlace = { ...place, distance_km: place.computed_distance !== 999 ? place.computed_distance : place.distance_km };
                cardGrid.innerHTML += createCardHTML(displayPlace);
            });

            const loadBtn = document.querySelector('.load-more-btn');
            if (loadBtn) loadBtn.style.display = (displayLimit >= currentFilteredPlaces.length) ? 'none' : 'block';
        }

        // Event Listeners
        if (filterOpen) filterOpen.addEventListener('change', () => { displayLimit = 6; fetchFilteredPlaces(); });

        if (filterDistance) {
            filterDistance.addEventListener('change', async () => {
                if (filterDistance.value !== 'all' && !userLocation) {
                    await getUserLocation();
                }
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        }

        if (filterRating) filterRating.addEventListener('change', () => { displayLimit = 6; fetchFilteredPlaces(); });

        document.querySelectorAll('.category-list .cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-list .cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        });

        document.querySelectorAll('.price-btn-group .price-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const willBeActive = !btn.classList.contains('active');
                btn.classList.toggle('active', willBeActive);
                btn.setAttribute('aria-pressed', String(willBeActive));
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        });

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

        const sortSelect = document.querySelector('.sort-dropdown select');
        if (sortSelect) {
            sortSelect.addEventListener('change', async () => {
                if (sortSelect.value === 'distance' && !userLocation) {
                    await getUserLocation();
                }
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        }

        const resetBtn = document.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.querySelectorAll('.category-list .cat-btn').forEach((b, idx) => {
                    if (idx === 0) b.classList.add('active');
                    else b.classList.remove('active');
                });
                if (filterOpen) filterOpen.checked = false;
                if (filterDistance) filterDistance.value = 'all';
                if (filterRating) filterRating.checked = false;
                if (distanceStatus) distanceStatus.textContent = '';
                document.querySelectorAll('.price-btn-group .price-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                document.querySelectorAll('.search-box input').forEach(input => input.value = '');
                if (sortSelect) sortSelect.value = 'recommended';
                displayLimit = 6;
                fetchFilteredPlaces();
            });
        }

        const loadBtn = document.querySelector('.load-more-btn');
        if (loadBtn) loadBtn.addEventListener('click', () => { displayLimit += 6; renderPlaces(); });

        // เริ่มต้นขอพิกัดผู้ใช้เบื้องต้น และโหลดรายการร้านค้า
        getUserLocation().then(() => fetchFilteredPlaces());
        window.setInterval(fetchFilteredPlaces, 60000);
    }
    // ==========================================
    // 7. จัดการข้อมูลโปรไฟล์ (profile.html)
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
                    const { data, error } = await supabaseClient.from('places').select('*').in('id', savedIds);
                    if (!error && data) savedPlacesData = data;
                } catch (err) { console.error(err); }
            }

            if (savedPlacesData.length === 0) savedPlacesData = mockPlaces.filter(place => savedIds.includes(String(place.id)));

            savedCardsGrid.innerHTML = '';
            if (savedPlacesData.length === 0) {
                savedCardsGrid.innerHTML = '<p style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 40px 0;">ยังไม่มีรายการที่บันทึกไว้</p>';
                return;
            }
            savedPlacesData.forEach(place => { savedCardsGrid.innerHTML += createCardHTML(place); });
        };
        loadSavedPlaces();
    }

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

    if (avatarContainer && avatarFileInput) {
        avatarContainer.addEventListener('click', () => avatarFileInput.click());
        avatarFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                if (file.size > 5 * 1024 * 1024) return alert('ขนาดไฟล์ต้องไม่เกิน 5MB ครับ');
                selectedAvatarFile = file;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (profileAvatarEl) profileAvatarEl.innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
                };
                reader.readAsDataURL(selectedAvatarFile);
            }
        });
    }

    if (authView && unauthView && typeof supabaseClient !== 'undefined') {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (!session || !session.user) {
                unauthView.style.display = 'block';
                authView.style.display = 'none';
            } else {
                unauthView.style.display = 'none';
                authView.style.display = 'flex';
                const user = session.user;
                const metadata = user.user_metadata || {};
                const fullname = metadata.full_name || user.email.split('@')[0];
                
                if (editFullnameInput) editFullnameInput.value = fullname;
                if (editUsernameInput) editUsernameInput.value = metadata.username || user.email.split('@')[0];
                if (editFacultyInput) editFacultyInput.value = metadata.faculty || '';
                if (profileEmailDisplay) profileEmailDisplay.textContent = user.email;

                if (profileAvatarEl) {
                    if (metadata.avatar_url) profileAvatarEl.innerHTML = `<img src="${metadata.avatar_url}" style="width:100%; height:100%; object-fit:cover;">`;
                    else profileAvatarEl.textContent = fullname.charAt(0).toUpperCase();
                }

                const savedCountEl = document.getElementById('saved-count');
                if (savedCountEl) savedCountEl.textContent = getSavedPlaces().length;
            }
        });
    }

    if (editProfileForm && typeof supabaseClient !== 'undefined') {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = editProfileForm.querySelector('button[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'กำลังบันทึกข้อมูล...'; }

            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (!session || !session.user) return alert('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง');

                let finalAvatarUrl = session.user.user_metadata?.avatar_url || null;

                if (selectedAvatarFile) {
                    const fileExt = selectedAvatarFile.name.split('.').pop();
                    const filePath = `avatars/${session.user.id}_${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabaseClient.storage.from('avatars').upload(filePath, selectedAvatarFile, { upsert: true });
                    if (uploadError) throw uploadError;
                    finalAvatarUrl = supabaseClient.storage.from('avatars').getPublicUrl(filePath).data.publicUrl;
                }

                const { error: updateError } = await supabaseClient.auth.updateUser({
                    data: {
                        full_name: editFullnameInput.value.trim(),
                        username: editUsernameInput.value.trim(),
                        faculty: editFacultyInput.value.trim(),
                        avatar_url: finalAvatarUrl
                    }
                });

                if (updateError) throw updateError;
                alert('บันทึกข้อมูลโปรไฟล์และอัปเดตรูปภาพเรียบร้อยแล้ว!');
                selectedAvatarFile = null;
            } catch (err) {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + err.message);
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'บันทึกข้อมูล'; }
            }
        });
    }

    // ==========================================
    // 8. ดึงข้อมูลและส่งรีวิว (review.html / detail.html)
    // ==========================================
    const reviewsContentArea = document.getElementById('reviews-content-area');
    const loadReviews = async () => {
        if (!reviewsContentArea || !supabaseClient) return;
        try {
            const placeId = new URLSearchParams(window.location.search).get('id') || 1; 
            const { data: reviews, error } = await supabaseClient.from('reviews').select('*').eq('place_id', placeId).order('created_at', { ascending: false });

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
                    review.image_urls.forEach(url => imagesHTML += `<img src="${url}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color);">`);
                    imagesHTML += '</div>';
                }
                reviewsContentArea.insertAdjacentHTML('beforeend', `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="review-user"><div class="review-avatar">${review.user_avatar || 'U'}</div><span>${review.user_name || 'ผู้ใช้งาน'}</span></div>
                            <span class="review-date">${dateStr}</span>
                        </div>
                        <div class="review-stars">${stars}</div>
                        <p class="review-text">${review.comment}</p>${imagesHTML}
                    </div>`);
            });
        } catch (err) { console.error('Error loading reviews:', err); }
    };
    loadReviews();

    const reviewForm = document.getElementById('review-form');
    const fileInput = document.getElementById('review-photo');
    const previewContainer = document.getElementById('image-preview-container');
    let selectedFiles = [];

    if (fileInput && previewContainer) {
        fileInput.addEventListener('change', (e) => {
            selectedFiles = selectedFiles.concat(Array.from(e.target.files));
            previewContainer.innerHTML = '';
            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const div = document.createElement('div');
                    div.style.position = 'relative';
                    div.innerHTML = `<img src="${ev.target.result}" style="width:70px; height:70px; object-fit:cover; border-radius:8px;">
                                     <button style="position:absolute; top:-5px; right:-5px; background:var(--primary-red); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;">×</button>`;
                    div.querySelector('button').onclick = (e) => { e.preventDefault(); selectedFiles.splice(index, 1); div.remove(); };
                    previewContainer.appendChild(div);
                };
                reader.readAsDataURL(file);
            });
            fileInput.value = '';
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!supabaseClient) return alert('ระบบ Supabase ไม่พร้อมใช้งานในขณะนี้');
            
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session || !session.user) { alert('กรุณาเข้าสู่ระบบก่อนรีวิว'); window.location.href = 'login.html'; return; }

            const rating = document.querySelector('input[name="rating"]:checked');
            const comment = document.getElementById('review-comment').value;
            if (!rating) return alert('กรุณาให้คะแนนดาว!');
            if (!comment.trim()) return alert('กรุณากรอกความคิดเห็น!');

            const submitBtn = document.getElementById('submit-review-btn');
            submitBtn.disabled = true; submitBtn.innerHTML = 'กำลังส่ง...';

            try {
                const placeId = new URLSearchParams(window.location.search).get('id') || 1; 
                let uploadedImageUrls = [];
                for (let file of selectedFiles) {
                    const filePath = `reviews_place_${placeId}/${Date.now()}_${file.name}`;
                    await supabaseClient.storage.from('review-images').upload(filePath, file);
                    uploadedImageUrls.push(supabaseClient.storage.from('review-images').getPublicUrl(filePath).data.publicUrl);
                }

                await supabaseClient.from('reviews').insert([{
                    place_id: placeId,
                    user_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                    user_avatar: (session.user.user_metadata?.full_name || session.user.email).charAt(0).toUpperCase(),
                    rating: parseInt(rating.value),
                    comment: comment,
                    image_urls: uploadedImageUrls
                }]);

                alert('ส่งรีวิวเรียบร้อยแล้ว!');
                reviewForm.reset();
                selectedFiles = [];
                previewContainer.innerHTML = '';
                loadReviews();
            } catch (err) { alert('เกิดข้อผิดพลาด กรุณาลองใหม่'); }
            finally { submitBtn.disabled = false; submitBtn.innerHTML = 'ส่งรีวิว'; }
        });
    }

    // ==========================================
    // 9. ระบบ Map UI แบบใหม่ (ดึง Lat/Lng จาก URL Google Maps ใน CSV/Supabase)
    // ==========================================
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const defaultCenter = [14.0728, 100.6015]; 
        const map = L.map('map').setView(defaultCenter, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
        });

        let userLocationMarker = null;
        let userLocationAccuracy = null;

        function showUserLocation(position, shouldCenter = true) {
            const { latitude, longitude, accuracy } = position.coords;
            const latLng = [latitude, longitude];

            if (userLocationMarker) map.removeLayer(userLocationMarker);
            if (userLocationAccuracy) map.removeLayer(userLocationAccuracy);

            userLocationAccuracy = L.circle(latLng, {
                radius: accuracy || 0,
                color: '#2563eb',
                fillColor: '#60a5fa',
                fillOpacity: 0.18,
                weight: 1
            }).addTo(map);
            userLocationMarker = L.circleMarker(latLng, {
                radius: 8,
                color: '#ffffff',
                fillColor: '#2563eb',
                fillOpacity: 1,
                weight: 3
            }).addTo(map).bindPopup('ตำแหน่งของคุณ');

            if (shouldCenter) map.setView(latLng, 16);
        }

        function locateUser(shouldCenter = true, onSuccess, onError) {
            if (!navigator.geolocation) {
                if (onError) onError(new Error('Geolocation is not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                position => {
                    showUserLocation(position, shouldCenter);
                    if (onSuccess) onSuccess(position);
                },
                error => {
                    console.warn('Unable to retrieve user location:', error);
                    if (onError) onError(error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
        }

        // ฟังก์ชันดึงพิกัดจากลิงก์ Google Map (รับมือกับข้อมูล CSV)
        function extractLatLng(url) {
            if (!url) return null;
            const latMatch = url.match(/!3d(-?\d+\.\d+)/);
            const lngMatch = url.match(/!4d(-?\d+\.\d+)/);
            if (latMatch && lngMatch) {
                return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
            }
            return null;
        }

        // ดึงข้อมูลจาก Supabase ตาราง places (หรือ shops)
        async function fetchAndRenderMapData() {
            if (typeof supabaseClient !== 'undefined' && supabaseClient) {
                try {
                    // หากตารางใน Supabase ของคุณชื่อ shops ให้เปลี่ยนคำว่า 'places' เป็น 'shops'
                    const { data: places, error } = await supabaseClient.from('places').select('*');
                    
                    if (error) throw error;

                    if (places && places.length > 0) {
                        places.forEach(place => {
                            // จัดการชื่อคอลัมน์จาก CSV ที่อาจชื่อ google map หรือ google_map
                            const mapUrl = place.google_map || place['google map'] || '';
                            
                            // ใช้งานพิกัดที่มีอยู่แล้วในระบบ หรือ สกัดจาก URL Google Maps
                            let lat = place.lat;
                            let lng = place.lng;

                            if (!lat || !lng) {
                                const extracted = extractLatLng(mapUrl);
                                if (extracted) {
                                    lat = extracted.lat;
                                    lng = extracted.lng;
                                }
                            }

                            if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                                const marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);

                                // จัดการค่า Null / Fallback (ตามคอลัมน์ใน CSV ของคุณ)
                                const imageUrl = place.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400';
                                const price = place.price_range || place.price ? `• 💰 ${place.price_range || place.price}` : '';
                                const rating = place.rating ? place.rating : 'ไม่มีคะแนน';
                                const reviewCount = place.review_count ? `(${place.review_count} รีวิว)` : '';
                                
                                const openCloseRaw = place.open_close || place['open-close'];
                                const openClose = openCloseRaw ? openCloseRaw.replace('· ', '') : 'ไม่ระบุเวลาทำการ';
                                
                                const snippet = place.review_snippet ? `<p style="margin: 0 0 8px 0; font-size: 11px; color: #555; font-style: italic;">💬 "${place.review_snippet}"</p>` : '';

                                const popupContent = `
                                    <div style="font-family: 'Kanit', sans-serif; padding: 0px; width: 220px;">
                                        <img src="${imageUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" alt="${place.name}">
                                        <h4 style="margin: 0 0 4px 0; color: var(--primary-red, #e63946); font-size: 15px;">${place.name}</h4>
                                        <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                                            <i class="fa-solid fa-tag"></i> ${place.category || 'ร้านค้า'} ${price}
                                        </p>
                                        <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 500;">
                                            ⭐ ${rating} <span style="font-size: 11px; color: #888; font-weight: normal;">${reviewCount}</span>
                                        </p>
                                        <p style="margin: 0 0 6px 0; font-size: 12px; color: #2a9d8f;">
                                            <i class="fa-regular fa-clock"></i> ${openClose}
                                        </p>
                                        ${snippet}
                                        <div style="display: flex; gap: 5px; margin-top: 10px;">
                                            <a href="detail.html?id=${place.id}" style="flex: 1; text-align: center; background: #eee; color: #333; padding: 6px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
                                                ดูรีวิว
                                            </a>
                                            <a href="${mapUrl}" target="_blank" style="flex: 1; text-align: center; background: var(--primary-red, #e63946); color: white; padding: 6px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
                                                <i class="fa-solid fa-location-arrow"></i> นำทาง
                                            </a>
                                        </div>
                                    </div>
                                `;
                                marker.bindPopup(popupContent);
                                marker.on('mouseover', function () { this.openPopup(); });
                            }
                        });
                    }
                } catch (err) {
                    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแผนที่จาก Supabase:", err);
                }
            }
        }
        fetchAndRenderMapData();

        // --- ระบบเพิ่มหมุดร้านค้าใหม่ (Add Mode) ---
        let isAddMode = false;
        let tempMarker = null;
        const addModeBtn = document.querySelector('.add-mode-btn');
        const banner = document.querySelector('.pin-mode-banner');
        const resetLocBtn = document.querySelector('.map-control-btn:not(.add-mode-btn)');

        if (addModeBtn) {
            addModeBtn.addEventListener('click', () => {
                isAddMode = !isAddMode;
                if (isAddMode) {
                    addModeBtn.classList.add('active');
                    addModeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> ยกเลิกการปักหมุด';
                    if (banner) banner.style.display = 'block';
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
            if (banner) banner.style.display = 'none';
            mapElement.style.cursor = '';
            if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
        }

        if (resetLocBtn) {
            resetLocBtn.addEventListener('click', () => {
                if (!navigator.geolocation) return alert('เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง');
                resetLocBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                locateUser(true,
                    () => {
                        resetLocBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> ตำแหน่งของฉัน';
                    },
                    () => {
                        alert('ไม่สามารถเข้าถึงตำแหน่งได้');
                        resetLocBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> ตำแหน่งของฉัน';
                    }
                );
            });
        }

        // Restore the marker for visitors who have already granted location access.
        locateUser(false);

        map.on('click', (e) => {
            if (!isAddMode) return;
            const { lat, lng } = e.latlng;
            if (tempMarker) map.removeLayer(tempMarker);

            const popupContent = `
                <div class="add-place-popup">
                    <h4><i class="fa-solid fa-store"></i> เพิ่มร้านค้าใหม่</h4>
                    <form id="quick-add-place-form">
                        <label>ชื่อร้านค้า</label>
                        <input type="text" id="new-place-name" placeholder="ระบุชื่อร้าน..." required />
                        <label>หมวดหมู่</label>
                        <select id="new-place-category">
                            <option value="คาเฟ่">คาเฟ่</option>
                            <option value="ร้านอาหาร">ร้านอาหาร</option>
                            <option value="ของหวาน">ของหวาน</option>
                        </select>
                        <div class="add-place-popup-actions" style="margin-top:10px; display:flex; gap:5px;">
                            <button type="submit" style="flex:1; background:var(--primary-red); color:white; border:none; padding:5px; border-radius:4px;">บันทึก</button>
                            <button type="button" id="btn-pop-cancel" style="flex:1; background:#ccc; border:none; padding:5px; border-radius:4px;">ยกเลิก</button>
                        </div>
                    </form>
                </div>
            `; 
            tempMarker = L.marker([lat, lng], { icon: redIcon, draggable: true }).addTo(map);
            tempMarker.bindPopup(popupContent, { maxWidth: 250 }).openPopup();

            setTimeout(() => {
                const form = document.getElementById('quick-add-place-form');
                if (form) form.addEventListener('submit', async (ev) => {
                    ev.preventDefault();
                    const name = document.getElementById('new-place-name').value;
                    const cat = document.getElementById('new-place-category').value;
                    if (supabaseClient) {
                        try {
                            // หากตารางชื่อ shops ให้เปลี่ยนเป็น shops
                            await supabaseClient.from('places').insert([{ name: name, category: cat, lat: lat, lng: lng }]);
                            alert('เพิ่มร้านค้าสำเร็จ!');
                            fetchAndRenderMapData(); // โหลดข้อมูลใหม่
                        } catch(err) { alert('ข้อผิดพลาด: '+err.message); }
                    }
                    exitAddMode();
                });
                const cancelBtn = document.getElementById('btn-pop-cancel');
                if (cancelBtn) cancelBtn.addEventListener('click', exitAddMode);
            }, 100);
        });
    }

    // ==========================================
    // 10. ระบบการสุ่มไพ่ร้านค้า (random.html)
    // ==========================================
    const tarotCard = document.getElementById('tarotCard');
    const btnRandom = document.getElementById('btnRandom');
    
    if (tarotCard && btnRandom) {
        const pickRandomShop = async () => {
            const catFilter = document.getElementById('random-category').value;
            const priceFilter = document.getElementById('random-price').value;
            let availableShops = mockPlaces;

            if (supabaseClient) {
                try {
                    const { data } = await supabaseClient.from('places').select('*'); // หรือ shops
                    if (data && data.length > 0) availableShops = data;
                } catch(e) { console.error(e); }
            }

            let filtered = availableShops.filter(shop => {
                const sCat = shop.category || '';
                let matchCat = true;
                if (catFilter === 'food') matchCat = sCat.includes('อาหาร');
                else if (catFilter === 'study') matchCat = sCat.includes('อ่านหนังสือ') || sCat.includes('คาเฟ่');
                else if (catFilter === 'game') matchCat = sCat.includes('เกม');

                const sPrice = shop.price_range || shop.price || '$$';
                const matchPrice = (priceFilter === 'all' || sPrice.includes(priceFilter));
                return matchCat && matchPrice;
            });

            if (filtered.length === 0) return alert("ไม่พบร้านตามเงื่อนไขที่เลือก ลองเปลี่ยนตัวกรองดูนะครับ!");

            const selected = filtered[Math.floor(Math.random() * filtered.length)];

            const updateCardData = () => {
                document.getElementById('res-title').textContent = selected.name;
                document.getElementById('res-img').src = selected.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500';
                document.getElementById('res-rating').textContent = selected.rating || 'N/A';
                document.getElementById('res-cat').textContent = selected.category || 'ร้านค้า';
                document.getElementById('res-price').textContent = selected.price_range || selected.price || '$$';
                document.getElementById('res-desc').textContent = selected.review_snippet || 'สถานที่น่าสนใจรอบรั้ว มธ.';
                document.getElementById('res-link').href = `detail.html?id=${selected.id}`;
            };

            if (tarotCard.classList.contains('flipped')) {
                tarotCard.classList.remove('flipped');
                setTimeout(() => { updateCardData(); tarotCard.classList.add('flipped'); }, 400);
            } else {
                updateCardData();
                tarotCard.classList.add('flipped');
            }
        };
        btnRandom.addEventListener('click', pickRandomShop);
        tarotCard.addEventListener('click', pickRandomShop);
    }

    // ==========================================
    // 11. ระบบกิจกรรม: สิทธิ์เพิ่มกิจกรรมและตัวกรองระยะทาง (events.html)
    // ==========================================
    const eventsPage = document.getElementById('events-page');
    if (eventsPage) {
        const filterPills = document.querySelectorAll('.tag-pill');
        const distanceSelect = document.getElementById('event-distance-range');
        const locateEventsBtn = document.getElementById('event-use-location');
        const locationStatus = document.getElementById('event-location-status');
        const addActivityBtn = document.getElementById('add-activity-btn');
        const activityDialog = document.getElementById('add-activity-dialog');
        const activityForm = document.getElementById('add-activity-form');
        const closeActivityDialog = document.getElementById('close-activity-dialog');
        const eventsGrid = document.querySelector('.events-grid');
        let selectedCategory = 'all';
        let userCoordinates = null;

        const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
        const distanceInKm = (a, b) => {
            const toRadians = degrees => degrees * Math.PI / 180;
            const dLat = toRadians(b.lat - a.lat);
            const dLng = toRadians(b.lng - a.lng);
            const value = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
            return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
        };

        function applyEventFilters() {
            const maximumDistance = distanceSelect.value === 'all' ? null : Number(distanceSelect.value);
            document.querySelectorAll('.event-card').forEach(card => {
                const categoryMatches = selectedCategory === 'all' || card.dataset.category.split(' ').includes(selectedCategory);
                const lat = Number(card.dataset.lat);
                const lng = Number(card.dataset.lng);
                const hasCoordinates = card.dataset.lat !== undefined && card.dataset.lng !== undefined;
                const distanceMatches = !maximumDistance || !hasCoordinates || (userCoordinates && Number.isFinite(lat) && Number.isFinite(lng) && distanceInKm(userCoordinates, { lat, lng }) <= maximumDistance);
                const visible = categoryMatches && distanceMatches;
                card.classList.toggle('hidden', !visible);
                card.style.display = visible ? 'flex' : 'none';
            });
        }

        function requestEventLocation() {
            if (!navigator.geolocation) {
                locationStatus.textContent = 'เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง';
                return;
            }
            locateEventsBtn.disabled = true;
            locationStatus.textContent = 'กำลังค้นหาตำแหน่ง...';
            navigator.geolocation.getCurrentPosition(position => {
                userCoordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
                locationStatus.textContent = 'กำลังกรองตามตำแหน่งของคุณ';
                locateEventsBtn.disabled = false;
                applyEventFilters();
            }, () => {
                locationStatus.textContent = 'ไม่สามารถเข้าถึงตำแหน่งได้';
                locateEventsBtn.disabled = false;
                distanceSelect.value = 'all';
                applyEventFilters();
            }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
        }

        filterPills.forEach(pill => pill.addEventListener('click', () => {
            filterPills.forEach(button => button.classList.remove('active'));
            pill.classList.add('active');
            selectedCategory = pill.dataset.category;
            applyEventFilters();
        }));
        locateEventsBtn.addEventListener('click', requestEventLocation);
        distanceSelect.addEventListener('change', () => {
            if (distanceSelect.value !== 'all' && !userCoordinates) requestEventLocation();
            else applyEventFilters();
        });

        async function updateActivityCreationAccess() {
            if (!supabaseClient) return;
            const { data: { session } } = await supabaseClient.auth.getSession();
            addActivityBtn.hidden = !(session && session.user);
        }
        updateActivityCreationAccess().catch(() => { addActivityBtn.hidden = true; });

        addActivityBtn.addEventListener('click', () => activityDialog.showModal());
        closeActivityDialog.addEventListener('click', () => activityDialog.close());

        activityForm.addEventListener('submit', async event => {
            event.preventDefault();
            if (!supabaseClient) return;
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session || !session.user) {
                activityDialog.close();
                addActivityBtn.hidden = true;
                return;
            }
            const formData = new FormData(activityForm);
            const activity = Object.fromEntries(formData.entries());
            const categoryNames = { food: 'อาหาร & ตลาดนัด', sports: 'กีฬา & กิจกรรม', promo: 'โปรโมชันส่วนลด', concert: 'คอนเสิร์ต & ดนตรี' };
            const savedActivities = JSON.parse(localStorage.getItem('tu_aroi_custom_activities') || '[]');
            savedActivities.push(activity);
            localStorage.setItem('tu_aroi_custom_activities', JSON.stringify(savedActivities));
            renderCustomActivity(activity, true);
            activityForm.reset();
            activityDialog.close();

            function renderCustomActivity(item, shouldFilter) {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.dataset.category = item.category;
                card.innerHTML = `<div class="event-img-wrapper"><span class="event-status-badge status-upcoming">⏳ เพิ่มใหม่</span><span class="event-cat-badge">${escapeHtml(categoryNames[item.category])}</span></div><div class="event-body"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><div class="event-meta-info"><div class="event-meta-item"><i class="fa-regular fa-calendar"></i> ${escapeHtml(item.dateTime)}</div><div class="event-meta-item"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.location)}</div></div></div>`;
                eventsGrid.prepend(card);
                if (shouldFilter) applyEventFilters();
            }
        });

        JSON.parse(localStorage.getItem('tu_aroi_custom_activities') || '[]').forEach(activity => {
            const categoryNames = { food: 'อาหาร & ตลาดนัด', sports: 'กีฬา & กิจกรรม', promo: 'โปรโมชันส่วนลด', concert: 'คอนเสิร์ต & ดนตรี' };
            const card = document.createElement('div');
            card.className = 'event-card';
            card.dataset.category = activity.category;
            card.innerHTML = `<div class="event-img-wrapper"><span class="event-status-badge status-upcoming">⏳ เพิ่มใหม่</span><span class="event-cat-badge">${escapeHtml(categoryNames[activity.category])}</span></div><div class="event-body"><h3>${escapeHtml(activity.title)}</h3><p>${escapeHtml(activity.description)}</p><div class="event-meta-info"><div class="event-meta-item"><i class="fa-regular fa-calendar"></i> ${escapeHtml(activity.dateTime)}</div><div class="event-meta-item"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(activity.location)}</div></div></div>`;
            eventsGrid.prepend(card);
        });
    }
});
